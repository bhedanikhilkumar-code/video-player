const assert=require('node:assert/strict'),fs=require('fs'),languageTap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 > summary').click();await p.locator('#fmCapture490').click();
 const original=await p.locator('#fmCanvas490').evaluate(c=>c.toDataURL());
 await p.locator('#fmTool490').selectOption('cover');await p.locator('#fmCanvas490').scrollIntoViewIfNeeded();
 let r=await p.locator('#fmCanvas490').boundingBox();await p.mouse.move(r.x+r.width*.2,r.y+r.height*.2);await p.mouse.down();await p.mouse.move(r.x+r.width*.7,r.y+r.height*.7,{steps:5});await p.mouse.up();
 const pixel=()=>p.locator('#fmCanvas490').evaluate(c=>[...c.getContext('2d').getImageData(c.width*.5,c.height*.5,1,1).data]);assert.deepEqual(await pixel(),[0,0,0,255]);
 // Later labels must not uncover private pixels.
 await p.locator('#fmText490').fill('PRIVATE');await p.locator('#fmCentre490').click();assert.deepEqual(await pixel(),[0,0,0,255]);
 const download=p.waitForEvent('download');await p.locator('#fmSave490').click();await (await download).saveAs('/downloads/round492-privacy.png');
 assert.ok(fs.statSync('/downloads/round492-privacy.png').size>1000);
 await p.locator('#fmUndo490').click();assert.deepEqual(await pixel(),[0,0,0,255]);await p.locator('#fmUndo490').click();assert.equal(await p.locator('#fmCanvas490').evaluate(c=>c.toDataURL()),original);
 // Reverse-direction drags cover the same rectangle.
 await p.locator("#fmCanvas490").scrollIntoViewIfNeeded();r=await p.locator("#fmCanvas490").boundingBox();
 await p.mouse.move(r.x+r.width*.7,r.y+r.height*.7);await p.mouse.down();await p.mouse.move(r.x+r.width*.2,r.y+r.height*.2,{steps:4});await p.mouse.up();assert.deepEqual(await pixel(),[0,0,0,255]);
 await p.setViewportSize({width:390,height:844});for(const lang of ['en','hi','gu']){for(let i=0;i<3&&await p.locator('html').getAttribute('lang')!==lang;i++)await languageTap(p);await p.locator('#fmCanvas490').scrollIntoViewIfNeeded();assert.ok(await p.locator('#frameMarkup490').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await p.screenshot({path:'/downloads/round492-privacy-'+lang+'.png'});}
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx')});assert.deepEqual(await pixel(),[0,0,0,255]);
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await pick(files.slice(0,1));await p.locator('#frameMarkup490 > summary').click();assert.equal(await p.locator('#fmCanvas490').isVisible(),false);await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#frameMarkup490').count(),1);
 console.log('PASS opaque export cover, reverse drag, overlap protection, undo, 390px en/hi/gu, dark/contrast/calm/low-end, fresh/repeat ephemeral reset');
}).catch(e=>{console.error(e);process.exitCode=1});
