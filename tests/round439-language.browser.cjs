/* Interactive language work yields and stale passes cannot overwrite newer choices.
   Startup and the existing no-argument repaint API remain synchronous. */
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((q,r)=>{try{let file=path.join(root,new URL(q.url,'http://localhost').pathname);if(file.endsWith('/'))file+='index.html';r.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'application/javascript':'application/octet-stream');r.end(fs.readFileSync(file));}catch{r.writeHead(404);r.end();}});
(async()=>{await new Promise(r=>server.listen(8439,r));const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});try{
 const ctx=await b.newContext(),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.error(e.stack)});await p.route('**/*',r=>r.request().url().startsWith('http://localhost:8439')?r.continue():r.abort());
 await p.addInitScript(()=>{if(sessionStorage.seed439)return;sessionStorage.seed439='1';localStorage.setItem('vp-tour.v1','1');localStorage.setItem('vp-prefs.v1',JSON.stringify({lang:'en',langPick360:true}));localStorage.setItem('vp-ctl-use.v1',JSON.stringify({counts:{'#ctl-sleep':4,'#ctl-sound':24,'#ctl-repeat':6},hidden:[]}));});
 const settle=()=>p.waitForFunction(()=>document.getElementById('langBtn').getAttribute('aria-busy')!=='true');
 for(let repeat=0;repeat<2;repeat++){
  await p.goto('http://localhost:8439');await p.waitForFunction(()=>window.__vpMainOk325===true);await p.waitForTimeout(3700);await p.evaluate(()=>window.__vpSetLangOnce('en'));await settle();
  const counts=await p.evaluate(()=>{window.seen439=[];window.__relang.push(()=>{throw Error('isolated test hook')});window.__relang.push(()=>window.seen439.push(document.documentElement.lang));return window.__relang.length;});
  for(const width of [1280,390]){await p.setViewportSize({width,height:900});
   for(const lg of ['hi','gu','en']){
    const fast=await p.evaluate(lg=>{let t=performance.now();window.__vpSetLangOnce(lg);return{ms:performance.now()-t,lang:document.documentElement.lang,busy:document.querySelector('#langBtn').getAttribute('aria-busy')}},lg);
    assert.equal(fast.lang,lg);assert.equal(fast.busy,'true');assert.ok(fast.ms<100,JSON.stringify(fast));await settle();
    assert.equal(await p.evaluate(()=>window.seen439.at(-1)),lg);assert.equal(await p.locator('html').getAttribute('lang'),lg);
    assert.ok(await p.locator('#lockIn1').getAttribute('aria-label'));assert.ok(await p.locator('#lockIn2').getAttribute('aria-label'));
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    console.log('load',repeat,'width',width,'lang',lg,'dispatch ms',fast.ms.toFixed(1));
   }
  }
  // Rapid real button dispatch: seven choices are saved, but only the final pass runs hooks.
  const rapid=await p.evaluate(()=>{window.seen439=[];let t=performance.now();for(let i=0;i<7;i++)document.querySelector('#langBtn').click();return{ms:performance.now()-t,lang:document.documentElement.lang};});await settle();assert.equal(rapid.lang,'hi');assert.deepEqual(await p.evaluate(()=>window.seen439),['hi']);
  // Cancel a partly completed pass, not only one which has not started yet.
  await p.evaluate(()=>window.__vpSetLangOnce('gu'));await p.waitForTimeout(80);await p.evaluate(()=>window.__vpSetLangOnce('en'));await settle();assert.equal(await p.evaluate(()=>window.seen439.at(-1)),'en');
  // Existing API callers can still request a fully completed repaint before returning.
  await p.evaluate(()=>{window.__vpSetLangOnce('hi');window.__vpApplyLang();});assert.equal(await p.locator('#langBtn').getAttribute('aria-busy'),'false');assert.equal(await p.evaluate(()=>window.seen439.at(-1)),'hi');
  console.log('handlers',counts,'rapid dispatch ms',rapid.ms.toFixed(1));
 }
 assert.deepEqual(errors,[]);console.log('PASS: fresh/repeat loads, desktop/mobile EN/HI/GU, seven rapid taps, mid-pass cancellation, throwing-hook isolation and synchronous API.');
}finally{await b.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
