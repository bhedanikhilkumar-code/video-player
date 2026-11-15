const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,files})=>{
 await p.locator('#localExchange276').evaluate(e=>e.open=true);
 const plan={format:'vp-local-playlist',version:1,files:files.slice(0,2).map(f=>({name:f.name,size:f.buffer.length})),index:1,position:8};
 await p.locator('#recipeJSON276').setInputFiles({name:'recipe.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(plan))});await p.waitForFunction(()=>!document.querySelector('#recipeLocate276').disabled);
 await p.locator('#recipeMedia276').setInputFiles(files.slice(0,2));assert.equal(await p.locator('#recipeApply276').isDisabled(),false);const reviewed=await p.locator('#recipeReview276').textContent();
 await p.locator('#recipeMedia276').setInputFiles([]);assert.equal(await p.locator('#recipeApply276').isDisabled(),false,'Cancelling a new locate attempt must preserve reviewed matches');assert.equal(await p.locator('#recipeReview276').textContent(),reviewed);
 assert.equal(await p.evaluate(()=>window.vpLocalPlan276().files.length),0);await p.locator('#recipeApply276').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);assert.equal(await p.evaluate(()=>window.vpLocalPlan276().index),1);assert.equal(await p.locator('#lpVideo').evaluate(v=>Math.round(v.currentTime)),8);
 console.log('PASS: cancelling Locate media keeps reviewed matches; explicit Restore still opens the correct file paused at its saved position.');
}).catch(e=>{console.error(e);process.exitCode=1;});
