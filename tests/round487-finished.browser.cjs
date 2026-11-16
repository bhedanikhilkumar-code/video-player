const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c,boot})=>{
 await c.addInitScript(()=>{localStorage.setItem('vp-library.v1',JSON.stringify({queue:[],favs:[],later:[],hist:[{id:'dQw4w9WgXcQ',title:'Completed and reset',t:0,dur:214,done:true},{id:'9bZkp7q19f0',title:'Partly watched',t:40,dur:200},{id:'aqz-KE-bpKQ',title:'At the finish line',t:199,dur:200},{id:'60ItHLz5WEA',title:'Rewatch in progress',t:30,dur:200,done:true},{id:'kJQP7kiw5Fk',title:'Never watched',t:0,dur:200}]}));});
 await boot();await p.locator('#searchBuilder487 summary').click();await p.locator('#sbProgress487').selectOption('is:finished');
 assert.equal(await p.locator('#searchBuilder487 [role=status]').textContent(),'Saved-video matches: 2','completed videos keep matching after their resume time resets to zero');
 await p.locator('#sbProgress487').selectOption('is:unfinished');assert.equal(await p.locator('#searchBuilder487 [role=status]').textContent(),'Saved-video matches: 2','partway replay remains unfinished just like Continue watching');
 console.log('PASS finished search: completion at t=0, threshold completion, unfinished and partial replay');
}).catch(e=>{console.error(e);process.exitCode=1;});
