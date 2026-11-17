const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();await p.locator('#playbackCues509 > summary').click();
 await p.locator('#pcTime509').fill('1');await p.locator('#pcAction509').selectOption('seek');await p.locator('#pcSeekVal509').fill('');await p.locator('#pcAdd509').click();
 assert.equal((await p.evaluate(()=>window.__vpCues509.snapshot())).cues.length,0,'blank jump destination must not silently become zero');
 console.log('PASS blank cue destination rejected');
}).catch(e=>{console.error(e);process.exitCode=1;});
