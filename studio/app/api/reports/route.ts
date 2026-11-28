import {isAdmin} from '../../../lib/admin';
import {one,reject} from '../../../lib/classroom-server';
import {tokenHash} from '../../../lib/classroom-logic';
import {sessionReport,reportLogin,expectedRoster} from '../../../lib/session-report';
const json=(v:any,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(req:Request){try{
 const u=new URL(req.url),r=await one('SELECT * FROM rooms WHERE id=?',u.searchParams.get('room'));if(!r)reject('الحصة غير موجودة.',404);
 if(u.searchParams.get('action')==='names'){if(r.active)reject('لم تنته الحصة بعد.',403);return json({title:JSON.parse(r.data).title,students:await expectedRoster(r)});}
 if(r.active)reject('لم تنته الحصة بعد. أنهِ العرض لإصدار التقرير.',403);
 const teacher=isAdmin(req)&&u.searchParams.get('teacher')==='1';
 let student='';if(!teacher){const raw=req.headers.get('authorization')?.replace(/^Bearer /,'')||'';if(!raw)reject('سجّل الدخول للاطلاع على تقريرك.',401);const hash=await tokenHash(raw);
 const p=await one('SELECT p.student,p.id FROM people p LEFT JOIN students s ON p.student=s.id WHERE p.room=? AND p.token=? AND (p.student IS NULL OR s.active=1)',r.id,hash);
 const session=p?null:await one('SELECT t.student FROM report_sessions t JOIN students s ON s.id=t.student WHERE t.room=? AND t.token=? AND t.expires>? AND s.active=1',r.id,hash,Date.now());student=p?.student||p?.id||session?.student||'';if(!student)reject('أعد تسجيل الدخول إلى التقرير.',401);
 }
 const result=await sessionReport(r);const selected=teacher?u.searchParams.get('student'):student;
 if(selected)result.entries=result.entries.filter(e=>e.id===selected);if(!result.entries.length&&selected)reject('التقرير غير موجود.',404);
 if(!teacher){for(const e of result.entries)for(const detail of e.details)delete (detail as any).feedback;return json({room:result.room,title:result.title,course:result.course,started:result.started,startSource:result.startSource,ended:result.ended,allocated:result.allocated,teacher:false,entries:result.entries});}
 return json({...result,teacher:true});
 }catch(e:any){return json({error:e.message},e.status||500)}}
export async function POST(req:Request){try{if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)reject('مصدر غير مسموح.',403);if(Number(req.headers.get('content-length'))>4000)reject('طلب كبير.',413);return json(await reportLogin(await req.json()));}catch(e:any){return json({error:e.message},e.status||500)}}
