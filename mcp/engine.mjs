import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const campaign = JSON.parse(readFileSync(resolve(ROOT, 'app/campaign.json'), 'utf8'));
const defaultStateFile = resolve(process.env.XDG_STATE_HOME || resolve(homedir(), '.local/state'), 'message-in-a-bottle', 'run.json');
export const stateFile = process.env.MIAB_STATE_FILE ? resolve(process.env.MIAB_STATE_FILE) : defaultStateFile;

const emptyState = () => ({ schema: 1, activeScene: null, completed: {}, revealedClues: {}, clocks: {}, notes: [], updatedAt: null });
const allScenes = campaign.sessions.flatMap(session => session.scenes.map(scene => ({ ...scene, session: session.id })));
const sceneIds = new Set(allScenes.map(scene => scene.id));

export function sessionById(session) {
  const s = campaign.sessions.find(s => s.id === Number(session));
  if (!s) throw new Error('Unknown session: ' + session);
  return s;
}
export function sceneById(id) {
  const s = allScenes.find(s => s.id === id);
  if (!s) throw new Error('Unknown scene: ' + id);
  return s;
}
export function loadState(file = stateFile) {
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8'));
    if (raw.schema !== 1) throw new Error('Unsupported save file version');
    return { ...emptyState(), ...raw, completed: raw.completed || {}, revealedClues: raw.revealedClues || {}, clocks: raw.clocks || {}, notes: raw.notes || [] };
  } catch (error) {
    if (error.code === 'ENOENT') return emptyState();
    throw error;
  }
}
export function saveState(state, file = stateFile) {
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const safe = { ...state, updatedAt: new Date().toISOString() };
  const temp = file + '.tmp-' + process.pid;
  writeFileSync(temp, JSON.stringify(safe, null, 2) + '\n', { mode: 0o600 });
  renameSync(temp, file);
  return safe;
}
export function overview(state = loadState()) {
  return {
    title: campaign.title, release: 'Free Fan Edition 0.1 · unplaytested',
    audience: 'GM only; spoilers in most tools',
    sessions: campaign.sessions.map(s => ({
      id: s.id, title: s.title, purpose: s.purpose,
      scenes: s.scenes.map(x => ({ id:x.id, title:x.title, complete: !!state.completed[x.id] })),
      clock: s.clock ? { label: s.clock.label, value: state.clocks[s.id] || 0, max: s.clock.max } : null
    })), activeScene: state.activeScene, updatedAt: state.updatedAt
  };
}
export function getScene(id, state = loadState()) {
  const scene = sceneById(id);
  const session = sessionById(scene.session);
  return {
    gmSpoilers: true, session: session.id, sessionTitle:session.title,
    sessionPurpose:session.purpose, openingReadAloud:session.readAloud,
    scene, essentialClues:session.essentialClues.map((clue, i)=>({
      clueIndex:i+1, text:clue, revealed:!!state.revealedClues[session.id + ':' + (i+1)]
    })),
    sessionClock:session.clock ? { ...session.clock, value:state.clocks[session.id] || 0 }:null,
    sessionOutcomes:session.outcomes, nextScene:session.next,
    completed:state.completed[id] || null,
    gmGuide: 'Read source/gm-field-guide.md, section ' + (session.id) + String.fromCharCode(65 + session.scenes.findIndex(s=>s.id===id)) + ', for timed beats, read-aloud cue, branch handling, and failure-forward guidance.'
  };
}
export function startScene(id, state=loadState()) {
  sceneById(id);
  return saveState({ ...state, activeScene:id });
}
export function completeScene(id, outcome, note='', state=loadState()) {
  sceneById(id);
  if (!['success','partial','failure','other'].includes(outcome)) throw new Error('Outcome must be success, partial, failure, or other');
  if (note.length > 4000) throw new Error('Note is too long');
  return saveState({ ...state, completed: { ...state.completed, [id]: { outcome, note, at:new Date().toISOString() } } });
}
export function revealClue(sessionId, clueIndex, revealed=true, state=loadState()) {
  const session=sessionById(sessionId);
  const index=Number(clueIndex);
  if (!Number.isInteger(index) || index < 1 || index > session.essentialClues.length) throw new Error('Clue index out of range');
  return saveState({ ...state, revealedClues:{...state.revealedClues, [session.id + ':' + index]:!!revealed} });
}
export function setClock(sessionId, value, state=loadState()) {
  const session=sessionById(sessionId);
  if (!session.clock) throw new Error('This session has no campaign clock');
  if (!Number.isInteger(value) || value<0 || value>session.clock.max) throw new Error('Clock value must be 0 to ' + session.clock.max);
  return saveState({ ...state, clocks:{...state.clocks, [session.id]:value} });
}
export function addNote(text, sceneId=null, state=loadState()) {
  if (!text || text.trim().length>2000) throw new Error('Note must contain between 1 and 2000 characters');
  if (sceneId!==null) sceneById(sceneId);
  const notes=[...state.notes, { text:text.trim(), sceneId, at:new Date().toISOString() }];
  if (notes.length>1000) throw new Error('Note limit reached. Back up your save before adding more.');
  return saveState({ ...state, notes });
}
export function recap(sessionId=null, state=loadState()) {
  const sessions=sessionId===null ? campaign.sessions : [sessionById(sessionId)];
  return {
    activeScene:state.activeScene,
    sessions:sessions.map(s=>({
      id:s.id, title:s.title,
      scenes:s.scenes.map(x=>({id:x.id,title:x.title,completed:state.completed[x.id]||null})),
      essentialClues:s.essentialClues.map((text,i)=>({text,revealed:!!state.revealedClues[s.id+':'+(i+1)]})),
      clock:s.clock ? { ...s.clock, value:state.clocks[s.id]||0}:null,
      next:s.next
    })), notes:state.notes.filter(n=>sessionId===null || n.sceneId===null || sceneById(n.sceneId).session===Number(sessionId)).slice(-30)
  };
}
export function validateCampaign() {
  if (campaign.sessions.length !== 8) throw new Error('Expected 8 sessions');
  if (allScenes.length !== 24 || sceneIds.size !== 24) throw new Error('Expected 24 unique scenes');
  for (const s of campaign.sessions) {
    if (s.scenes.length !== 3) throw new Error('Each session must have three scenes');
    for (const scene of s.scenes) for (const k of ['id','title','procedure','clue','prompt'])
      if (!scene[k]) throw new Error('Scene ' + scene.id + ' missing ' + k);
  }
  return true;
}
