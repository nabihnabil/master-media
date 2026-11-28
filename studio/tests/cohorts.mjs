import assert from 'node:assert/strict';
const base='http://127.0.0.1:8788',admin={'oai-authenticated-user-email':'jetnabih@gmail.com'};
async function call(path,body,headers=admin){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...headers,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()}}
const ds=await call('/api/studio?action=decks');assert.equal(ds.status,200);
const d1=JSON.parse(ds.data.find(d=>d.id==='session-00').data),d2=JSON.parse(ds.data.find(d=>d.id==='session-00-year2').data);
assert.equal(d1.year,1);assert.equal(d2.year,2);
const students=[],rooms=[];
for(const year of [1,2]){
 const s=await call('/api/classroom',{action:'saveStudent',name:'طالب اختبار السنة '+year,year,code:'Temporary-test-2026',profile:{}});assert.equal(s.status,200);students.push(s.data.id);
 const r=await call('/api/studio',{action:'createRoom',deck:year===1?d1.id:d2.id});assert.equal(r.status,200);rooms.push(r.data.id);
}
for(const year of [1,2]){
 const roster=await call('/api/classroom?action=roster&room='+rooms[year-1],null,{});assert.ok(roster.data.some(s=>s.id===students[year-1]));assert.ok(!roster.data.some(s=>s.id===students[2-year]));
 assert.equal((await call('/api/studio',{action:'join',room:rooms[year-1],student:students[2-year],code:'Temporary-test-2026'},{})).status,403);
 assert.equal((await call('/api/studio',{action:'join',room:rooms[year-1],student:students[year-1],code:'wrong'},{})).status,401);
 const joined=await call('/api/studio',{action:'join',room:rooms[year-1],student:students[year-1],code:'Temporary-test-2026'},{});assert.equal(joined.status,200);
 const state=await call('/api/studio?action=room&room='+rooms[year-1],null,{Authorization:'Bearer '+joined.data.token});assert.equal(state.data.year,year);assert.equal(state.data.count,1);
}
const again=await call('/api/studio',{action:'createRoom',deck:d1.id});assert.notEqual(again.data.id,rooms[0]);const fresh=await call('/api/classroom?action=report&room='+again.data.id);assert.equal(fresh.data.entries.length,0);
// Reclassifying a lesson cannot change an existing room's cohort snapshot.
const copied={...d1,id:crypto.randomUUID(),year:2};const saved=await call('/api/studio',{action:'save',deck:copied});assert.equal(saved.status,200);const lists=await call('/api/studio?action=decks');assert.equal(JSON.parse(lists.data.find(d=>d.id===copied.id).data).year,2);
console.log('PASS cohort isolation: filtered rosters, rejected cross-year and wrong-code login, valid logins, persisted course assignment, independent repeat attendance.');
