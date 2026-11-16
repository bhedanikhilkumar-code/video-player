const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
async function run({path='/',body='<!doctype html><script>window.__vpMainOk325 = true</script>',mime='text/html',status=200,hit=true}){
 const handlers={},saved=[],pending=[];
 const old=new Response('saved app',{headers:{'content-type':'text/html'}});
 const cache={match:async()=>hit?old.clone():undefined,put:async(k,v)=>saved.push([k,await v.text()]),keys:async()=>[]};
 const ctx={self:{addEventListener:(n,f)=>handlers[n]=f,skipWaiting(){},clients:{claim(){}}},caches:{open:async()=>cache,match:cache.match,keys:async()=>[]},location:{origin:'https://test.local'},URL,Request,Response,Promise,setTimeout,clearTimeout,fetch:async()=>new Response(body,{status,headers:{'content-type':mime}})};
 vm.runInNewContext(fs.readFileSync('sw.js','utf8'),ctx);let response;
 handlers.fetch({request:{method:'GET',url:'https://test.local'+path,mode:'navigate'},waitUntil:p=>pending.push(p),respondWith:p=>response=p});
 const r=await response;await Promise.all(pending);return {body:await r.text(),saved};
}
(async()=>{
 let r=await run({path:'/README.md',body:'# Read me',mime:'text/markdown'});assert.equal(r.body,'# Read me','non-app navigation still serves requested content');assert.equal(r.saved.length,0,'non-app navigation must not overwrite offline homepage');
 r=await run({body:'<!doctype html><h1>Wi-Fi sign in</h1>'});assert.equal(r.body,'saved app','successful captive-portal HTML must fall back to saved app');assert.equal(r.saved.length,0);
 r=await run({});assert.equal(r.saved.length,1,'valid app still refreshes offline copy');
 r=await run({status:503});assert.equal(r.body,'saved app');
 r=await run({body:'portal',hit:false});assert.equal(r.body,'portal','without saved copy show actual network answer');
 console.log('PASS round490: non-app navigation, captive portal, valid app, HTTP fallback, no-cache network answer');
})().catch(e=>{console.error(e);process.exitCode=1});
