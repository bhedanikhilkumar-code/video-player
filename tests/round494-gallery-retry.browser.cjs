const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await p.addInitScript(()=>{const real=indexedDB.open.bind(indexedDB);let fail=true;indexedDB.open=function(name,...args){if(name==='vp-frames.v1'&&fail){fail=false;throw new DOMException('Storage temporarily unavailable','SecurityError');}return real(name,...args);};});
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await pick(files.slice(0,1));await p.locator('#lpGal285>summary').click();assert.match(await p.locator('#lpGalMsg285').innerText(),/could not be read/i);await p.locator('#lpGalRetry494').click();await p.waitForFunction(()=>document.querySelector('#lpGalMsg285').textContent.includes('No frames yet'));assert.equal(await p.locator('#lpGalRetry494').isVisible(),false);assert.match(await p.locator('#lpGalMsg285').innerText(),/No frames yet/);await p.locator('#lpGalAdd285').click();await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285>button').length===1);
 console.log('PASS gallery read failure is explained and retry recovers normal save without reload');
}).catch(e=>{console.error(e);process.exitCode=1});
