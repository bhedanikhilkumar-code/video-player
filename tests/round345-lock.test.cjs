// Run: node tests/round345-lock.test.cjs. Browser flow also checked at 390px.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const start = html.indexOf('    function lockKeys345(');
const end = html.indexOf('    function lockNow()', start);
let focused = '', clicked = 0;
const input = {focus(){focused='input';}}, button = {focus(){focused='unlock';},click(){clicked++;}};
const c = vm.createContext({ov:{}, document:{activeElement:input}, $:id=>id==='vpLockIn288'?input:button});
vm.runInContext(html.slice(start,end),c);
function key(key){let e={key,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};c.lockKeys345(e);return e;}
assert.equal(key('Tab').prevented,true);assert.equal(focused,'unlock');
c.document.activeElement=button;key('Tab');assert.equal(focused,'input');
assert.equal(key('Escape').prevented,true);
assert.equal(key('Enter').prevented,true);assert.equal(clicked,1);
assert.equal(key('7').prevented,undefined);assert.equal(key('7').stopped,true);
c.ov=null;assert.equal(key('Tab').prevented,undefined);
assert.match(html.slice(end,end+1100),/createElement\("dialog"\)/);
assert.match(html.slice(end,end+2100),/ov\.showModal\(\)/);
assert.match(html,/window\.removeEventListener\("keydown", lockKeys345, true\)/);
console.log('Round 345 lock keyboard regression checks passed.');
