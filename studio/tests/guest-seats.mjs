import assert from 'node:assert/strict';
const base='http://127.0.0.1:8789',admin={'oai-authenticated-user-email':'jetnabih@gmail.com'};
async function call(path,b,headers=admin){const r=await fetch(base+path,{method:b?'POST':'GET',headers:{...headers,'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});const d=await r.json();assert.equal(r.status,200,JSON.stringify(d));return d}
const all=await call('/api/classroom?action=students');const guests=all.filter(s=>s.id.startsWith('guest-year2-'));assert.equal(guests.length,10);assert.deepEqual(all.slice(-10).map(s=>s.id),guests.map(s=>s.id));assert.equal((await call('/api/classroom?action=students')).length,all.length);
const deck={id:crypto.randomUUID(),title:'Local guest seat test',year:2,slides:[{id:'slide',title:'Welcome',notes:'',background:'#ffffff',backgroundImage:'',nodes:[],activity:null}]};await call('/api/studio',{action:'save',deck});const room=(await call('/api/studio',{action:'createRoom',deck:deck.id})).id;
const roster=await call('/api/classroom?action=roster&room='+room,null,{});assert.deepEqual(roster.slice(-10).map(s=>s.name),Array.from({length:10},(_,i)=>'Guest '+String(i+1).padStart(2,'0')));
for(const s of guests)assert.ok((await call('/api/studio',{action:'join',room,student:s.id,code:'master2026'},{})).token);
await call('/api/studio',{action:'roomControl',room,command:'active',value:false});
const report=await call('/api/reports?teacher=1&room='+room);assert.equal(report.entries.filter(e=>e.id.startsWith('guest-year2-')&&e.joined).length,10);
const other=(await call('/api/studio',{action:'createRoom',deck:deck.id})).id;await call('/api/studio',{action:'roomControl',room:other,command:'active',value:false});assert.equal((await call('/api/reports?teacher=1&room='+other)).entries.filter(e=>e.id.startsWith('guest-year2-')).length,0);
assert.ok((await call('/api/reports',{room,student:guests[0].id,code:'master2026'},{})).token);
console.log('PASS: 10 unique guest seats, shared code login, end-of-roster order, idempotent provisioning, no unused guests in absence reports, own report access.');
