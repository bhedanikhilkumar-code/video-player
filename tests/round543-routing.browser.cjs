const assert=require('node:assert/strict'),fixture=require('./round543-fixture.cjs')();
require('./round538-harness.cjs')(async({p,c,boot,origin,errors})=>{
 // Render real audio, not mocked AudioNodes: every destination sample must match.
 const results=await p.evaluate(async()=>{
  const out=[];
  for(const mono of [false,true])for(const mode of ['stereo','swap','left','right']){
   const ctx=new OfflineAudioContext(2,4096,48000),src=ctx.createBufferSource(),buf=ctx.createBuffer(mono?1:2,4096,48000);
   buf.getChannelData(0).fill(0.2);if(!mono)buf.getChannelData(1).fill(0.6);src.buffer=buf;
   const router=VPChannelRouter543.create(ctx,src,mode);router.output.connect(ctx.destination);src.start();const rendered=await ctx.startRendering();
   out.push({mono,mode,left:rendered.getChannelData(0)[2048],right:rendered.getChannelData(1)[2048]});
  }
  return out;
 });
 for(const r of results){const expected=r.mono?[.2,.2]:({stereo:[.2,.6],swap:[.6,.2],left:[.2,.2],right:[.6,.6]})[r.mode];assert.ok(Math.abs(r.left-expected[0])<1e-5,JSON.stringify(r));assert.ok(Math.abs(r.right-expected[1])<1e-5,JSON.stringify(r));}
 await p.evaluate(()=>{window.__routingCalls543=[];const create=VPChannelRouter543.create;VPChannelRouter543.create=function(...args){const r=create(...args);window.__routingTest543=r;return r;};});
 await p.locator('#lpFile').setInputFiles(fixture);await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);await p.locator('#lpVideo').evaluate(v=>v.play());
 await p.locator('#channelRoute543 summary').click();
 for(const m of ['swap','left','right','stereo']){await p.locator('[data-route="'+m+'"]').click();assert.equal(await p.evaluate(()=>__routingTest543.mode()),m);assert.equal(await p.locator('[data-route="'+m+'"]').getAttribute('aria-pressed'),'true');assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-lp.v1')).channelRoute543),m);}
 await p.locator('[data-route="left"]').click();await p.locator('#lpSndResetBtn309').click();assert.equal(await p.evaluate(()=>__routingTest543.mode()),'stereo');
 await p.locator('[data-route="right"]').click();await boot();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-lp.v1')).channelRoute543),'right');await boot();assert.equal(await p.locator('[data-route="right"]').getAttribute('aria-pressed'),'true');
 const peer=await c.newPage();await peer.goto(origin);await peer.waitForFunction(()=>window.__vpMainOk325);await peer.locator('#lpFile').setInputFiles(fixture);await peer.locator('#channelRoute543 summary').click();await peer.locator('[data-route="swap"]').click();await p.waitForFunction(()=>document.querySelector('[data-route="swap"]').getAttribute('aria-pressed')==='true');await peer.close();
 await p.setViewportSize({width:390,height:844});await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#channelRoute543 summary').click();
 for(const lang of ['hi','gu','en']){await p.locator('#langBtn').click();assert.equal(await p.locator('html').getAttribute('lang'),lang);assert.equal(await p.locator('#channelRoute543').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);await p.waitForFunction(l=>document.querySelector('#crTitle543').textContent===(l==='hi'?'स्टीरियो चैनल रूटिंग':l==='gu'?'સ્ટીરિયો ચેનલ રૂટિંગ':'Stereo channel routing'),lang);}
 await p.locator('[data-route="left"]').click();await p.locator('#lpMonoBtn').click();assert.equal(await p.locator('#lpMonoBtn').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('[data-route="left"]').getAttribute('aria-pressed'),'true');
 assert.deepEqual(errors,[]);console.log('PASS round543: 8 real audio renders, loaded media routing, all controls, sound reset, two reloads, peer sync, 390px hi/gu/en, Mono coexistence');
}).catch(e=>{console.error(e);process.exitCode=1;});
