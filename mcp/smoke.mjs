import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const temp=mkdtempSync(join(tmpdir(),'miab-mcp-smoke-'));
const child=spawn(process.execPath,[new URL('./server.mjs',import.meta.url).pathname],{
  cwd:new URL('.',import.meta.url).pathname,
  env:{...process.env,MIAB_STATE_FILE:join(temp,'run.json')},
  stdio:['pipe','pipe','pipe']
});
const pending=new Map();
let buffer='',stderr='';
child.stderr.on('data',chunk=>{stderr+=chunk.toString();});
child.stdout.on('data',chunk=>{
  buffer+=chunk.toString();
  let next;
  while((next=buffer.indexOf('\n'))>=0) {
    const line=buffer.slice(0,next).trim();buffer=buffer.slice(next+1);
    if(!line)continue;
    let data;try{data=JSON.parse(line);}catch(e){for(const p of pending.values())p.reject(Error('Non-JSON output: '+line));continue;}
    if(data.id!==undefined && pending.has(data.id)){
      const p=pending.get(data.id);pending.delete(data.id);p.resolve(data);
    }
  }
});
let id=1;
function request(method,params){
  const now=id++;
  const promise=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{pending.delete(now);reject(Error('Timed out '+method+'; stderr: '+stderr));},12000);
    pending.set(now,{resolve:value=>{clearTimeout(timeout);resolve(value);},reject:e=>{clearTimeout(timeout);reject(e);}});
  });
  child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:now,method,params})+'\n');
  return promise;
}
try {
  const init=await request('initialize',{protocolVersion:'2026-07-28',capabilities:{},clientInfo:{name:'miab-smoke',version:'0.1.0'}});
  assert.ok(init.result?.serverInfo,'initialize must return server info; '+JSON.stringify(init));
  child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');
  const tools=await request('tools/list',{});
  assert.ok(tools.result?.tools?.some(x=>x.name==='get_scene'),'missing scene tool: '+JSON.stringify(tools));
  assert.ok(tools.result?.tools?.some(x=>x.name==='complete_scene'),'missing state tools');
  const scene=await request('tools/call',{name:'get_scene',arguments:{scene_id:'2-rescue'}});
  const output=JSON.stringify(scene.result);
  assert.match(output,/Save the people on both sides/);
  assert.match(output,/stepByStepGMGuide/);
  const start=await request('tools/call',{name:'start_scene',arguments:{scene_id:'2-rescue'}});
  assert.match(JSON.stringify(start.result),/2-rescue/);
  const recap=await request('tools/call',{name:'session_recap',arguments:{session:2}});
  assert.match(JSON.stringify(recap.result),/Public danger/);
  console.log('MCP stdio handshake, tools list, canonical scene, and state write/read: PASS');
} finally {
  child.kill();
  rmSync(temp,{recursive:true,force:true});
}
