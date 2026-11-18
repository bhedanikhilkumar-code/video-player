const assert=require('node:assert/strict'),fs=require('fs'),tap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});await p.locator('#lpGal285>summary').click();await p.locator('#frameArchive496>summary').click();
 // Independent synthetic PNG archive: the import test must not depend on an export test in another shard.
 const bytes=Buffer.from(await p.evaluate(async()=>{
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#164c72';ctx.fillRect(0,0,640,360);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png')),png=new Uint8Array(await blob.arrayBuffer());
  const meta=new TextEncoder().encode(JSON.stringify({version:1,frames:[{name:'<script>private title</script>',ts:1,w:640,h:360,bytes:png.length},{name:'Second frame',ts:2,w:640,h:360,bytes:png.length}]}));
  const out=new Uint8Array(14+meta.length+png.length*2);out.set(new TextEncoder().encode('VPFRAMES1\n'));new DataView(out.buffer).setUint32(10,meta.length,false);out.set(meta,14);out.set(png,14+meta.length);out.set(png,14+meta.length+png.length);return Array.from(out);
 })),upload=async buffer=>{await p.locator('#frameArchiveFile496').setInputFiles({name:'frames.vpframes',mimeType:'application/octet-stream',buffer});await p.waitForFunction(()=>!document.querySelector('#frameArchiveExport496').disabled);};
 for(const bad of [bytes.subarray(0,40),Buffer.from('not an archive'),Buffer.concat([bytes,Buffer.from('trailing')])]){await upload(bad);assert.match(await p.locator('#frameArchiveStatus496').textContent(),/not a valid/);assert.equal(await p.locator('#frameArchiveAdd496').isDisabled(),true);}
 await upload(bytes);assert.equal(await p.locator('#frameArchivePreview496 li').count(),2);assert.equal(await p.locator('#lpGalGrid285>button').count(),0,'preview must not write');assert.match(await p.locator('#frameArchivePreview496').textContent(),/<script>private title<\/script>/);assert.equal(await p.locator('#frameArchivePreview496 script').count(),0);
 await p.locator('#frameArchiveCancel496').click();assert.equal(await p.locator('#frameArchivePreview496 li').count(),0);await upload(bytes);
 for(const lang of ['en','hi','gu']){for(let n=0;n<3&&(await p.locator('html').getAttribute('lang'))!==lang;n++)await tap(p);await p.setViewportSize({width:390,height:844});await p.locator('#frameArchive496').scrollIntoViewIfNeeded();assert.ok(await p.locator('#frameArchive496').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await p.screenshot({path:'/downloads/round496-import-'+lang+'.png'});}
 // Force a real transaction abort after one successful write. Nothing may survive.
 await p.evaluate(()=>{const add=IDBObjectStore.prototype.add;window.fail496=true;IDBObjectStore.prototype.add=function(...args){const r=add.apply(this,args);if(this.name==='frames'&&window.fail496){window.fail496=false;const t=this.transaction;r.addEventListener('success',()=>t.abort());}return r;};});
 await p.locator('#frameArchiveAdd496').click();await p.waitForFunction(()=>!document.querySelector('#frameArchiveAdd496').disabled);assert.equal(await p.locator('#lpGalGrid285>button').count(),0);assert.equal(await p.locator('#frameArchivePreview496 li').count(),2);
 await p.locator('#frameArchiveAdd496').click();await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285>button').length===2);assert.equal(await p.locator('#frameArchivePreview496 li').count(),0);await p.locator('#lpGalGrid285>button').first().click();assert.equal(await p.locator('#lpGalName492').inputValue(),'<script>private title</script>');await p.locator('#lpGalClose285').click();
 for(let n=0;n<2;n++){await p.reload();await p.waitForFunction(()=>window.__vpMainOk325&&document.querySelector('#frameArchiveFile496'));await pick(files.slice(0,1));await p.locator('#lpGal285>summary').click();await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285>button').length===2);assert.equal(await p.locator('#frameArchiveAdd496').isDisabled(),true);}
 console.log('PASS frame import strict magic/length/PNG decode, preview before write, names inert, cancel, atomic rollback and retry, persisted fresh/repeat, en/hi/gu390');
}).catch(e=>{console.error(e);process.exitCode=1});
