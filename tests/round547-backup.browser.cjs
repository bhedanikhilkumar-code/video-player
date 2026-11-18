const assert=require('node:assert/strict'),fs=require('node:fs'),fixture=require('./round543-fixture.cjs')();
require('./round538-harness.cjs')(async({p,boot,errors})=>{
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#peakSoftener547 summary').click();await p.locator('[data-peak547="strong"]').click();await p.locator('#soundCompare547 summary').click();await p.locator('#soundCompareButton547').click();
 if(await p.locator('#library').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#library .sec-toggle').click();
 const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#libExpSet289').click()]);const data=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 assert.equal(data.settings['vp-lp.v1'].peak547,'strong');assert.equal(JSON.stringify(data).includes('comparing547'),false,'session comparison not exported');
 await p.locator('[data-peak547="off"]').click();const loaded=p.waitForEvent('load');await p.locator('#libImportFile').setInputFiles({name:'peak-settings547.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await loaded;await p.waitForFunction(()=>window.__vpMainOk325);
 assert.equal(await p.locator('[data-peak547="strong"]').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#soundCompareButton547').getAttribute('aria-pressed'),'false');
 if(await p.locator('#help').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#help .sec-toggle').click();await p.locator('#resetAllBtn').click();const reset=p.waitForEvent('load');await p.locator('#vpAskBg .vp-ask-row button').last().click();await reset;await p.waitForFunction(()=>window.__vpMainOk325);
 assert.equal(await p.locator('[data-peak547="off"]').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#soundCompareButton547').getAttribute('aria-pressed'),'false');assert.deepEqual(errors,[]);
 console.log('PASS peak preference settings backup/import/reset; temporary whole-effects comparison stays out of saved settings');
}).catch(e=>{console.error(e);process.exitCode=1;});
