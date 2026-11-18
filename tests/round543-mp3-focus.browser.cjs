const assert=require('node:assert/strict');require('./round538-harness.cjs')(async({p,errors})=>{
 // The health warm-up is unrelated to this keyboard test. Give it a valid response.
 await p.route('https://vp-downloader.onrender.com/health',r=>r.fulfill({body:'ok'}));
 if(await p.locator('#dl').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#dl .sec-toggle').click();
 const b=p.locator('#dlMp3QChips536 button').filter({hasText:'320k'});await b.focus();await p.keyboard.press('Enter');assert.equal(await b.evaluate(e=>document.activeElement===e),true);assert.equal(await b.getAttribute('aria-pressed'),'true');await p.keyboard.press('Tab');assert.notEqual(await p.evaluate(()=>document.activeElement.tagName),'BODY');assert.equal(await b.evaluate(e=>document.activeElement===e),false);
 await b.focus();await p.locator('#langBtn').click();await p.waitForFunction(()=>document.querySelector('#langBtn').getAttribute('aria-busy')==='false');assert.equal(await p.locator('#dlMp3QRow536').getAttribute('aria-label'),'MP3 क्वालिटी');await b.focus();await p.keyboard.press('Enter');assert.equal(await b.evaluate(e=>document.activeElement===e),true);assert.deepEqual(errors,[]);console.log('PASS MP3 keyboard focus and translated group name');
}).catch(e=>{console.error(e);process.exitCode=1;});
