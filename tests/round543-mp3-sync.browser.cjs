const assert=require('node:assert/strict');require('./round538-harness.cjs')(async({p,c,origin,errors})=>{
 await c.route('https://vp-downloader.onrender.com/health',r=>r.fulfill({body:'ok'}));
 const open=async page=>{if(await page.locator('#dl').evaluate(e=>e.classList.contains('sec-collapsed')))await page.locator('#dl .sec-toggle').click();};await open(p);
 const peer=await c.newPage();await peer.goto(origin);await peer.waitForFunction(()=>window.__vpMainOk325);await open(peer);await peer.locator('[data-quality="320"]').click();await p.waitForFunction(()=>document.querySelector('[data-quality="320"]').getAttribute('aria-pressed')==='true');
 // Read actual queued request state, not just the selected styling.
 await p.locator('#dlUrl').fill('https://example.org/recording');await p.locator('#dlBulkMp3').check();await p.locator('#dlQAllBtn').click();
 assert.ok((await p.locator('#dlQ').textContent()).includes('320'),'new queue item uses peer-updated bitrate');
 await peer.evaluate(()=>localStorage.removeItem('vp-dl-mp3q'));await p.waitForFunction(()=>document.querySelector('[data-quality="192"]').getAttribute('aria-pressed')==='true');
 await peer.evaluate(()=>localStorage.setItem('vp-dl-mp3q','999'));await p.waitForFunction(()=>document.querySelector('[data-quality="192"]').getAttribute('aria-pressed')==='true');await peer.close();assert.deepEqual(errors,[]);console.log('PASS MP3 peer choice reaches UI and queued bitrate; removed/invalid values default safely');
}).catch(e=>{console.error(e);process.exitCode=1;});
