const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');
module.exports=async function run(test){
 const origin=process.env.VP_TEST_ORIGIN||'http://localhost:8443',root=path.resolve(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'vp445-')),demo=path.join(dir,'demo.mp4');
 cp.execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-f','lavfi','-i','testsrc2=size=640x360:rate=12','-f','lavfi','-i','sine=frequency=440','-t','35','-c:v','libx264','-preset','ultrafast','-crf','36','-c:a','aac','-y',demo]);
 const bytes=fs.readFileSync(demo),files=['Opening.mp4','Middle.mp4','Finale.mp4','Encore.mp4'].map(name=>({name,mimeType:'video/mp4',buffer:bytes}));
 const s=http.createServer((q,r)=>{try{let f=path.join(root,new URL(q.url,'http://local').pathname.replace(/^\//,'')||'index.html');r.setHeader('Content-Type',f.endsWith('.html')?'text/html':f.endsWith('.js')?'application/javascript':'application/octet-stream');r.end(fs.readFileSync(f));}catch{r.writeHead(404);r.end();}});
 await new Promise(r=>s.listen(8443,r));let b;
 try{b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});let c=await b.newContext({serviceWorkers:'block'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(10000);
 await c.route('**/*',r=>r.request().url().includes('youtube-nocookie.com/embed/')?r.fulfill({contentType:'text/html',body:'<!doctype html><title>Component video frame</title>'}):r.request().url().startsWith(origin)?r.continue():r.abort());
 await c.addInitScript(()=>{if(!['localhost','vp-player.pages.dev'].includes(location.hostname))return;localStorage.setItem('vp-tour.v1','1');if(!localStorage.getItem('vp-prefs.v1'))localStorage.setItem('vp-prefs.v1',JSON.stringify({lang:'en',langPick360:true,lowFxHinted:true}));});
 const boot=async()=>{await p.goto(origin+'/?cb=445-test');await p.waitForFunction(()=>window.__vpMainOk325&&window.__vpLocalQueue443);await p.waitForTimeout(400);};
 const pick=async(items=files)=>{await p.locator('#lpFile').setInputFiles(items);await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);};
 await boot();await test({p,c,files,bytes,boot,pick,errors,origin});require('node:assert/strict').deepEqual(errors,[]);
 }finally{if(b)await b.close();s.close();fs.rmSync(dir,{recursive:true,force:true});}
};
