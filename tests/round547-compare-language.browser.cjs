const assert=require('node:assert/strict'),fixture=require('./round543-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.setViewportSize({width:390,height:844});await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.play());await p.locator('#soundCompare547 summary').click();
 for(const [lang,title] of [['hi','साउंड इफ़ेक्ट की तुलना करें'],['gu','સાઉન્ડ ઇફેક્ટની સરખામણી કરો'],['en','Compare sound effects']]){
  await p.locator('#langBtn').click();await p.waitForFunction(t=>document.querySelector('#soundCompareTitle547').textContent===t,title);
  await p.locator('#soundCompareButton547').click();assert.equal(await p.locator('#soundCompareButton547').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#soundCompare547').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);
  await p.locator('#soundCompare547').scrollIntoViewIfNeeded();await p.waitForTimeout(600);await p.screenshot({path:'/downloads/compare547-'+lang+'.png'});await p.locator('#soundCompareButton547').click();
 }
 assert.deepEqual(errors,[]);console.log('PASS sound comparison mobile en/hi/gu labels, active states and width');
}).catch(e=>{console.error(e);process.exitCode=1;});
