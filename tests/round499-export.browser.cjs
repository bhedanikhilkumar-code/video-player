const assert=require('node:assert/strict'),fs=require('fs');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#dualSub499>summary').click();
 const file=(name,text)=>({name,mimeType:'text/plain',buffer:Buffer.from(text)});
 await p.locator('#dualFile499').setInputFiles(file('second.srt','1\n00:00:03,000 --> 00:00:08,000\nनमस्ते &lt;world&gt;\n\n2\n00:00:15,000 --> 00:00:18,000\nOnly second\n'));
 await p.waitForFunction(()=>!document.querySelector('#dualExport499').disabled);
 await p.locator('#dualExport499').click();assert.match(await p.locator('#dualStatus499').textContent(),/Load both primary/);
 await p.locator('#lpSubFile').setInputFiles(file('first.srt','1\n00:00:01,000 --> 00:00:05,000\nHello\n\n2\n00:00:05,000 --> 00:00:09,000\nWorld\n'));
 await p.waitForFunction(()=>document.querySelector('#lpVideo track')?.track?.cues?.length===2);
 const download=async()=>{const wait=p.waitForEvent('download');await p.locator('#dualExport499').click();const d=await wait;return fs.readFileSync(await d.path(),'utf8');};
 let text=await download();assert.equal(text,'WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello\n\n00:00:03.000 --> 00:00:05.000\nHello\nनमस्ते &lt;world&gt;\n\n00:00:05.000 --> 00:00:08.000\nWorld\nनमस्ते &lt;world&gt;\n\n00:00:08.000 --> 00:00:09.000\nWorld\n\n00:00:15.000 --> 00:00:18.000\nOnly second\n\n');
 await p.locator('#dualOffset499').fill('-4');await p.locator('#dualApply499').click();text=await download();assert.match(text,/00:00:00.000 --> 00:00:01.000\nनमस्ते &lt;world&gt;/);assert.match(text,/00:00:11.000 --> 00:00:14.000\nOnly second/);
 console.log('PASS bilingual VTT sweep splits boundaries, preserves primary-only and companion-only gaps, escapes cue markup, includes timing offset, missing-primary guard');
}).catch(e=>{console.error(e);process.exitCode=1});
