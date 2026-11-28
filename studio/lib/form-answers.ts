export type AnswerField={id:string,label:string};
export function readFields(value:string):Record<string,string>{try{const v=JSON.parse(value);return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
export function formatAnswer(activity:any,value:string){if(!activity?.fields?.length)return value;const values=readFields(value);return activity.fields.map((f:AnswerField)=>`${f.label}\n${values[f.id]||'—'}`).join('\n\n')}
export function validateFormAnswer(fields:AnswerField[],raw:unknown){
 if(typeof raw!=='string'||raw.length>15000)throw new Error('الإجابة طويلة جدًا.');
 const values=readFields(raw),result:Record<string,string>={};
 for(const f of fields){const v=values[f.id];if(typeof v!=='string'||!v.trim())throw new Error('أكمل الخانة: '+f.label);if(v.length>1000)throw new Error('الحد الأقصى لكل خانة 1000 حرف.');result[f.id]=v.trim()}
 return JSON.stringify(result);
}
