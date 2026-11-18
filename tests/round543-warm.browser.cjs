const assert=require('node:assert/strict');require('./round538-harness.cjs')(async({p,errors})=>{
 let attempts=0;await p.route('https://vp-downloader.onrender.com/health',r=>{attempts++;return attempts===1?r.abort('internetdisconnected'):r.fulfill({body:'ok'});});
 if(await p.locator('#dl').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#dl .sec-toggle').click();
 await Promise.all([p.waitForEvent('requestfailed',r=>r.url().endsWith('/health')),p.locator('#dlUrl').focus()]);
 // The failed promise must settle before a second user gesture, without an unhandled error.
 await p.locator('#dlInfoBtn').focus();await Promise.all([p.waitForResponse(r=>r.url().endsWith('/health')),p.locator('#dlUrl').focus()]);
 assert.equal(attempts,2);assert.deepEqual(errors,[]);console.log('PASS failed downloader warm-up handled; later focus can wake the server again');
}).catch(e=>{console.error(e);process.exitCode=1;});
