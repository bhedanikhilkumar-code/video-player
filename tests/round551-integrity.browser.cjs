const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
require('./round538-harness.cjs')(async({p,boot,errors})=>{
 const wav=fs.readFileSync(require('./round548-fixture.cjs')()),hash=crypto.createHash('sha256').update(wav).digest('hex');
 assert.equal(await p.locator('#fiBuild551').isDisabled(),true);
 await p.locator('#lpFile').setInputFiles({name:'Original.wav',mimeType:'audio/wav',buffer:wav});await p.waitForFunction(()=>Number.isFinite(document.querySelector('#lpVideo').duration));await p.locator('#fileIntegrity551 summary').click();
 await p.locator('#lpVideo').evaluate(v=>{v.loop=true;v.playbackRate=1.25;return v.play();});
 const src=await p.locator('#lpVideo').getAttribute('src');
 await p.locator('#fiBuild551').click();await p.waitForFunction(()=>document.querySelector('#fiDigest551').value.length===64);assert.equal(await p.locator('#fiDigest551').inputValue(),hash);
 assert.equal(await p.locator('#lpVideo').getAttribute('src'),src);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),false);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),1.25);
 await p.locator('#fiExpected551').fill(' '+hash.toUpperCase()+' ');assert.equal(await p.locator('#fiExpectedStatus551').textContent(),'Expected SHA-256 matches.');
 await p.locator('#fiExpected551').fill('0'.repeat(64));assert.match(await p.locator('#fiExpectedStatus551').textContent(),/does not match/);
 await p.locator('#fiExpected551').fill(hash.slice(1));assert.equal(await p.locator('#fiExpected551').getAttribute('aria-invalid'),'true');assert.match(await p.locator('#fiExpectedStatus551').textContent(),/64 hexadecimal/);
 await p.locator('#fiExpected551').fill('');assert.equal(await p.locator('#fiExpected551').getAttribute('aria-invalid'),'false');
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async s=>{window.__copied551=s;}}}));await p.locator('#fiCopy551').click();assert.equal(await p.evaluate(()=>window.__copied551),hash);assert.equal(await p.locator('#fiStatus551').textContent(),'SHA-256 copied.');
 await p.evaluate(()=>navigator.clipboard.writeText=async()=>{throw Error('denied');});await p.locator('#fiCopy551').click();assert.match(await p.locator('#fiStatus551').textContent(),/copy it manually/);assert.equal(await p.locator('#fiDigest551').evaluate(e=>e.selectionEnd-e.selectionStart),64);
 await p.locator('#fiPick551').setInputFiles({name:'Same-bytes-renamed.wav',mimeType:'audio/wav',buffer:wav});await p.waitForFunction(()=>document.querySelector('#fiCompareStatus551').textContent.startsWith('Matching'));assert.match(await p.locator('#fiCompareStatus551').textContent(),/Same-bytes-renamed/);
 const changed=Buffer.from(wav);changed[changed.length-2]^=1;
 await p.locator('#fiPick551').setInputFiles({name:'Changed.wav',mimeType:'audio/wav',buffer:changed});await p.waitForFunction(()=>document.querySelector('#fiCompareStatus551').textContent.startsWith('Different'));assert.equal(await p.locator('#fiDigest551').inputValue(),hash);assert.equal(await p.locator('#lpVideo').getAttribute('src'),src);
 // A cancelled hashing job owns the only memory slot until Web Crypto settles.
 await p.evaluate(()=>{window.__realDigest551=crypto.subtle.digest.bind(crypto.subtle);window.__digestCalls551=0;crypto.subtle.digest=(...args)=>{__digestCalls551++;return new Promise(resolve=>{window.__releaseDigest551=async()=>resolve(await __realDigest551(...args));});};});
 await p.locator('#fiBuild551').click();await p.waitForFunction(()=>window.__digestCalls551===1);await p.locator('#fiCancel551').click();assert.equal(await p.locator('#fiBuild551').isDisabled(),true);assert.equal(await p.locator('#fiDigest551').inputValue(),'');assert.match(await p.locator('#fiStatus551').textContent(),/Waiting/);
 await p.evaluate(()=>window.__releaseDigest551());await p.waitForFunction(()=>!document.querySelector('#fiBuild551').disabled);assert.equal(await p.locator('#fiDigest551').inputValue(),'');assert.equal(await p.evaluate(()=>__digestCalls551),1);
 // Source replacement invalidates a deferred original result.
 await p.locator('#fiBuild551').click();await p.waitForFunction(()=>__digestCalls551===2);await p.locator('#lpFile').setInputFiles({name:'Replacement.wav',mimeType:'audio/wav',buffer:changed});await p.waitForFunction(()=>Number.isFinite(document.querySelector('#lpVideo').duration));await p.evaluate(()=>__releaseDigest551());await p.waitForFunction(()=>!document.querySelector('#fiBuild551').disabled);assert.equal(await p.locator('#fiDigest551').inputValue(),'');
 await p.evaluate(()=>{crypto.subtle.digest=__realDigest551;});await p.locator('#fiBuild551').click();await p.waitForFunction(()=>document.querySelector('#fiDigest551').value.length===64);assert.equal(await p.locator('#fiDigest551').inputValue(),crypto.createHash('sha256').update(changed).digest('hex'));
 // Clear removes the expected digest and comparison; fresh/repeat boot never retains hashes.
 await p.locator('#fiExpected551').fill(hash);await p.locator('#fiClear551').click();assert.equal(await p.locator('#fiExpected551').inputValue(),'');assert.equal(await p.locator('#fiCompareStatus551').textContent(),'');assert.equal(await p.locator('#fiCopy551').isDisabled(),true);
 await boot();assert.equal(await p.locator('#fiDigest551').inputValue(),'');await boot();assert.equal(await p.locator('#fiDigest551').inputValue(),'');assert.deepEqual(errors,[]);
 console.log('PASS integrity: native SHA256 vs Node, uppercase expected/mismatch/invalid, clipboard success/fallback, renamed matching and changed-file comparison, playback/rate/source untouched, single-flight cancellation, source race, clear, two boots');
}).catch(e=>{console.error(e);process.exitCode=1;});
