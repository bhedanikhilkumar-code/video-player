const assert=require('node:assert/strict'),fs=require('fs'),languageTap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 > summary').click();await p.locator('#fmCapture490').click();
 await p.locator('#fmCrop492 summary').click();assert.equal(await p.locator('#fmCropSave492').isEnabled(),false);
 for(const [k,v] of Object.entries({X:100,Y:40,W:280,H:200}))await p.locator('#fmCrop'+k+'492').fill(String(v));await p.locator('#fmCropApply492').click();
 assert.equal(await p.locator('#fmCropOverlay492').isVisible(),true);assert.ok((await p.locator('#fmCrop492').textContent()).includes('280 × 200 pixels at 100, 40'));
 const source=await p.locator('#fmCanvas490').evaluate(c=>[...c.getContext('2d').getImageData(200,100,1,1).data]);
 const download=p.waitForEvent('download');await p.locator('#fmCropSave492').click();const d=await download;await d.saveAs('/downloads/round492-crop.png');const bytes=fs.readFileSync('/downloads/round492-crop.png');assert.equal(bytes.readUInt32BE(16),280);assert.equal(bytes.readUInt32BE(20),200);
 await p.evaluate(()=>{window.__vpFrameGalAdd=async(blob,w,h)=>{const img=await createImageBitmap(blob),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0);window.cropSaved492={w,h,pixel:[...c.getContext('2d').getImageData(100,60,1,1).data]};img.close();}});await p.locator('#fmCropKeep492').click();await p.waitForFunction(()=>window.cropSaved492);assert.deepEqual(await p.evaluate(()=>cropSaved492),{w:280,h:200,pixel:source});
 // Invalid coordinates leave the usable selection intact.
 await p.locator('#fmCropW492').fill('10000');await p.locator('#fmCropApply492').click();assert.ok((await p.locator('#fmCrop492').textContent()).includes('280 × 200'));assert.ok((await p.locator('#frameMarkup490 > [role=status]').textContent()).includes('Enter whole pixel'));
 await p.locator('#fmCropClear492').click();assert.equal(await p.locator('#fmCropSave492').isEnabled(),false);
 // Pointer selection works in both directions, without consuming annotation slots.
 await p.locator('#fmTool490').selectOption('crop');await p.locator('#fmCanvas490').scrollIntoViewIfNeeded();let r=await p.locator('#fmCanvas490').boundingBox();await p.mouse.move(r.x+r.width*.8,r.y+r.height*.8);await p.mouse.down();await p.mouse.move(r.x+r.width*.2,r.y+r.height*.2,{steps:5});await p.mouse.up();assert.equal(await p.locator('#fmUndo490').isEnabled(),false);assert.equal(await p.locator('#fmCropSave492').isEnabled(),true);
 await p.screenshot({path:'/downloads/round492-crop-desktop.png'});
 await p.setViewportSize({width:390,height:844});for(const lang of ['hi','gu']){for(let i=0;i<3&&await p.locator('html').getAttribute('lang')!==lang;i++)await languageTap(p);await p.locator('#fmCanvas490').scrollIntoViewIfNeeded();if(await p.locator('#lpMiniClose447').isVisible())await p.locator('#lpMiniClose447').click();await p.locator('#fmCanvas490').evaluate(e=>e.scrollIntoView({block:'start'}));assert.ok(await p.locator('#frameMarkup490').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await p.screenshot({path:'/downloads/round492-crop-'+lang+'.png'});}
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx')});assert.equal(await p.locator('#fmCropSave492').isEnabled(),true);
 await p.locator('#fmDiscard490').click();await p.locator('#fmCapture490').click();assert.equal(await p.locator('#fmCropSave492').isEnabled(),false);
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await pick(files.slice(0,1));await p.locator('#frameMarkup490 > summary').click();assert.equal(await p.locator('#fmCanvas490').isVisible(),false);await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#fmCrop492').count(),1);
 console.log('PASS crop selection, numeric validation, PNG dimensions/pixels, gallery metadata, reverse drag, mini, hi/gu 390px, dark/contrast/calm/low-end, recapture and fresh/repeat reset');
}).catch(e=>{console.error(e);process.exitCode=1});
