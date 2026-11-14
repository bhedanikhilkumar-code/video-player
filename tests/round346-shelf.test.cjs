// Run: node tests/round346-shelf.test.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=h.indexOf('  function cleanMediaShelf346(raw) {'),end=h.indexOf('\n  Object.assign(TR_MSG, {',start);const c=vm.createContext({URL});vm.runInContext(h.slice(start,end),c);
let clean=x=>JSON.parse(JSON.stringify(c.cleanMediaShelf346(x)));
assert.deepEqual(clean(null),[]);assert.deepEqual(clean({url:'https://example.org/a.mp4'}),[]);
assert.deepEqual(clean([{url:'javascript:alert(1)'},{url:'data:video/mp4,abc'},{url:'https://user:secret@example.org/a.mp4'},{url:'https://youtube.com/watch?v=dQw4w9WgXcQ'},{url:'https://m.youtube.com/shorts/a'},{url:'https://youtu.be/dQw4w9WgXcQ'},{url:'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'}]),[]);
assert.deepEqual(clean([{url:'HTTPS://EXAMPLE.ORG/a.mp4',name:'  Film  '},{url:'https://example.org/a.mp4',name:'duplicate'}]),[{url:'https://example.org/a.mp4',name:'Film'}]);
assert.equal(clean(Array.from({length:30},(_,i)=>({url:'https://example.org/'+i+'.mp3'}))).length,20);
assert.equal(clean([{url:'https://example.org/a',name:'x'.repeat(100)}])[0].name.length,80);
assert.equal((h.match(/"vp-saved-searches\.v1", "vp-media-shelf346\.v1"/g)||[]).length,2);
assert.match(h,/html\.vp-private #mediaShelf346\{display:none!important\}/);assert.match(h,/title\.textContent = item\.name/);
console.log('Round 346 media shelf validation, caps, duplicate handling, private mode and backup allowlists pass.');
