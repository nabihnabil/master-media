export const courses = [
 {year:1,label:'السنة الأولى',subject:'صناعة المحتوى الرقمي'},
 {year:2,label:'السنة الثانية',subject:'تطبيقات الذكاء الاصطناعي في المجال الإعلامي'}
] as const;
export function deckYear(d:any):number {return d?.year===2?2:1}
export function courseFor(d:any){return courses[deckYear(d)-1]}
