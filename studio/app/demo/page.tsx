'use client';
import {useEffect,useState} from 'react';
export default function Demo(){
 const [room,setRoom]=useState(''),[allowed,setAllowed]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(''),[title,setTitle]=useState(''),[focus,setFocus]=useState('both');
 useEffect(()=>{let live=true;const id=new URLSearchParams(location.search).get('room')||'';setRoom(id);(async()=>{try{const identity=await fetch('/api/studio?action=identity').then(r=>r.json()) as any;if(!identity.owner){if(live)setLoading(false);return;}if(!/^[a-f0-9]{16}$/.test(id))throw new Error('افتح تجربة الشاشتين من لوحة حصة مباشرة أو من محرّر الشرائح.');const r=await fetch('/api/studio?action=room&teacher=1&room='+id);const data=await r.json() as any;if(!r.ok)throw new Error(data.error||'تعذر فتح الحصة.');if(live){setTitle(data.title);setAllowed(true)}}catch(e:any){if(live)setError(e.message)}finally{if(live)setLoading(false)}})();return()=>{live=false}},[]);
 if(loading)return <main className="welcome"><h1>جارٍ فتح شاشتي التجربة…</h1></main>;
 if(!allowed)return <main className="welcome"><h1>تجربة الأستاذ والطالب</h1><p>{error||'هذه الصفحة خاصة بالأستاذ. سجّل دخولك لفتح لوحة التحكم بجانب شاشة الطالب.'}</p><a className="button primary" target="_top" href={'/signin-with-chatgpt?return_to='+encodeURIComponent('/demo?room='+room)}>دخول الأستاذ</a> <a href="/">العودة إلى المحرّر</a></main>;
 return <main className={'split-demo focus-'+focus}>
  <header className="split-header"><div><p className="eyebrow">{title}</p><h1>جرّب الحصة من الجهتين</h1></div><div className="toolbar"><button onClick={()=>setFocus(focus==='both'?'teacher':'both')}>{focus==='both'?'تكبير الأستاذ':'الشاشتان معًا'}</button><button onClick={()=>setFocus(focus==='student'?'both':'student')}>{focus==='student'?'الشاشتان معًا':'تكبير الطالب'}</button><a className="button" href={'/?host=1&room='+room}>لوحة الحصة الكاملة</a></div></header>
  <p className="split-guide">اختر شريحة ثم افتح الإجابات لتظهر شاشة التصويت. اضغط «عرض النتائج» لتظهر النتائج وحدها. أغلق الإجابات وأخفِ النتائج للعودة إلى الشريحة وتجربة طلب التدخل.</p>
  <div className="split-panes">
   <section className="split-pane teacher-pane"><div className="pane-title"><h2>شاشة الأستاذ</h2><span>الإجابات والأسماء وطلبات التدخل</span></div><iframe title="شاشة الأستاذ المباشرة" src={'/?host=1&room='+room+'&embed=teacher'} allow="fullscreen"/></section>
   <section className="split-pane student-pane"><div className="pane-title"><h2>شاشة الطالب</h2><span>تجربة مستقلة باسم طالب تجريبي</span></div><iframe title="شاشة الطالب التجريبية" src={'/?room='+room+'&embed=student&demo=1'} allow="fullscreen"/></section>
  </div>
 </main>
}
