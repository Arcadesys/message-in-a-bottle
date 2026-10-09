// Text-first offline PDF renderer. No npm packages required.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
function buildPdf(markdown, audience="GM") {
  const W=612,H=792,M=54, usable=W-2*M;
  const clean=t=>String(t).normalize("NFKD").replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/\u2026/g,"...").replace(/\u00a0/g," ").replace(/[^\x20-\x7E]/g,"").replace(/[\t ]+/g," ").trim();
  const escape=t=>clean(t).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");
  const width=(s,size)=>Array.from(s).reduce((v,c)=>v+size*(" W@%Mm".includes(c)?0.83:"ijl.,:;'!| ".includes(c)?0.26:"ABCDEFGHKNOPQRSTUVXYZ".includes(c)?0.64:0.50),0);
  const pages=[];let cmds=[],y=H-76;
  const tx=(s,x,yy,size=11,bold=false)=>cmds.push(`0.08 0.13 0.17 rg BT /F${bold?2:1} ${size} Tf 1 0 0 1 ${Math.round(x*10)/10} ${Math.round(yy*10)/10} Tm (${escape(s)}) Tj ET`);
  const rule=(yy)=>cmds.push(`0.6 0.65 0.68 RG 0.8 w ${M} ${yy} m ${W-M} ${yy} l S`);
  function next(){ if(cmds.length)pages.push(cmds);cmds=[];y=H-76; }
  function room(space){if(y-space<59)next();}
  function wrap(s,size,indent=0) {
    const words=clean(s).split(" ").filter(Boolean), out=[];let row="";
    for(const word of words){const candidate=row?row+" "+word:word;if(width(candidate,size)>usable-indent&&row){out.push(row);row=word;}else row=candidate;}
    if(row)out.push(row);return out;
  }
  function para(s,{size=11.2,bold=false,indent=0,gap=5,leading=15.2}={}) {
    for(const ln of wrap(s,size,indent)){room(leading);tx(ln,M+indent,y,size,bold);y-=leading;}
    y-=gap;
  }
  function heading(s,level){
    const sizes={1:23,2:17.4,3:13.3,4:11.6};const pt=sizes[level]||11.6;
    if(level<=2&&/^(Session [0-7] - |[1-5] - )/.test(s)&&pages.length&&y<H-100)next();
    room(pt+26);y-=level<=2?13:9;
    for(const line of wrap(s,pt)){room(pt+4);tx(line,M,y,pt,true);y-=pt+6;}
    y-=8;
  }
  // Cover page.
  tx("MESSAGE IN A BOTTLE",M,H-150,27,true);
  tx("SAVAGE WORLDS ADVENTURE EDITION",M,H-190,15,true);
  rule(H-215);
  tx(audience==="GM"?"COMPLETE GAMEMASTER MODULE - FULL SPOILERS":"PLAYER HANDOUTS - REVEAL AT THE GM'S DIRECTION",M,H-258,13,true);
  tx("Eight gatherings. One city. Nobody owns the people inside it.",M,H-304,12);
  tx("Campaign conception and direction: Austen Tucker-Crowder",M,H-338,11.5);
  tx("Free Fan Edition 0.1  |  Unofficial  |  Unplaytested",M,H-365,11.5);
  tx("Requires the Savage Worlds Adventure Edition core rulebook.",M,H-403,11);
  tx("Human-directed AI tools assisted writing, assembly, and illustrations.",M,H-425,10);
  tx("Free fan product. No purchase or account required.",M,H-447,10);
  tx("This document is designed for printing and offline tabletop use.",M,130,11);
  tx(audience==="GM"?"Only share the separate player handouts as scenes reveal them.":"This booklet contains later-story discoveries. The GM controls when they are seen.",M,108,10);
  next();
  const lines=markdown.replace(/\r/g,"").split("\n");
  for(let raw of lines) {
    raw=raw.trim();
    if(!raw){y-=5;continue;}
    if(/^[-|: ]{3,}$/.test(raw) || /^\|\s*:?-{2,}/.test(raw))continue;
    const match=raw.match(/^(#{1,4})\s+(.*)/);
    if(match){heading(match[2].replace(/\*\*/g,""),match[1].length);continue;}
    raw=raw.replace(/!\[([^\]]*)\]\([^)]+\)/g,"[Illustration: $1]");
    raw=raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g,"$1 ($2)");
    raw=raw.replace(/(\*\*|__|`)/g,"");
    if(raw.startsWith(">"))raw=raw.replace(/^>\s*/,"");
    if(raw.startsWith("|"))raw=raw.replace(/^\|/,"").replace(/\|$/,"").replace(/\s*\|\s*/g,"  /  ");
    const bullet=/^[-*]\s+/.test(raw);
    raw=raw.replace(/^[-*]\s+/,"- ");
    para(raw,{indent:bullet?12:0,gap:bullet?1:5});
  }
  next();
  // Add accessible page furniture after content layout.
  for(let i=1;i<pages.length;i++){
    const c=pages[i];cmds=c;
    tx("MESSAGE IN A BOTTLE  /  "+(audience==="GM"?"GM MODULE":"PLAYER HANDOUTS"),M,H-36,9,true);
    rule(H-45);rule(50);
    tx("Free Fan Edition 0.1  -  Austen Tucker-Crowder",M,36,8);
    tx("Page "+String(i+1),W-M-52,36,8);
  }
  const objects=["","", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"];
  const ids=[];
  for(const content of pages){
    const stream=content.join("\n")+"\n";
    const streamId=objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
    const pageId=objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`);
    ids.push(pageId);
  }
  objects[0]="<< /Type /Catalog /Pages 2 0 R >>";
  objects[1]=`<< /Type /Pages /Kids [${ids.map(n=>`${n} 0 R`).join(" ")}] /Count ${ids.length} >>`;
  let out="%PDF-1.4\n";const offsets=[0];
  objects.forEach((body,i)=>{offsets.push(out.length);out+=`${i+1} 0 obj\n${body}\nendobj\n`});
  const xref=out.length;
  out+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<offsets.length;i++)out+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  out+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return {pdf:out,pages:pages.length};
}
mkdirSync(resolve(root,'pdf'),{recursive:true});
for(const [name,source,audience] of [ ['message-in-a-bottle-module.pdf','module.md','GM'],['message-in-a-bottle-player-handouts.pdf','handouts.md','PLAYER']]){
  const md=readFileSync(resolve(root,'app',source),'utf8');
  const {pdf,pages}=buildPdf(md,audience);
  writeFileSync(resolve(root,'pdf',name),pdf,'ascii');
  console.log(name+': '+pages+' pages');
}
