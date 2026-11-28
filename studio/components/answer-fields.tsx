'use client';
import {AnswerField,readFields} from '../lib/form-answers';
export default function AnswerFields({fields,value,onChange}:{fields:AnswerField[],value:string,onChange:(v:string)=>void}){const values=readFields(value);return <div className="answer-fields">{fields.map(f=><label key={f.id}>{f.label}<textarea aria-label={f.label} rows={2} maxLength={1000} value={values[f.id]||''} onChange={e=>onChange(JSON.stringify({...values,[f.id]:e.target.value}))}/></label>)}</div>}
