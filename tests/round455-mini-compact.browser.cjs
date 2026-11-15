const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,origin})=>{
 await p.addInitScript(()=>{localStorage.setItem('vp-library.v1',JSON.stringify({queue:[{id:'dQw4w9WgXcQ',title:'Video One'},{id:'9bZkp7q19f0',title:'Video Two'},{id:'kJQP7kiw5Fk',title:'Video Three'}],later:[],favourites:[],history:[]}));});
 await p.goto(origin+'/?cb=455-t&url=https://youtu.be/dQw4w9WgXcQ');
 await p.waitForFunction(()=>window.__vpMainOk325);await p.waitForTimeout(2500);
 // dock the mini player
 await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(1200);
 const docked=await p.evaluate(()=>document.getElementById('playerDock').classList.contains('is-mini'));
 assert.equal(docked,true,'mini player docks on scroll');
 // fix 1: old up-next line hidden, newer strip visible
 const dup=await p.evaluate(()=>{const a=document.getElementById('miniUpNext'),b=document.getElementById('miniUpNext291');
  return {aDisp:a?getComputedStyle(a).display:'missing',bVis:b?getComputedStyle(b).display!=='none':false};});
 assert.equal(dup.aDisp,'none','round-237 up-next line hidden');
 assert.equal(dup.bVis,true,'round-291 up-next strip visible');
 // new 1: size chip cycles std -> lg -> cmp -> std
 const chip=await p.locator('#miniSizeBtn304');
 await chip.click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-mini-size.v1')),'lg');
 await chip.click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-mini-size.v1')),'cmp');
 const cmpState=await p.evaluate(()=>{const d=document.getElementById('playerDock');return {cls:d.className,h:Math.round(d.getBoundingClientRect().height),frameH:document.getElementById('frameBox').getBoundingClientRect().height,upNext:getComputedStyle(document.getElementById('miniUpNext291')).display,vol:getComputedStyle(document.getElementById('miniVol')).display,playVis:getComputedStyle(document.getElementById('miniPlay')).display,sizeVis:getComputedStyle(document.getElementById('miniSizeBtn304')).display};});
 assert.equal(cmpState.cls.includes('mini-cmp455'),true,'compact class on dock');
 assert.ok(cmpState.h<240,'compact dock is short, got '+cmpState.h);
 assert.ok(cmpState.frameH<=125,'compact video ~120px, got '+cmpState.frameH);
 assert.equal(cmpState.upNext,'none','up-next strip hidden in compact');
 assert.equal(cmpState.vol,'none','volume slider hidden in compact');
 assert.notEqual(cmpState.playVis,'none','play stays');
 assert.notEqual(cmpState.sizeVis,'none','size chip stays');
 // persistence across a fresh load
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await p.waitForTimeout(1500);
 await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(1000);
 const persisted=await p.evaluate(()=>document.getElementById('playerDock').classList.contains('mini-cmp455'));
 assert.equal(persisted,true,'compact survives a fresh load');
 // cycle back to standard
 await p.locator('#miniSizeBtn304').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-mini-size.v1')),'std');
 const stdCls=await p.evaluate(()=>document.getElementById('playerDock').className);
 assert.equal(stdCls.includes('mini-cmp455'),false,'compact class removed');
 console.log('PASS round 455: single up-next strip, compact mini player cycle + persistence');
}).catch(e=>{console.error(e);process.exitCode=1;});
