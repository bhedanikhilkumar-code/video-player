const assert=require('node:assert/strict'),fs=require('fs');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));const sub='WEBVTT\n\n00:00:01.000 --> 00:00:04.000 align:start\nThe clock says 00:10:00.000, keep that text.\n\n00:00:05.000 --> 00:00:09.000\nSecond line\n';
 await p.locator('#lpSubFile').setInputFiles({name:'clock.vtt',mimeType:'text/vtt',buffer:Buffer.from(sub)});
 await p.waitForFunction(()=>document.querySelector('#lpVideo track')?.track?.cues?.length===2);
 await p.locator('#lpSubSync button').nth(1).click();
 const wait=p.waitForEvent('download');await p.locator('#lpSubSaveBtn').click();const d=await wait,text=fs.readFileSync(await d.path(),'utf8');assert.match(text,/00:00:01.500 --> 00:00:04.500 align:start/);assert.match(text,/The clock says 00:10:00.000, keep that text\./);console.log('PASS primary subtitle sync only shifts cue timing lines, leaves spoken timestamps and VTT cue settings unchanged');
}).catch(e=>{console.error(e);process.exitCode=1});
