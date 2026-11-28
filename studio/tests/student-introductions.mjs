import assert from 'node:assert/strict';
const base='http://127.0.0.1:8789',admin={'oai-authenticated-user-email':'jetnabih@gmail.com'};
async function call(path,body,headers=admin){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...headers,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()}}
const students=[];
for(let i=0;i<2;i++){const s=await call('/api/classroom',{action:'saveStudent',name:'طالب اختبار التعارف',year:2,code:'Local-test-2026',profile:{}});assert.equal(s.status,200);students.push(s.data.id)}
const deck={id:crypto.randomUUID(),year:2,title:'اختبار ملف الطالب محليًا',slides:[{id:crypto.randomUUID(),title:'لنتعرف إلى بعضنا',background:'#ffffff',backgroundImage:'',notes:'',nodes:[],activity:{kind:'text',question:'عرّفنا بنفسك',options:[],fields:[{id:'city',label:'المدينة'},{id:'goal',label:'الهدف'}]}}]};
assert.equal((await call('/api/studio',{action:'save',deck})).status,200);
const room=(await call('/api/studio',{action:'createRoom',deck:deck.id})).data.id;
await call('/api/studio',{action:'roomControl',room,command:'answers_open',value:true});
const joined=await call('/api/studio',{action:'join',room,student:students[0],code:'Local-test-2026'},{});assert.equal(joined.status,200);const token={Authorization:'Bearer '+joined.data.token};
const path='/api/classroom?action=introductions&student='+students[0];
assert.equal((await call(path,null,{})).status,403);assert.equal((await call(path,null,token)).status,403);
for(const city of ['وجدة','الرباط']){assert.equal((await call('/api/studio',{action:'answer',room,slide:deck.slides[0].id,value:JSON.stringify({city,goal:'تقرير صحفي'})},token)).status,200)}
await call('/api/studio',{action:'roomControl',room,command:'active',value:false});
const saved=await call(path);assert.equal(saved.status,200);assert.equal(saved.data.length,1);assert.equal(saved.data[0].fields[0].value,'الرباط');assert.equal(saved.data[0].fields[1].value,'تقرير صحفي');assert.ok(saved.data[0].updated);assert.equal((await call('/api/classroom?action=introductions&student='+students[1])).data.length,0);
deck.slides[0].title='Changed later';assert.equal((await call('/api/studio',{action:'save',deck,version:1})).status,200);assert.equal((await call(path)).data.length,1);
assert.equal((await call('/api/classroom?action=introductions&student=unknown')).status,404);
console.log('PASS: named-profile persistence after session end, latest field update, same-name identity isolation, owner-only access and historical snapshot preservation.');
