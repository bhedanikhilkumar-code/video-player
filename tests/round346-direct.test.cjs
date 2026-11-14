// Run: node tests/round346-direct.test.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const i=h.indexOf('  window.vpPlayUrl = function (url, key) {'),end=h.indexOf('\n  };',i)+5;
let saved=0,paused=0,painted=0,buttons=0,shown='',scroll=0;const input={value:'old'},section={scrollIntoView(){scroll++;}};
const c=vm.createContext({window:{vpReducedMotion:()=>true,vpExpandSection:()=>{}},saveLocalPositionNow:()=>saved++,clearTimeout:()=>{},softPend283:1,origPause283:()=>paused++,localFiles:[{}],localIndex:0,lpPickCount:1,file:input,lpPickPaint:()=>painted++,updateLocalButtons:()=>buttons++,posKey:'old-file',session:{metadata:{title:'old'},playbackState:'playing'},mediaAction:()=>{},show:(url,local)=>{assert.equal(local,false);shown=url;},$:()=>section});
vm.runInContext(h.slice(i,end),c);c.window.vpPlayUrl('https://example.org/movie.mp4');
assert.equal(saved,1);assert.equal(paused,1);assert.equal(c.localFiles.length,0);assert.equal(c.localIndex,-1);assert.equal(c.lpPickCount,0);assert.equal(input.value,'');assert.equal(c.posKey,null);assert.equal(c.session.metadata,null);assert.equal(c.session.playbackState,'none');assert.equal(shown,'https://example.org/movie.mp4');assert.equal(painted,1);assert.equal(buttons,1);assert.equal(scroll,1);
c.window.vpPlayUrl('blob:recording','recording-key');assert.equal(c.posKey,'recording-key');
assert.match(h,/window\.__lpShowUrl303 = function.*window\.vpPlayUrl\(u\)/);
console.log('Round 346 direct URL detaches file queue, progress and Media Session state.');
