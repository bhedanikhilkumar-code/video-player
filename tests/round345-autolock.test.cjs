const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const name='awayDue345';let i=html.indexOf('    function '+name+'(');assert(i>=0);const c=vm.createContext({});vm.runInContext(html.slice(i,html.indexOf('\n',i)),c);
for(const [since,now,sec,pin,want] of [[0,30000,30,true,true],[0,29999,30,true,false],[0,30000,-1,true,false],[null,30000,0,true,false],[0,30000,0,false,false],[0,1,0,true,true],[0,30000,20,true,false],[100,0,0,true,false]])assert.equal(c.awayDue345(since,now,sec,pin),want);
assert.match(html,/lockAway345: -1/);assert.match(html,/\[-1, 0, 30, 60, 300\]\.indexOf\(saved.lockAway345\)/);
console.log('Round 345 automatic away-lock boundaries passed.');
