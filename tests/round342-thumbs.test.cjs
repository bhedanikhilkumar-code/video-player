const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
async function exercise({hit,offline,quota}={}){const handlers={},pending=[];let puts=0,result;
 const saved=new Response('saved image',{headers:{'content-type':'image/jpeg'}});
 const cache={match:async()=>hit?saved:undefined,put:async()=>{puts++;if(quota)throw Error('quota')},keys:async()=>[]};
 const ctx={self:{addEventListener:(n,f)=>handlers[n]=f},caches:{open:async()=>cache},URL,Request,Response,Promise,location:{origin:'https://test.local'},fetch:async()=>{if(offline)throw Error('offline');return new Response('fresh image',{headers:{'content-type':'image/jpeg'}})}};
 vm.runInNewContext(fs.readFileSync('sw.js','utf8'),ctx);handlers.fetch({request:{method:'GET',url:'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg'},waitUntil:p=>pending.push(p),respondWith:p=>result=p});
 const response=await result;const body=await response.text();await Promise.all(pending);return {body,waits:pending.length,puts};
}
(async()=>{let r=await exercise({hit:true});assert(r.waits>0,'cached image refresh must keep the worker alive');assert.equal(r.body,'saved image');
 r=await exercise({hit:true,offline:true});assert.equal(r.body,'saved image');
 r=await exercise({hit:false,quota:true});assert.equal(r.body,'fresh image','a quota failure must not break an online image');
 console.log('round342 image lifetime/offline/quota checks OK');})().catch(e=>{console.error(e);process.exitCode=1});
