const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));const file=(name,text)=>({name,mimeType:'text/plain',buffer:Buffer.from(text)});
 await p.locator('#lpSubFile').setInputFiles(file('working.srt','1\n00:00:01,000 --> 00:00:08,000\nKeep this caption\n'));
 await p.waitForFunction(()=>document.querySelector('#lpVideo track')?.track?.cues?.length===1);
 const url=await p.locator('#lpVideo track').getAttribute('src');
 await p.locator('#lpSubFile').setInputFiles(file('empty.vtt','WEBVTT\n\nNOTE no captions\n'));
 await p.waitForTimeout(150);assert.equal(await p.locator('#lpVideo track').getAttribute('src'),url,'invalid caption file must not replace a working track');assert.match(await p.locator('#lpSubMsg').textContent(),/previous subtitles are unchanged/);
 console.log('PASS empty/malformed primary subtitle selection preserves working caption source and explains why');
}).catch(e=>{console.error(e);process.exitCode=1});
