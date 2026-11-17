const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,errors})=>{
 await pick(files.slice(0,1));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});await p.locator('#clipItinerary500>summary').click();
 const add=async(name,a,b)=>{await p.locator('#ciName500').fill(name);await p.locator('#ciStart500').fill(String(a));await p.locator('#ciEnd500').fill(String(b));await p.locator('#ciAdd500').click();};
 await add('Opening',1,2);await add('Ending',10,11);assert.equal(await p.locator('#ciList500 li').count(),2);
 await p.locator('#ciList500 li').nth(1).getByRole('button',{name:'Move clip earlier',exact:true}).click();assert.match(await p.locator('#ciList500 li').first().textContent(),/Ending/);
 await p.locator('#ciPlay500').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').currentTime>=10);await p.waitForFunction(()=>document.querySelector('#ciList500 li:nth-child(2)').getAttribute('aria-current')==='step');
 await p.waitForFunction(()=>document.querySelector('#ciStatus500').textContent==='Itinerary finished.');assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.ok(Math.abs(await p.locator('#lpVideo').evaluate(v=>v.currentTime)-2)<.1);
 await p.locator('#ciPlay500').click();await p.locator('#ciStop500').click();assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 await add('Invalid',34.9,40);assert.equal(await p.locator('#ciList500 li').count(),2);assert.match(await p.locator('#ciStatus500').textContent(),/inside this file/);
 await p.locator('#ciList500 li').first().getByRole('button',{name:'Preview clip',exact:true}).click();await p.waitForFunction(()=>document.querySelector('#lpVideo').currentTime>=10);await p.locator('#lpVideo').evaluate(v=>v.currentTime=20);await p.waitForFunction(()=>document.querySelector('#ciStop500').disabled);assert.match(await p.locator('#ciStatus500').textContent(),/outside/);
 // Exact media-end range must not trigger the existing file queue's automatic next.
 await p.locator('#ciList500 li').first().getByRole('button',{name:'Remove clip',exact:true}).click();await p.locator('#ciList500 li').first().getByRole('button',{name:'Remove clip',exact:true}).click();await add('Final half second',34.3,35);await p.locator('#ciPlay500').click();await p.waitForFunction(()=>document.querySelector('#ciStatus500').textContent==='Itinerary finished.');
 await pick(files.slice(1,2));assert.equal(await p.locator('#ciList500 li').count(),0);
 for(let i=0;i<2;i++){await p.reload();await p.waitForFunction(()=>window.__vpMainOk325&&document.querySelector('#clipItinerary500'));assert.equal(await p.locator('#ciList500 li').count(),0);}
 assert.deepEqual(errors,[]);console.log('PASS itinerary reorder, multi-range playback, final pause, stop, bounds, manual seek, media-end, source reset, fresh/repeat');
}).catch(e=>{console.error(e);process.exitCode=1;});
