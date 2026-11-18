const assert=require('node:assert/strict'),fixture=require('./round543-fixture.cjs')();
require('./round538-harness.cjs')(async({p,c,boot,origin,errors})=>{
 await p.evaluate(()=>{const create=VPSoundCompare547.create;VPSoundCompare547.create=(...a)=>window.__soundAB547=create(...a);});
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.play());await p.locator('#soundCompare547 summary').click();
 const saved=await p.evaluate(()=>localStorage.getItem('vp-lp.v1'));await p.locator('#soundCompareButton547').click();assert.equal(await p.evaluate(()=>__soundAB547.active()),true);assert.equal(await p.evaluate(()=>localStorage.getItem('vp-lp.v1')),saved,'A/B never changes saved settings');
 await p.evaluate(()=>{window.__abMeter547=__lpCtx.createAnalyser();__abMeter547.fftSize=256;__lpOutput276.connect(__abMeter547);});
 const level=()=>p.evaluate(()=>{const a=new Float32Array(256);__abMeter547.getFloatTimeDomainData(a);return Math.max(...a.map(Math.abs));});
 await p.waitForTimeout(100);assert.ok(await level()>.01,'original sound reaches common output');await p.locator('#lpVideo').evaluate(v=>v.dispatchEvent(new Event('seeking')));await p.waitForTimeout(100);assert.ok(await level()<.0001,'seek mute also gates original sound');await p.locator('#lpVideo').evaluate(v=>v.dispatchEvent(new Event('seeked')));await p.waitForTimeout(100);assert.ok(await level()>.01,'seeked restores original');
 await p.locator('#lpMonoBtn').click();assert.equal(await p.evaluate(()=>__soundAB547.active()),false,'changing effects returns to processed sound');
 await p.locator('#soundCompareButton547').click();await p.locator('#lpVideo').evaluate(v=>v.pause());await p.waitForFunction(()=>!__soundAB547.active());assert.equal(await p.evaluate(()=>__soundAB547.active()),false,'pause ends comparison');await p.locator('#soundCompareButton547').click();await p.locator('#lpFile').setInputFiles({name:'second547.wav',mimeType:'audio/wav',buffer:require('node:fs').readFileSync(fixture)});await p.waitForFunction(()=>!__soundAB547.active());
 await boot();assert.equal(await p.locator('#soundCompareButton547').getAttribute('aria-pressed'),'false');assert.deepEqual(errors,[]);
 console.log('PASS whole-effects comparison: real output, common seek mute, no storage writes, edit/pause/file/reload resets');
}).catch(e=>{console.error(e);process.exitCode=1;});
