const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 await p.evaluate(()=>localStorage.setItem('vp-library.v1',JSON.stringify({favs:[],queue:[],later:[],hist:[{id:'dQw4w9WgXcQ',title:'Rick Astley',ts:1}]})));
 await boot();
 await p.evaluate(()=>window.__vpSwitch506.open());
 await p.locator('#rswClose506').focus();await p.keyboard.press('Enter');
 assert.equal(await p.locator('#rswBg506').count(),0);
 assert.equal(await p.locator('iframe[src*="/embed/dQw4w9WgXcQ"]').count(),0,'Enter on Close started video');
 console.log('PASS Enter on Recent switcher Close closes without starting a video');
}).catch(e=>{console.error(e);process.exitCode=1;});
