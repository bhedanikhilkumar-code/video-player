const assert=require('node:assert/strict'),tap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});await p.locator('#lpGal285>summary').click();await p.waitForFunction(()=>document.querySelector('#lpGalMsg285').textContent.includes('No frames yet'));
 await tap(p);assert.match(await p.locator('#lpGalMsg285').textContent(),/अभी कोई फ़्रेम/);await tap(p);assert.match(await p.locator('#lpGalMsg285').textContent(),/હજી કોઈ ફ્રેમ/);await tap(p);
 await p.locator('#lpGalAdd285').click();await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285>button').length===1);await p.waitForTimeout(150);assert.match(await p.locator('#lpGalMsg285').textContent(),/Frame added/);await tap(p);assert.match(await p.locator('#lpGalMsg285').textContent(),/फ़्रेम गैलरी में जुड़/);
 await p.locator('#lpGalClear285').click();await tap(p);assert.match(await p.locator('#lpGalMsg285').textContent(),/ફરી ટૅપ/);await p.locator('#lpGalClear285').click();await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285>button').length===0);await p.waitForTimeout(150);assert.match(await p.locator('#lpGalMsg285').textContent(),/ગૅલરી ખાલી/);await tap(p);assert.equal(await p.locator('#lpGalMsg285').textContent(),'Gallery cleared.');
 console.log('PASS gallery empty/add/clear statuses survive async repaint and translate immediately across en/hi/gu');
}).catch(e=>{console.error(e);process.exitCode=1});
