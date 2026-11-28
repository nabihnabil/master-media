'use client';
import {useRef,useState,useEffect} from 'react';
export default function SlideWebsite({url,editing=false}:{url:string,editing?:boolean}){
 const label=url.startsWith('https://nabihnabil.github.io/master-media/')?'برنامج المادتين':url.startsWith('https://nabihnabil.com/')?'موقع الدكتور نبيل نبيه':'الصفحة المضمّنة';
 const dialog=useRef<HTMLDialogElement>(null),[visible,setVisible]=useState(!editing),[expanded,setExpanded]=useState(false);
 useEffect(()=>{setVisible(!editing)},[editing]);
 function resize(){const el=dialog.current;if(!el)return;el.close();if(expanded){el.show();setExpanded(false)}else{el.showModal();setExpanded(true)}}
 function hide(){dialog.current?.close();setVisible(false);setExpanded(false)}
 return <><button className="website-launch" onClick={()=>setVisible(true)}>تصفح {label}</button>{visible&&<dialog ref={dialog} open className={'slide-website '+(expanded?'website-expanded':'')} onCancel={e=>{e.preventDefault();if(expanded)resize();else hide()}} aria-label={label+' داخل العرض'}><div className="website-toolbar"><strong>{label}</strong><button onClick={resize}>{expanded?'تصغير الموقع':'تكبير الموقع'}</button><button onClick={hide}>العودة إلى الشريحة</button></div><iframe title={label} src={url} sandbox="allow-scripts allow-same-origin allow-forms allow-presentation" allow="fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></dialog>}</>
}
