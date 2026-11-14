const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
let yt=0,local=0,covered=false;const frame={},v={src:'blob:a',currentSrc:'blob:a',hidden:false,paused:true,ended:false,play(){local++;return Promise.resolve();}};
const c=vm.createContext({window:{},$:()=>v,iframe:frame,curId:'a',playing:true,ready:true,playbackCovered345:()=>covered,send:()=>yt++});
let i=h.indexOf('  window.__vpCapturePlayback346 ='),end=h.indexOf('  TR_MSG["Focus resumes',i);vm.runInContext(h.slice(i,end),c);
let snapshot=c.window.__vpCapturePlayback346();assert.equal(snapshot.local,null);c.window.__vpResumePlayback346(snapshot);assert.equal(yt,1);assert.equal(local,0);
c.playing=false;v.paused=false;snapshot=c.window.__vpCapturePlayback346();v.paused=true;c.window.__vpResumePlayback346(snapshot);assert.equal(local,1);assert.equal(yt,1);
v.currentSrc='blob:replacement';c.window.__vpResumePlayback346(snapshot);assert.equal(local,1);v.currentSrc='blob:a';covered=true;c.window.__vpResumePlayback346(snapshot);assert.equal(local,1);covered=false;
c.playing=true;snapshot=c.window.__vpCapturePlayback346();c.iframe={};c.window.__vpResumePlayback346(snapshot);assert.equal(yt,1);
console.log('Round 346 resume identity, originally-paused exclusion and privacy-cover guard checks passed.');
