const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});await p.locator('#clipItinerary500>summary').click();
 for(const name of ['First','Second']){await p.locator('#ciName500').fill(name);await p.locator('#ciStart500').fill('1');await p.locator('#ciEnd500').fill('3');await p.locator('#ciAdd500').click();}
 await p.locator('#ciList500 li').nth(1).getByRole('button',{name:'Move clip earlier',exact:true}).click();assert.equal(await p.locator('#ciList500 li').first().locator('button').nth(1).evaluate(e=>e===document.activeElement),true,'when moving to an edge, focus must remain on an enabled control for the moved clip');
 await p.locator('#ciList500 li').first().getByRole('button',{name:'Remove clip',exact:true}).click();assert.equal(await p.locator('#ciList500 li').first().getByRole('button',{name:'Remove clip',exact:true}).evaluate(e=>e===document.activeElement),true,'deleting a row must focus the next row rather than the page body');
 const described=await p.locator('#ciList500 li button').first().getAttribute('aria-describedby');assert.ok(described);assert.match(await p.locator('#'+described).textContent(),/First/);
 await p.locator('#ciList500 li').first().getByRole('button',{name:'Preview clip',exact:true}).click();assert.equal(await p.locator('#ciStop500').evaluate(e=>e===document.activeElement),true);await p.locator('#ciStop500').press('Enter');assert.equal(await p.locator('#ciPlay500').evaluate(e=>e===document.activeElement),true);
 await p.locator('#ciList500 li').first().getByRole('button',{name:'Remove clip',exact:true}).click();assert.equal(await p.locator('#ciName500').evaluate(e=>e===document.activeElement),true);
 console.log('PASS keyboard focus after reorder, delete, preview/start-stop and empty list; controls described by their clip name and range');
}).catch(e=>{console.error(e);process.exitCode=1;});
