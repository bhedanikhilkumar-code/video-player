const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.pause());await p.waitForTimeout(500);
 await p.evaluate(()=>{const proto=window.AudioContext.prototype,decode=proto.decodeAudioData;window.__releaseWav549=null;proto.decodeAudioData=function(bytes,ok,fail){if(window.__releaseWav549)return decode.call(this,bytes,ok,fail);return new Promise((resolve,reject)=>{window.__releaseWav549=()=>decode.call(this,bytes).then(x=>{ok(x);resolve(x);},e=>{fail(e);reject(e);});});};});
 let downloads=0;p.on('download',()=>downloads++);await p.locator('#lpWavBtn288').click();await p.waitForFunction(()=>typeof window.__releaseWav549==='function');
 await p.locator('#lpFile').setInputFiles({name:'Other owned file.wav',mimeType:'audio/wav',buffer:require('node:fs').readFileSync(fixture)});await p.locator('#lpVideo').evaluate(v=>v.pause());await p.evaluate(()=>window.__releaseWav549());await p.waitForFunction(()=>!document.querySelector('#lpWavBtn288').disabled);await p.waitForTimeout(150);
 console.log('stale sound-export downloads:',downloads);assert.equal(downloads,0,'changing the selected file must discard the old export instead of silently downloading it');assert.deepEqual(errors,[]);
}).catch(e=>{console.error(e);process.exitCode=1;});
