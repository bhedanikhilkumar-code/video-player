const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,boot})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#playbackCues509 > summary').click();
 const add=async(t,a,val)=>{await p.locator('#pcTime509').fill(t);await p.locator('#pcAction509').selectOption(a);if(a==='seek')await p.locator('#pcSeekVal509').fill(val);else if(val)await p.locator('#pcValue509').selectOption(val);await p.locator('#pcAdd509').click();};
 const snap=()=>p.evaluate(()=>window.__vpCues509.snapshot());
 await add('3','rate','0.75');await add('8','seek','15');await add('25','pause');const before=await snap();
 await p.locator('#pcTiming513 > summary').click();await p.locator('#ctShift513').fill('2.25');await p.locator('#ctPreview513').click();assert.equal(await p.locator('#ctReview513').isVisible(),true);assert.deepEqual(await snap(),before,'preview is read-only');
 assert.match(await p.locator('#ctRows513').textContent(),/0:03.*0:05.25/);
 await p.locator('#ctCancel513').click();assert.deepEqual(await snap(),before,'cancel preserves sheet');
 await p.locator('#ctTargets513').check();await p.locator('#ctPreview513').click();await p.locator('#ctApply513').click();let after=await snap();assert.deepEqual(after.cues.map(c=>c.time),[5.25,10.25,27.25]);assert.equal(after.cues[1].value,17.25);assert.equal(after.armed,false);
 await p.locator('#ctShift513').fill('-20');await p.locator('#ctPreview513').click();assert.equal(await p.locator('#ctReview513').isVisible(),false);assert.deepEqual(await snap(),after,'out-of-range transform is atomic refusal');
 await p.locator('#ctShift513').fill('1');await p.locator('#ctPreview513').click();await p.locator('#pcList509 li').first().getByRole('button',{name:'Remove playback cue',exact:true}).click();await p.waitForTimeout(80);assert.equal(await p.locator('#ctReview513').isVisible(),false,'new edit invalidates preview');
 await p.locator('#ctPreview513').click();await pick();assert.equal(await p.locator('#ctReview513').isVisible(),false,'source change invalidates review');assert.equal((await snap()).cues.length,0);
 await boot();await pick();assert.equal((await snap()).cues.length,0,'fresh load never applies timing or arms');await boot();assert.equal((await snap()).armed,false);
 console.log('PASS cue shift: review/cancel/apply, jump targets, bounds, edit/source invalidation, repeat fresh loads');
}).catch(e=>{console.error(e);process.exitCode=1;});
