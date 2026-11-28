import {env} from 'cloudflare:workers';
import {database} from './classroom-server';
// Private import data is stored only in server secrets, never in source or client assets.
// Stable IDs and INSERT OR IGNORE preserve subsequent profile/code changes.
export async function importRoster(){
 const db=database();
 for(const year of [1,2]){
  const rows=[];for(let chunk=0;chunk<15;chunk++){const raw=(env as any)['ROSTER_YEAR_'+year+'_'+chunk];if(raw)rows.push(...JSON.parse(raw));}if(!Array.isArray(rows)||rows.length>150)throw Error('ملف استيراد الطلبة غير صالح.');
  const statements=rows.map((r:any)=>{
   if(typeof r.id!=='string'||typeof r.name!=='string'||typeof r.hash!=='string')throw Error('سجل استيراد غير صالح.');
   return db.prepare('INSERT OR IGNORE INTO students (id,name,year,profile,code_hash,created) VALUES (?,?,?,?,?,?)').bind(r.id,r.name,year,JSON.stringify(r.profile||{}),r.hash,Date.now());
  });
  for(let i=0;i<statements.length;i+=25)await db.batch(statements.slice(i,i+25));
 }
}
