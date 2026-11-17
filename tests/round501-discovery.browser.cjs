const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,errors})=>{
 await pick(files.slice(0,1));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
 for(const name of ['Audition reviewed caption clips','Find and collect caption moments']){
  if(await p.locator('#captionClips501').evaluate(e=>e.open))await p.locator('#captionClips501>summary').click();if(await p.locator('#clipItinerary500').evaluate(e=>e.open))await p.locator('#clipItinerary500>summary').click();await p.locator('#lpFile').evaluate(e=>e.closest('section').scrollIntoView({block:'start'}));
  await p.locator('#palBtn').click();await p.locator('#vpPalIn').fill(name);await p.locator('#vpPalIn').press('Enter');await p.waitForFunction(()=>!document.querySelector('#vpPal'));
  await p.waitForFunction(()=>{const e=document.querySelector('#captionClips501'),r=e.getBoundingClientRect();return e.open&&r.top<innerHeight&&r.bottom>100;},{},{timeout:2500});assert.equal(await p.locator('#clipItinerary500').evaluate(e=>e.open),true);assert.equal(await p.locator('#ccRead501').isDisabled(),false);
 }
 await p.waitForFunction(()=>document.querySelectorAll('#whatsNewList .wnew-name').length===10&&[...document.querySelectorAll('#whatsNewList .wnew-name')].some(e=>e.textContent==='Reset itinerary with Undo'),{},{timeout:18000});
 const names=await p.locator('#whatsNewList .wnew-name').allTextContents();for(const name of ['Captions to clips','Clip context and joining','Find and collect caption moments','Audition reviewed caption clips','Reset itinerary with Undo'])assert.ok(names.includes(name),name+' must be in the capped latest ten');assert.equal(names.length,10);assert.deepEqual(errors,[]);console.log('PASS early finder discovery reaches caption instructions before captions or a review exist; all five function names remain in capped What is new');
}).catch(e=>{console.error(e);process.exitCode=1;});
