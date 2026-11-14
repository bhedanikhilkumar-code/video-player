// Run with node tests/round342-sw.test.cjs. Service-worker fetch regressions.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
async function run(code,status,hit){
 const handlers={},saved=[],pending=[];
 const cache={match:async()=>hit?new Response('saved',{status:200}):undefined,put:async(k,v)=>saved.push(k),keys:async()=>[]};
 const ctx={self:{addEventListener:(n,f)=>handlers[n]=f,skipWaiting(){},clients:{claim(){}}},caches:{open:async()=>cache,match:cache.match,keys:async()=>[]},location:{origin:'https://test.local'},URL,Response,Promise,setTimeout,clearTimeout,fetch:async()=>new Response('server down',{status})};
 vm.runInNewContext(code,ctx);let result;
 handlers.fetch({request:{method:'GET',url:'https://test.local/',mode:'navigate'},waitUntil:p=>pending.push(p),respondWith:p=>result=p});
 const res=await result;await Promise.all(pending);return {status:res.status,body:await res.text(),saved};
}
(async()=>{const code=fs.readFileSync('sw.js','utf8');
 assert.equal((await run(code,503,true)).body,'saved','503 navigation must open saved app');
 assert.equal((await run(code,404,true)).body,'saved','404 must not replace saved shell');
 assert.equal((await run(code,503,false)).status,503,'with no saved copy keep honest server error');
 const ok=await run(code,200,true);assert.equal(ok.body,'server down');assert.equal(ok.saved.length,1);
 console.log('round342 shell HTTP-failure fallback OK');
})().catch(e=>{console.error(e);process.exitCode=1});
