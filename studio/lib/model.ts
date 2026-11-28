export type Element={id:string,type:'text'|'image'|'video',text?:string,url?:string,x:number,y:number,w:number,h:number,size:number,color:string,align:'right'|'center'|'left',weight:number,fit?:string};
export type Slide={id:string,title:string,background:string,backgroundImage:string,nodes:Element[],notes:string,activity:null|{kind:'poll'|'quiz'|'text',question:string,options:string[],correct:number,explanation?:string,questionNodeId?:string}};
export type Deck={id:string,title:string,year?:number,slides:Slide[]};
export function mediaURL(raw:string){try{const u=new URL(raw);if(u.protocol!=='https:')return '';return u.href}catch{return /^\/api\/media\/[a-f0-9-]+$/.test(raw)?raw:''}}
export function videoEmbed(raw:string){const drive=driveId(raw);if(drive)return 'https://drive.google.com/file/d/'+drive+'/preview';try{let u=new URL(raw);let id=u.hostname==='youtu.be'?u.pathname.slice(1):['www.youtube.com','youtube.com','www.youtube-nocookie.com'].includes(u.hostname)?(u.searchParams.get('v')||u.pathname.split('/').pop()):'';return id&&/^[\w-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}?rel=0`:null}catch{return null}}

// Older decks stored a duplicate question as a plain text node. Bind that node once.
export function syncQuestion(slide:Slide):Slide {
 if(!slide.activity)return slide;
 const texts=slide.nodes.filter(n=>n.type==='text');
 const target=texts.find(n=>n.id===slide.activity!.questionNodeId)
  ||texts.find(n=>n.text===slide.activity!.question)
  ||[...texts].reverse().find(n=>/[؟?]\s*$/.test(n.text||''))
  ||(texts.length===1?texts[0]:undefined);
 if(!target)return slide;
 return {...slide,activity:{...slide.activity,questionNodeId:target.id},nodes:slide.nodes.map(n=>n.id===target.id?{...n,text:slide.activity!.question}:n)};
}

export function driveId(raw:string){try{const u=new URL(raw);if(!['drive.google.com','docs.google.com'].includes(u.hostname))return '';const id=u.pathname.match(/\/file\/d\/([\w-]+)/)?.[1]||u.searchParams.get('id')||'';return /^[\w-]{10,}$/.test(id)?id:''}catch{return ''}}
export function imageSource(raw:string){const id=driveId(raw);return id?'https://drive.google.com/thumbnail?id='+id+'&sz=w1600':mediaURL(raw)}
