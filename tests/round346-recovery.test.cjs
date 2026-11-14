const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const scope=h.indexOf('box.id = "localRecovery346"');let i=h.indexOf('    function finish() {',scope),end=h.indexOf('    retry.addEventListener',i),painted=0;
const v={readyState:2,duration:90,currentTime:0,playbackRate:1};let src='media:a';const c=vm.createContext({pending:{src,time:120,rate:1.5},v,source:()=>src,resetPending(){c.pending=null;},paint(){painted++;},sync(){c.synced=true;},status:'',Number,Math});
vm.runInContext(h.slice(i,end),c);c.finish();assert.equal(v.currentTime,89.9);assert.equal(v.playbackRate,1.5);assert.equal(c.pending,null);assert.equal(painted,1);
c.pending={src:'media:a',time:35,rate:2};src='media:b';v.currentTime=0;c.finish();assert.equal(v.currentTime,0);assert.equal(c.synced,true);
c.synced=false;v.readyState=0;c.finish();assert.equal(c.synced,false);
assert.match(h,/v\.addEventListener\("canplay", function \(\) \{ finish\(\); sync\(\); \}\)/);assert.match(h,/HTMLMediaElement\.prototype\.pause\.call\(v\); v\.load\(\)/);assert.match(h,/15000\); paint\(\);/);
console.log('Round 346 recovery clamps position, retains rate, rejects replaced sources and waits for playable data.');
