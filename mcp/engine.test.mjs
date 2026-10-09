import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const temp=mkdtempSync(join(tmpdir(),'miab-mcp-test-'));
process.env.MIAB_STATE_FILE=join(temp,'run.json');
const game=await import('./engine.mjs');
const guide=readFileSync(resolve(fileURLToPath(new URL('../source/gm-field-guide.md',import.meta.url))), 'utf8');
test.after(()=>rmSync(temp,{recursive:true,force:true}));

test('all 24 scenes have canonical data and matching director notes',()=>{
  assert.equal(game.validateCampaign(),true);
  assert.equal(game.campaign.sessions.length,8);
  for(const session of game.campaign.sessions) {
    for(const [index,scene] of session.scenes.entries()) {
      assert.ok(game.getScene(scene.id).scene.procedure.length>60);
      assert.ok(guide.includes('### '+session.id+String.fromCharCode(65+index)+'. '));
    }
  }
});
test('initial run is empty and has eight sessions',()=>{
  const state=game.loadState();
  assert.equal(state.activeScene,null);
  assert.equal(game.overview().sessions.length,8);
  assert.equal(game.recap().sessions.length,8);
});
test('GM marks scenes and records outcomes without auto-advancing',()=>{
  game.startScene('0-plan');
  assert.equal(game.loadState().activeScene,'0-plan');
  game.completeScene('0-plan','partial','They chose to rush the alignment.');
  assert.equal(game.loadState().completed['0-plan'].outcome,'partial');
  assert.equal(game.loadState().activeScene,'0-plan');
});
test('clues are explicit, reversible, and bounded',()=>{
  game.revealClue(0,1,true);
  assert.equal(game.getScene('0-plan').essentialClues[0].revealed,true);
  game.revealClue(0,1,false);
  assert.equal(game.getScene('0-plan').essentialClues[0].revealed,false);
  assert.throws(()=>game.revealClue(0,50,true),/out of range/);
});
test('clocks enforce a session-specific maximum',()=>{
  game.setClock(0,3);
  assert.equal(game.recap(0).sessions[0].clock.value,3);
  assert.throws(()=>game.setClock(0,4),/Clock value/);
  assert.throws(()=>game.setClock(1,1),/no campaign clock/);
});
test('notes are persisted, and invalid data rejected',()=>{
  game.addNote('Pip is helping the group','1-cartoon');
  assert.equal(game.loadState().notes.at(-1).sceneId,'1-cartoon');
  assert.throws(()=>game.startScene('not-a-scene'),/Unknown scene/);
  assert.throws(()=>game.completeScene('0-plan','legendary'),/Outcome must/);
});
