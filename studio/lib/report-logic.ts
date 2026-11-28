import {formatAnswer} from './form-answers';
export function attendanceStatus(joined:number|null,start:number){
 if(joined===null)return {status:'غائب',lateMinutes:null,late:false};
 const minutes=Math.max(0,(joined-start)/60000);
 return {status:minutes>30?'متأخر أكثر من 30 دقيقة':'حاضر',lateMinutes:Math.floor(minutes),late:minutes>30};
}
export function answerDetail(slide:any,value:string){
 const a=slide.activity;
 return {value,answer:a?.kind==='text'?formatAnswer(a,value):a?.options?.[Number(value)]??value,correct:a?.kind==='quiz'?String(a.correct)===value:null};
}
export function reportEntry(student:any,person:any,slides:any[],answers:any[],events:any[],grades:any[],visits:any[],config:any,start:number){
 const pa=answers.filter(a=>a.person===person?.id),pg=grades.filter(g=>g.person===person?.id),pv=visits.filter(v=>v.person===person?.id);
 let automaticPoints=0,manualPoints=0;
 const details=slides.flatMap((s:any,index:number)=>{
  const a=pa.find(a=>a.slide===s.id),g=pg.find(g=>g.slide===s.id),v=pv.find(v=>v.slide===s.id);
  const opened=config.opened.includes(s.id);
  if(!opened&&!a&&!g&&!v)return [];
  const max=Number(config.weights[s.id])||0;
  const auto=s.activity?.kind==='quiz'&&a&&String(s.activity.correct)===a.value?max:0;
  const points=g?Math.min(max,Math.max(0,g.points)):auto;
  if(g)manualPoints+=points;else automaticPoints+=points;
  const history=events.filter(e=>e.person===person?.id&&e.slide===s.id).map(e=>({...answerDetail(s,e.value),created:e.created}));
  return [{id:s.id,index:index+1,title:s.title,question:s.activity?.question||'',kind:s.activity?.kind||'',opened,answer:a?answerDetail(s,a.value):null,history:history.length?history:a?[{...answerDetail(s,a.value),created:a.created}]:[],historyComplete:history.length>0,correctAnswer:s.activity?.kind==='quiz'?s.activity.options[s.activity.correct]:null,explanation:s.activity?.kind==='quiz'?s.activity.explanation||'':null,max,points,manual:!!g,pending:!!a&&s.activity?.kind!=='quiz'&&!g&&max>0,feedback:g?.feedback||'',hands:v?.hands||0,duration:v?.duration||0}];
 });
 const opportunities=config.opened.length,responded=config.opened.filter((id:string)=>pa.some(a=>a.slide===id)).length;
 return {id:student.id,name:student.name,person:person?.id||null,joined:person?.joined??null,...attendanceStatus(person?.joined??null,start),score:Math.round(Math.min(10,automaticPoints+manualPoints)*100)/100,automaticPoints,manualPoints,responded,opportunities,participation:opportunities?Math.round(responded/opportunities*100):0,hands:pv.reduce((n,v)=>n+v.hands,0),duration:pv.reduce((n,v)=>n+v.duration,0),details};
}
