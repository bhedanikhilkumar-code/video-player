const assert=require('node:assert/strict'),fs=require('fs');
require('./round445-harness.cjs')(async({p,pick,bytes})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#playbackCues509 > summary').click();
 await p.locator('#pcName509').fill('Slow the solo');await p.locator('#pcTime509').fill('5');await p.locator('#pcAdd509').click();await p.locator('#pcExchange509 summary').click();
 const download=p.waitForEvent('download');await p.locator('#pcExport509').click();const d=await download;const sheet=JSON.parse(fs.readFileSync(await d.path(),'utf8'));
 assert.equal(sheet.app,'hd-video-player-cues');assert.equal(sheet.file.name,'Opening.mp4');assert.equal(sheet.cues.length,1);assert.equal(sheet.cues[0].time,5);
 const upload=async(data)=>{await p.locator('#pcFile509').setInputFiles({name:'cues.json',mimeType:'application/json',buffer:Buffer.from(typeof data==='string'?data:JSON.stringify(data))});};
 sheet.cues[0].name='<b>Imported literal title</b>';sheet.cues[0].value=.5;await upload(sheet);await p.waitForFunction(()=>!document.querySelector('#pcReview509').hidden);
 assert.equal(await p.locator('#pcReviewList509 b').count(),0);assert.equal(await p.locator('#pcList509 li').count(),1);assert.ok((await p.locator('#pcList509 li').textContent()).includes('Slow the solo'));
 await p.locator('#pcReject509').click();assert.equal(await p.locator('#pcReview509').isVisible(),false);
 await upload(sheet);await p.locator('#pcApply509').click();assert.ok((await p.locator('#pcList509 li').textContent()).includes('<b>Imported literal title</b>'));assert.equal(await p.evaluate(()=>window.__vpCues509.snapshot().armed),false);
 for(const bad of [{...sheet,file:{...sheet.file,size:1}},{...sheet,cues:[{...sheet.cues[0],time:100000}]},{...sheet,cues:[{...sheet.cues[0],value:10}]},'{bad json']){
  await upload(bad);await p.waitForFunction(()=>document.querySelector('#pcExchangeStatus509').textContent.length>0);assert.equal(await p.locator('#pcReview509').isVisible(),false);assert.equal(await p.locator('#pcList509 li').count(),1);
 }
 await upload(sheet);await p.locator('#lpNext').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);assert.equal(await p.locator('#pcReview509').isVisible(),false);assert.equal(await p.locator('#pcList509 li').count(),0);
 console.log('PASS cue exchange: JSON export, reviewed import/cancel, literal names, no auto-arm, wrong-file/invalid limits, source-change invalidation');
}).catch(e=>{console.error(e);process.exitCode=1;});
