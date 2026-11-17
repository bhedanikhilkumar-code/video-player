const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 await p.evaluate(()=>localStorage.setItem('vp-library.v1',JSON.stringify({favs:[],later:[],queue:[],hist:[{id:'dQw4w9WgXcQ',title:'First recent video',t:12,dur:213},{id:'9bZkp7q19f0',title:'Second recent video',t:33,dur:253}]})));await boot();
 await p.locator('#palBtn').focus();await p.evaluate(()=>window.__vpSwitch506.open());
 assert.equal(await p.evaluate(()=>document.activeElement.id),'rswList506','video choices must receive keyboard focus');
 assert.equal(await p.locator('#rswList506').getAttribute('role'),'listbox');
 assert.equal(await p.locator('#rswList506').getAttribute('aria-activedescendant'),'rswOption509-0');
 await p.keyboard.press('ArrowDown');assert.equal(await p.locator('#rswList506').getAttribute('aria-activedescendant'),'rswOption509-1');assert.equal(await p.locator('#rswOption509-1').getAttribute('aria-selected'),'true');
 await p.keyboard.press('Home');assert.equal(await p.locator('#rswList506').getAttribute('aria-activedescendant'),'rswOption509-0');await p.keyboard.press('End');assert.equal(await p.locator('#rswList506').getAttribute('aria-activedescendant'),'rswOption509-1');
 await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.id),'rswClose506');await p.keyboard.press('Shift+Tab');assert.equal(await p.evaluate(()=>document.activeElement.id),'rswList506');
 await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement.id),'palBtn');
 await p.evaluate(()=>window.__vpSwitch506.open());await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');await p.waitForFunction(()=>document.querySelector('iframe[src*="/embed/9bZkp7q19f0"]'));
 console.log('PASS recent switcher accessible choices: focused listbox, announced active option, selected state, Home/End, focus cycle, keyboard playback');
}).catch(e=>{console.error(e);process.exitCode=1;});
