const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 // seed: one unfinished file (position saved), one played-3-times file, one opened once
 await p.evaluate(()=>{
  localStorage.setItem('vp-lp-pos.v1',JSON.stringify({'Lecture part 2.mp4|123456':94}));
  localStorage.setItem('vp-lphist.v1',JSON.stringify({
   'Lecture part 2.mp4':{p:2,t:200,d:300},
   'Old song.mp3':{p:3,t:100,d:180},
   'New clip.mp4':{p:1,t:150,d:60}
  }));
 });
 await boot();
 await p.waitForSelector('#lpRecs505 .pl-item');
 const rows=await p.evaluate(()=>[...document.querySelectorAll('#lpRecs505 .pl-item')].map(li=>({name:li.querySelector('.pl-name').textContent,sub:li.querySelector('.rec-sub').textContent,bar:!!li.querySelector('.rec-bar')})));
 assert.equal(rows.length,3);
 assert.equal(rows[0].name,'Lecture part 2.mp4');
 assert.ok(rows[0].sub.startsWith('Continue from 1:34'),rows[0].sub);
 assert.ok(rows[0].sub.includes('31%'),rows[0].sub);
 assert.ok(rows[0].bar,'progress bar for unfinished');
 assert.equal(rows[1].name,'Old song.mp3');assert.ok(rows[1].sub.includes('3'),rows[1].sub);
 assert.equal(rows[2].name,'New clip.mp4');assert.ok(rows[2].sub.includes('Opened once'),rows[2].sub);
 await p.screenshot({path:'/downloads/r505-recs-en.png'});
 // Hindi repaint
 await p.locator('#langBtn').click();
 await p.waitForFunction(()=>document.querySelector('#lpRecsH505').textContent==='आपके लिए चुने गए');
 assert.ok((await p.evaluate(()=>document.querySelector('#lpRecs505 .rec-sub').textContent)).startsWith('यहाँ से जारी: 1:34'));
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(400);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await p.screenshot({path:'/downloads/r505-recs-hi.png'});
 // Gujarati repaint
 await p.locator('#langBtn').click();
 await p.waitForFunction(()=>document.querySelector('#lpRecsH505').textContent==='તમારા માટે પસંદ કરેલા');
 assert.ok((await p.evaluate(()=>document.querySelector('#lpRecs505 .rec-sub').textContent)).startsWith('અહીંથી ચાલુ: 1:34'));
 await p.screenshot({path:'/downloads/r505-recs-gu.png'});
 // hide removes the row and its saved position
 await p.evaluate(()=>{[...document.querySelectorAll('#lpRecs505 .pl-item')].find(li=>li.querySelector('.pl-name').textContent==='New clip.mp4').querySelector('.pl-del').click();});
 await p.waitForFunction(()=>document.querySelectorAll('#lpRecs505 .pl-item').length===2);
 // empty state after hiding all
 await p.evaluate(()=>{localStorage.setItem('vp-lp-pos.v1','{}');localStorage.setItem('vp-lphist.v1','{}');window.dispatchEvent(new StorageEvent('storage',{key:'vp-lphist.v1'}));});
 await p.waitForFunction(()=>!document.querySelector('#lpRecsEmpty505').hidden);
 // history hook: picking a real file records an open
 await p.evaluate(()=>{const v=document.querySelector('#lpVideo');v.dataset.fileName276='Hook test.mp4';window.__vpLpHistNote505('Hook test.mp4',42);});
 const h=await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-lphist.v1')));
 assert.equal(h['Hook test.mp4'].p,1);assert.equal(h['Hook test.mp4'].d,42);
 console.log('PASS recommended shelf: order, labels, progress, hi/gu repaint, 390px, hide, empty state, history hook');
}).catch(e=>{console.error(e);process.exitCode=1;});
