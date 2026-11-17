const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 await p.evaluate(()=>{
  localStorage.setItem('vp-library.v1',JSON.stringify({favs:[{id:'dQw4w9WgXcQ',title:'Rick Astley official music'}],later:[],queue:[],hist:[]}));
  localStorage.setItem('vp-playlists.v1',JSON.stringify([{name:'Songs',items:[{id:'9bZkp7q19f0',title:'PSY official music'}]}]));
  let prefs=JSON.parse(localStorage.getItem('vp-prefs.v1'));prefs.customNames480={dQw4w9WgXcQ:'My favourite song'};localStorage.setItem('vp-prefs.v1',JSON.stringify(prefs));
 });await boot();
 const find=q=>p.evaluate(q=>window.__vpPalVideos508(q),q);
 assert.equal((await find('PSY music'))[0].list,'Playlists');
 assert.equal((await find('my song'))[0].title,'My favourite song');
 assert.equal((await find('official -PSY')).length,1);
 assert.equal((await find('is:fav'))[0].id,'dQw4w9WgXcQ');
 assert.equal((await find('9bZkp7q19f0'))[0].id,'9bZkp7q19f0');
 assert.equal((await find('"official music"')).length,2);
 assert.equal((await find('is:fav -music')).length,0);
 await p.locator('#palBtn').click();await p.locator('#vpPalIn').fill('PSY music');await p.locator('#vpPalItem0').click();
 await p.waitForFunction(()=>!!document.querySelector('iframe[src*="/embed/9bZkp7q19f0"]'));
 console.log('PASS library palette queries: playlist-only, custom names, words, phrase, exclusion, is:fav, ids, click play');
}).catch(e=>{console.error(e);process.exitCode=1;});
