import {one,many,reject,execute} from './classroom-server';
import {scoring,verifyCode,tokenHash} from './classroom-logic';
import {deckYear,courseFor} from './courses';
import {reportEntry} from './report-logic';
export async function expectedRoster(r:any){const saved=JSON.parse(r.expected||'[]');return saved.length?saved:await many('SELECT id,name FROM students WHERE year=? AND active=1 ORDER BY name',deckYear(JSON.parse(r.data)))}
export async function sessionReport(r:any){
 const d=JSON.parse(r.data),expected=await expectedRoster(r),people=await many('SELECT id,student,name,joined FROM people WHERE room=? ORDER BY joined',r.id);
 const [answers,events,grades,visits]=await Promise.all([many('SELECT * FROM answers WHERE room=?',r.id),many('SELECT * FROM answer_events WHERE room=? ORDER BY created,id',r.id),many('SELECT * FROM grades WHERE room=?',r.id),many('SELECT * FROM visits WHERE room=?',r.id)]);
 const config=scoring(r.scoring),start=r.started||r.created;
 const all=[...expected];for(const p of people)if(!all.some(s=>s.id===(p.student||p.id)))all.push({id:p.student||p.id,name:p.name});
 const entries=all.map(s=>reportEntry(s,people.find(p=>(p.student||p.id)===s.id),d.slides,answers,events,grades,visits,config,start));
 return {room:r.id,title:d.title,course:courseFor(d),started:start,startSource:r.started?'بدء التوقيت':'وقت فتح الحصة (لم يُشغّل المؤقت)',ended:r.ended||null,active:!!r.active,expected:expected.length,attended:entries.filter(e=>e.joined!==null).length,absent:entries.filter(e=>e.joined===null).length,late:entries.filter(e=>e.late).length,allocated:Object.values(config.weights).reduce((a:number,b:any)=>a+Number(b||0),0),entries};
}
export async function reportLogin(b:any){
 const r=await one('SELECT * FROM rooms WHERE id=?',String(b.room||''));if(!r||r.active)reject('يصبح التقرير متاحًا بعد إنهاء الحصة.',403);
 const s=await one('SELECT * FROM students WHERE id=? AND active=1',String(b.student||''));
 if(!s||!(await expectedRoster(r)).some((x:any)=>x.id===s.id))reject('الاسم أو الرمز غير صحيح.',401);
 if(s.locked_until>Date.now())reject('توقفت المحاولات مؤقتًا. راجع الأستاذ.',429);
 if(!await verifyCode(String(b.code||'').slice(0,128),s.code_hash)){await execute('UPDATE students SET failures=failures+1,locked_until=CASE WHEN failures>=4 THEN ? ELSE locked_until END WHERE id=?',Date.now()+900000,s.id);reject('الاسم أو الرمز غير صحيح.',401)}
 await execute('UPDATE students SET failures=0,locked_until=0 WHERE id=?',s.id);
 const token=crypto.randomUUID()+crypto.randomUUID();await execute('INSERT INTO report_sessions (token,room,student,expires) VALUES (?,?,?,?)',await tokenHash(token),r.id,s.id,Date.now()+86400000);return {token};
}
