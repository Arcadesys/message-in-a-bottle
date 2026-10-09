import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import {
  campaign, overview, getScene, sceneById, sessionById, startScene,
  completeScene, revealClue, setClock, addNote, recap, validateCampaign,
  stateFile
} from './engine.mjs';

validateCampaign();
const guide = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../source/gm-field-guide.md'), 'utf8');
const asText = data => ({ content: [{ type:'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }] });
const guidance = (id) => {
  const scene=sceneById(id);
  const session=sessionById(scene.session);
  const index=session.scenes.findIndex(s=>s.id===id);
  const prefix='### ' + session.id + String.fromCharCode(65+index) + '. ';
  const start=guide.indexOf(prefix);
  if(start<0) throw new Error('Missing guide for scene ' + id);
  const next=guide.indexOf('\n### ',start+prefix.length);
  const nextSession=guide.indexOf('\n## Session ',start+prefix.length);
  const stops=[next,nextSession].filter(n=>n>=0);
  return guide.slice(start, stops.length ? Math.min(...stops) : guide.length).trim();
};
const briefing=guide.slice(0, guide.indexOf('\n## Session 0:')).trim();

function createServer() {
  const server=new McpServer({name:'message-in-a-bottle-gm', version:'0.1.0'});
  server.registerTool('campaign_overview',{
    description:'GM-only index of all eight sessions, 24 scenes, clock status and completed scenes. Contains spoilers.',
    inputSchema:z.object({}), annotations:{readOnlyHint:true}
  },async()=>asText(overview()));
  server.registerTool('gm_briefing',{
    description:'Read the spoiler-filled five-minute GM quick-start, safety guidance and how to run a scene.',
    inputSchema:z.object({}), annotations:{readOnlyHint:true}
  },async()=>asText(briefing));
  server.registerTool('get_scene',{
    description:'Get canonical scenario facts, procedures, clues and detailed scene-director instructions for a scene ID (e.g. 2-rescue). Does not alter game state. GM eyes only.',
    inputSchema:z.object({scene_id:z.string().describe('Scene ID, e.g. 0-plan, 2-rescue, 7-home')}),
    annotations:{readOnlyHint:true}
  },async({scene_id})=>asText({ ...getScene(scene_id), stepByStepGMGuide:guidance(scene_id) }));
  server.registerTool('start_scene',{
    description:'GM-directed write: mark a scene as the active one. Use ONLY after the GM asks you to switch/start.',
    inputSchema:z.object({scene_id:z.string()}), annotations:{readOnlyHint:false}
  },async({scene_id})=>asText({activeScene:startScene(scene_id).activeScene,scene:getScene(scene_id)}));
  server.registerTool('complete_scene',{
    description:'GM-directed write: record the observed outcome and optional note. Never infer a result the players have not reached.',
    inputSchema:z.object({
      scene_id:z.string(),
      outcome:z.enum(['success','partial','failure','other']),
      note:z.string().max(4000).optional()
    }), annotations:{readOnlyHint:false}
  },async({scene_id,outcome,note})=>asText({completed:completeScene(scene_id,outcome,note||'').completed[scene_id]}));
  server.registerTool('mark_essential_clue',{
    description:'GM-directed write: mark an essential session clue revealed (1-based index). This does NOT reveal player handouts automatically.',
    inputSchema:z.object({session:z.number().int().min(0).max(7),clue_index:z.number().int().min(1),revealed:z.boolean().default(true)}),
    annotations:{readOnlyHint:false}
  },async({session,clue_index,revealed})=>asText({session,clue_index,revealed,clues:recap(session).sessions[0].essentialClues,updatedAt:revealClue(session,clue_index,revealed).updatedAt}));
  server.registerTool('set_pressure_clock',{
    description:'GM-directed write: set an adventure clock to an explicit number (no automatic hidden clock changes). Clock limits validated.',
    inputSchema:z.object({session:z.number().int().min(0).max(7),value:z.number().int().nonnegative()}),
    annotations:{readOnlyHint:false}
  },async({session,value})=>{const state=setClock(session,value);return asText({session,clock:recap(session,state).sessions[0].clock});});
  server.registerTool('record_gm_note',{
    description:'GM-directed write: save a private tabletop note (never enter sensitive player disclosures). Stored only on this machine.',
    inputSchema:z.object({text:z.string().min(1).max(2000),scene_id:z.string().optional()}),
    annotations:{readOnlyHint:false}
  },async({text,scene_id})=>{const state=addNote(text,scene_id||null);return asText({saved:true,latest:state.notes.at(-1)});});
  server.registerTool('session_recap',{
    description:'Read active scene, completed outcomes, tracked clues, clocks and recent notes. Read-only; includes spoilers.',
    inputSchema:z.object({session:z.number().int().min(0).max(7).optional()}),
    annotations:{readOnlyHint:true}
  },async({session})=>asText(recap(session??null)));
  server.registerTool('state_location',{
    description:'Display the LOCAL file path where the GM run is saved; this is not uploaded or shared by the MCP server.',
    inputSchema:z.object({}), annotations:{readOnlyHint:true}
  },async()=>asText({file:stateFile, note:'Back up or copy this file if you want to move your campaign state.'}));
  return server;
}

void serveStdio(createServer);
