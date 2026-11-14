const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
let v={src:'blob:a',currentSrc:'blob:a',hidden:false,paused:false,ended:false,pause(){this.paused=true;},play(){this.paused=false;this.plays=(this.plays||0)+1;return Promise.resolve();}};
let covered=false;const c=vm.createContext({privLocal345:null,$:()=>v,playbackCovered345:()=>covered});
for(const name of ['privPauseLocal345','privResumeLocal345']){let i=html.indexOf('  function '+name+'(');assert(i>=0);vm.runInContext(html.slice(i,html.indexOf('\n',i)),c);}
c.privPauseLocal345();assert.equal(v.paused,true);c.privResumeLocal345();assert.equal(v.paused,false);assert.equal(v.plays,1);
v.paused=true;c.privPauseLocal345();c.privResumeLocal345();assert.equal(v.paused,true);assert.equal(v.plays,1);
v.paused=false;c.privPauseLocal345();v.currentSrc='blob:b';c.privResumeLocal345();assert.equal(v.paused,true);
v.currentSrc='blob:a';v.paused=false;c.privPauseLocal345();covered=true;c.privResumeLocal345();assert.equal(v.paused,true);
console.log('Round 345 local-media privacy pause/conditional resume checks passed.');
