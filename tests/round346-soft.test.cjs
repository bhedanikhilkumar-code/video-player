const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const i=h.indexOf('  var origPause283 = vid.pause.bind(vid), origPlay346'),end=h.indexOf('  // Fade between songs',i);let covered=false,restored=0,n=0;const timers=new Map(),events={};
const vid={paused:false,pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();},addEventListener:(ev,fn)=>events[ev]=fn,_vpResumeOutput346:()=>restored++};
const c=vm.createContext({vid,lp:{soft:true},ctx:{},window:{},document:{querySelector:()=>covered},setTimeout:fn=>{timers.set(++n,fn);return n;},clearTimeout:id=>timers.delete(id)});
vm.runInContext(h.slice(i,end),c);vid.pause();assert.equal(vid.paused,false);assert.equal(vid._vpSoftPaused346,true);assert.equal(timers.size,1);
// Native play() on a playing element deliberately emits no event in this mock.
vid.play();assert.equal(timers.size,0);assert.equal(vid._vpSoftPaused346,false);assert.equal(restored,1);assert.equal(vid.paused,false);
vid.pause();[...timers.values()][0]();assert.equal(vid.paused,true);assert.equal(vid._vpSoftPaused346,false);vid.play();
covered=true;vid.pause();assert.equal(vid.paused,true);assert.equal(timers.size,0);covered=false;vid.play();vid.pause();events.emptied();assert.equal(timers.size,0);assert.equal(vid._vpSoftPaused346,false);
console.log('Round 346 rapid soft-pause resume, natural pause, source replacement and privacy bypass checks pass.');
