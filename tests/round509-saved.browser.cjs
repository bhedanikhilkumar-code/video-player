const assert=require('node:assert/strict'),fs=require('fs');
require('./round445-harness.cjs')(async({p,pick,boot,c})=>{
 const key='vp-playback-cues.v1';
 const open=async()=>{await p.locator('#playbackCues509 > summary').click();await p.locator('#pcExchange509 > summary').click();};
 await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await open();
 await p.locator('#pcName509').fill('Keep this cue');await p.locator('#pcTime509').fill('6');await p.locator('#pcValue509').selectOption('0.75');await p.locator('#pcAdd509').click();await p.locator('#pcSave509').click();
 assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).length,key),1);
 for(let n=0;n<2;n++){
  await boot();await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await open();
  assert.equal(await p.locator('#pcList509 li').count(),0);assert.equal(await p.evaluate(()=>window.__vpCues509.snapshot().armed),false);
  await p.locator('#pcRecall509').click();assert.equal(await p.locator('#pcList509 li').count(),0);await p.locator('#pcApply509').click();assert.ok((await p.locator('#pcList509').textContent()).includes('Keep this cue'));
 }
 await p.locator('#pcForget509').click();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).length,key),0);assert.equal(await p.locator('#pcList509 li').count(),1);await p.locator('#pcUndo509').click();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).length,key),1);
 const download=p.waitForEvent('download');await p.locator('#libExport').click();const d=await download,backup=JSON.parse(fs.readFileSync(await d.path(),'utf8'));
 assert.equal(backup.settings[key][0].cues[0].name,'Keep this cue');
 // Invalid rows in a full backup are rejected by the same validator as portable import.
 const reload=p.waitForEvent('load');await p.locator('#libImportFile').setInputFiles({name:'cue-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({app:'hd-video-player',version:2,settings:{[key]:[backup.settings[key][0],{app:'hd-video-player-cues',version:1,file:{name:'Bad'},cues:[]}]}}))});await reload;await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).length,key),1);
 await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await open();await p.locator('#pcRecall509').click();await p.locator('#pcApply509').click();
 // Another tab changes saved data without replacing or arming this tab's draft.
 const other=await c.newPage();await other.goto(p.url());await other.evaluate(k=>localStorage.setItem(k,'[]'),key);await p.waitForFunction(()=>document.querySelector('#pcSavedStatus509').textContent.includes('another tab'));assert.equal(await p.locator('#pcList509 li').count(),1);assert.equal(await p.evaluate(()=>window.__vpCues509.snapshot().armed),false);await other.close();
 console.log('PASS saved cues: save, two fresh loads, reviewed restore, forget/undo, full backup export/import validation, multi-tab draft safety');
}).catch(e=>{console.error(e);process.exitCode=1;});
