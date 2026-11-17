const assert=require('node:assert/strict'),cp=require('child_process'),fs=require('fs'),os=require('os'),path=require('path');
require('./round445-harness.cjs')(async({p,pick,files,errors})=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'scene504-')),file=path.join(dir,'cuts.mp4');
 try{
 cp.execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=red:s=320x180:r=10:d=3','-f','lavfi','-i','color=c=blue:s=320x180:r=10:d=3','-f','lavfi','-i','color=c=white:s=320x180:r=10:d=3','-filter_complex','[0:v][1:v][2:v]concat=n=3:v=1:a=0[v]','-map','[v]','-c:v','libx264','-preset','ultrafast','-y',file]);
 await pick([{name:'Three scenes.mp4',mimeType:'video/mp4',buffer:fs.readFileSync(file)}]);
 await p.locator('#sceneNav504>summary').click();
 const before=await p.locator('#lpVideo').evaluate(v=>({t:v.currentTime,paused:v.paused,rate:v.playbackRate}));
 await p.locator('#snScan504').click();await p.waitForFunction(()=>!document.querySelector('#snScan504').disabled,{},{timeout:30000});
 assert.equal(await p.locator('#snScenes504 li').count(),3);
 assert.match(await p.locator('#snInfo504').textContent(),/0.50/);
 const after=await p.locator('#lpVideo').evaluate(v=>({t:v.currentTime,paused:v.paused,rate:v.playbackRate}));assert.deepEqual(after,before,'scan never moves or starts primary');
 await p.locator('#snScenes504 button').nth(1).click();assert.ok(Math.abs(await p.locator('#lpVideo').evaluate(v=>v.currentTime)-3)<.15);
 await p.locator('#snScenes504 button').nth(2).click();assert.ok(Math.abs(await p.locator('#lpVideo').evaluate(v=>v.currentTime)-6)<.15);
 // A scan is session-only. Replacing a file cannot leave stale seek targets.
 await pick(files.slice(0,1));assert.equal(await p.locator('#snScenes504 li').count(),0);
 await p.locator('#snScan504').click();await p.locator('#snCancel504').click();assert.equal(await p.locator('#snScenes504 li').count(),0);assert.match(await p.locator('#snStatus504').textContent(),/cancelled/);
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#snScenes504 li').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS scan actual hard cuts; unmodified primary clock/play state/rate; scene jump; file change and cancellation; reload has no stale results');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}).catch(e=>{console.error(e);process.exitCode=1;});
