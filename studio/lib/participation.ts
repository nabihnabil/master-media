export function participationScore(p:any,slides:any[],answers:any[],config:any,created:number,ended=0){
 const ids=[...new Set<string>((config.opened||[]).filter((id:string)=>slides.some(s=>s.id===id&&s.activity)))];
 const responded=ids.filter(id=>answers.some(a=>a.person===p?.id&&a.slide===id&&a.value?.trim())).length;
 const onTime=!!p&&p.joined<=created+600000;
 const stayed=ended?!!p&&(config.finishPresence||[]).includes(p.id):null;
 const arrivalPoints=onTime?2:0,answerPoints=responded*2,endPoints=stayed?2:0,raw=arrivalPoints+answerPoints+endPoints,maximum=4+ids.length*2;
 return {score:Math.round(raw/maximum*1000)/100,raw,maximum,arrivalPoints,answerPoints,endPoints,stayed,onTime,responded,opportunities:ids.length,participation:ids.length?Math.round(responded/ids.length*100):0,provisional:!ended};
}
