const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
module.exports=async function(test){
 const root=path.resolve(__dirname,'..'),origin=process.env.VP_TEST_ORIGIN||'http://localhost:8538';let s,b;
 if(!process.env.VP_TEST_ORIGIN){s=http.createServer((q,r)=>{try{const f=path.join(root,new URL(q.url,'http://local').pathname.replace(/^\//,'')||'index.html');r.setHeader('Content-Type',f.endsWith('.html')?'text/html':f.endsWith('.js')?'application/javascript':'application/octet-stream');r.end(fs.readFileSync(f.endsWith('/index.html') && process.env.VP_TEST_HTML ? process.env.VP_TEST_HTML : f));}catch{r.writeHead(404);r.end();}});await new Promise(r=>s.listen(8538,r));}
 try{b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});const c=await b.newContext({serviceWorkers:'block'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(8000);
 await c.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
 const boot=async()=>{await p.goto(origin+'/?cb=538-tests',{waitUntil:'domcontentloaded',timeout:20000});await p.waitForFunction(()=>window.__vpMainOk325);await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});};
 await boot();await p.evaluate(()=>{localStorage.clear();localStorage.setItem('vp-tour.v1','1');localStorage.setItem('vp-prefs.v1',JSON.stringify({lang:'en',langPick360:true,lowFxHinted:true}));});await boot();
 const open=async()=>{if(await p.locator('#help').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#help .sec-toggle').click();if(!await p.locator('#themeLab538').evaluate(e=>e.open))await p.locator('#themeLab538 > summary').click();};
 const pref=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('vp-prefs.v1')));
 await test({p,c,boot,open,pref,origin,errors});assert.deepEqual(errors,[]);
 }finally{if(b)await b.close();if(s)await new Promise(r=>s.close(r));}
};
