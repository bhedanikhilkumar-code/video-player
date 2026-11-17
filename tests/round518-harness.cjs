const {chromium}=require('playwright'),fs=require('fs'),http=require('http'),path=require('path');
module.exports=async function(test){
 const root=path.resolve(__dirname,'..'),origin=process.env.VP_TEST_ORIGIN||'http://localhost:8518';let server,b;
 if(!process.env.VP_TEST_ORIGIN){server=http.createServer((q,r)=>{try{const f=path.join(root,new URL(q.url,'http://local').pathname.replace(/^\//,'')||'index.html');r.setHeader('Content-Type',f.endsWith('.html')?'text/html':f.endsWith('.js')?'application/javascript':'application/octet-stream');r.end(fs.readFileSync(f));}catch{r.writeHead(404);r.end();}});await new Promise(r=>server.listen(8518,r));}
 try{b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});const c=await b.newContext({serviceWorkers:'block'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(12000);
 await c.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
 const boot=async()=>{await p.goto(origin+'/?cb=518-test');await p.waitForFunction(()=>window.__vpMainOk325&&document.querySelector('#remindCard517'));await p.waitForTimeout(200);};
 await boot();await p.evaluate(()=>{localStorage.clear();localStorage.setItem('vp-tour.v1','1');localStorage.setItem('vp-prefs.v1',JSON.stringify({lang:'en',langPick360:true,lowFxHinted:true}));localStorage.setItem('vp-library.v1',JSON.stringify({favs:[{id:'dQw4w9WgXcQ',title:'First saved video'},{id:'9bZkp7q19f0',title:'Second saved video'}],later:[],hist:[],queue:[]}));});await boot();
 const open=async()=>{if(!await p.locator('#remindCard517').evaluate(e=>e.open))await p.locator('#remindCard517 > summary').click();};
 const rows=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('vp-remind517.v1')||'[]'));
 await test({p,c,boot,open,rows,errors,origin});require('node:assert/strict').deepEqual(errors,[]);
 }finally{if(b)await b.close();if(server)await new Promise(r=>server.close(r));}
};
