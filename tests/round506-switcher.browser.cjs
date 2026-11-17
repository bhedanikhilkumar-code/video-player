const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 // seed three history rows (newest first), one with a position, one watched
 await p.evaluate(()=>{
  const lib={hist:[
   {id:'dQw4w9WgXcQ',title:'Never Gonna Give You Up',ts:300,t:0,dur:213,done:true},
   {id:'9bZkp7q19f0',title:'PSY - GANGNAM STYLE',ts:200,t:95,dur:253},
   {id:'kJQP7kiw5Fk',title:'Despacito',ts:100,t:0,dur:282}
  ],favs:[],queue:[],later:[]};
  localStorage.setItem('vp-library.v1',JSON.stringify(lib));
 });
 await boot();
 assert.ok(await p.evaluate(()=>!!document.querySelector('#fxRow #rswBtn506')));
 // empty overlay via setter when history cleared is covered below; open normally
 await p.evaluate(()=>window.__vpSwitch506.open());
 await p.waitForSelector('#rswList506 li');
 let rows=await p.evaluate(()=>[...document.querySelectorAll('#rswList506 li')].map(li=>({t:li.querySelector('.rsw-t').childNodes[0].textContent,s:li.querySelector('.rsw-s').textContent})));
 assert.equal(rows.length,3);
 assert.equal(rows[0].t,'Never Gonna Give You Up');
 assert.ok(rows[0].s.includes('Watched'),rows[0].s);
 assert.ok(rows[1].s.includes('Continue 1:35'),rows[1].s);
 assert.ok(rows[1].s.includes('38%'),rows[1].s);
 // first row selected by default; arrow down moves, Enter plays
 assert.ok(await p.evaluate(()=>document.querySelectorAll('#rswList506 li')[0].classList.contains('rsw-sel')));
 await p.keyboard.press('ArrowDown');
 assert.ok(await p.evaluate(()=>document.querySelectorAll('#rswList506 li')[1].classList.contains('rsw-sel')));
 await p.screenshot({path:'/downloads/r506-switcher-en.png'});
 await p.keyboard.press('Enter');
 await p.waitForFunction(()=>!document.querySelector('#rswBg506'));
 assert.equal(await p.evaluate(()=>document.querySelector('#linkInput').value),'https://youtu.be/9bZkp7q19f0');
 // reopen and Escape closes
 await p.evaluate(()=>window.__vpSwitch506.open());
 await p.waitForSelector('#rswBg506');
 await p.keyboard.press('Escape');
 await p.waitForFunction(()=>!document.querySelector('#rswBg506'));
 // Hindi repaint
 await p.locator('#langBtn').click();
 await p.waitForFunction(()=>document.querySelector('#rswBtn506').textContent.includes('हालिया वीडियो बदलें'));
 await p.evaluate(()=>window.__vpSwitch506.open());
 await p.waitForFunction(()=>document.querySelector('#rswH506').textContent==='हालिया वीडियो');
 assert.ok(await p.evaluate(()=>[...document.querySelectorAll('#rswList506 .rsw-s')].some(s=>s.textContent.includes('जारी रखें 1:35'))));
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(400);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await p.screenshot({path:'/downloads/r506-switcher-hi.png'});
 await p.keyboard.press('Escape');
 // Gujarati repaint
 await p.locator('#langBtn').click();
 await p.waitForFunction(()=>document.querySelector('#rswBtn506').textContent.includes('તાજેતરના વીડિયો બદલો'));
 await p.evaluate(()=>window.__vpSwitch506.open());
 await p.waitForFunction(()=>document.querySelector('#rswH506').textContent==='તાજેતરના વીડિયો');
 assert.ok(await p.evaluate(()=>[...document.querySelectorAll('#rswList506 .rsw-s')].some(s=>s.textContent.includes('ચાલુ રાખો 1:35'))));
 await p.screenshot({path:'/downloads/r506-switcher-gu.png'});
 await p.keyboard.press('Escape');
 // empty state
 await p.evaluate(()=>{const lib=JSON.parse(localStorage.getItem('vp-library.v1'));lib.hist=[];localStorage.setItem('vp-library.v1',JSON.stringify(lib));location.reload();});
 await p.waitForFunction(()=>window.__vpMainOk325&&window.__vpLocalQueue443);
 await p.evaluate(()=>window.__vpSwitch506.open());
 await p.waitForFunction(()=>!document.querySelector('#rswEmpty506').hidden);
 console.log('PASS recent switcher: rows, watched/continue labels, selection, Enter plays, Escape, hi/gu repaint, 390px, empty state');
}).catch(e=>{console.error(e);process.exitCode=1;});
