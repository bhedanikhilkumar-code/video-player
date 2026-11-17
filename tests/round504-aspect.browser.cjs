const assert=require('node:assert/strict'),cp=require('child_process'),fs=require('fs'),os=require('os'),path=require('path');
require('./round445-harness.cjs')(async({p,pick})=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'scene504-portrait-')),f=path.join(dir,'portrait.mp4');try{
 cp.execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-f','lavfi','-i','testsrc2=size=180x320:rate=10:duration=4','-c:v','libx264','-preset','ultrafast','-y',f]);await pick([{name:'Portrait.mp4',mimeType:'video/mp4',buffer:fs.readFileSync(f)}]);await p.locator('#sceneNav504>summary').click();await p.locator('#snScan504').click();await p.waitForFunction(()=>!document.querySelector('#snScan504').disabled);await p.locator('#snScenes504 img').first().waitFor();await p.waitForFunction(()=>document.querySelector('#snScenes504 img')?.naturalWidth>0);
 assert.deepEqual(await p.locator('#snScenes504 img').first().evaluate(i=>[i.naturalWidth,i.naturalHeight,getComputedStyle(i).objectFit]),[108,192,'contain']);console.log('PASS portrait thumbnails retain 9:16 pixels rather than stretching into a 16:9 sample');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}).catch(e=>{console.error(e);process.exitCode=1;});
