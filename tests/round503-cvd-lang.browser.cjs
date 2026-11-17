const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,origin})=>{
 await p.addInitScript(()=>localStorage.setItem('vp-prefs.v1',JSON.stringify({lang:'hi',langPick360:true,lowFxHinted:true})));
 await p.goto(origin+'/?v=dQw4w9WgXcQ&cb=503b');await p.waitForFunction(()=>window.__vpMainOk325&&!document.getElementById('controls').hidden);
 assert.equal(await p.locator('#cvdLab503').textContent(),'रंग-दृष्टि सहायक');
 assert.equal(await p.locator('#cvdChips503 .chip[data-k="deu"]').textContent(),'हरा कमज़ोर');
 await p.waitForFunction(()=>/रंग-दृष्टि सहायक/.test(document.getElementById('whatsNewList').textContent),null,{timeout:20000});
});
