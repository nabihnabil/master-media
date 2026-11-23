"""Generate slides and presenter details from the canonical lesson HTML."""
from pathlib import Path
from bs4 import BeautifulSoup,Tag
import json,re,html
root=Path(__file__).resolve().parents[1]
s=BeautifulSoup((root/'lessons/session-01.html').read_text(),'html.parser')
groups=[];current={'title':'مدخل الحصة','blocks':[],'section':'الحصة الأولى'};section='الحصة الأولى'
def walk(parent):
 global current,section
 for el in parent.children:
  if not isinstance(el,Tag):continue
  if el.name in ('h2','h3'):
   if current['blocks']:groups.append(current)
   if el.name=='h2':section=el.get_text(' ',strip=True)
   current={'title':el.get_text(' ',strip=True),'blocks':[],'section':section}
  elif el.name in ('section','article'):walk(el)
  elif el.name in ('p','blockquote','ul','ol','table'):
   current['blocks'].append(str(el))
  elif 'inline-video' in el.get('class',[]):
   iframe=el.find('iframe');vid=re.search('/embed/([^?]+)',iframe['src'])[1];current['blocks'].append({'video':vid,'title':iframe.get('title','')})
walk(s.main)
if current['blocks']:groups.append(current)
slides=[{'title':'صناعة المحتوى الرقمي','body':'<p class="lead">تعريفات مؤسسية، أمثلة بالفيديو، وقرارات مهنية</p><p>الحصة الأولى · الدكتور نبيل نبيه</p>','kind':'cover','section':'بداية العرض','notesHtml':'<p>افتح شاشة الأستاذ ثم انقلها إلى الشاشة الثانية. يطابق النص المعروض مادة القراءة، مقسّمًا إلى وحدات. استخدم الفهرس لاختيار مسار الحصة وبنك الأمثلة الإضافي للرجوع عند الحاجة.</p>'}]
counts={'sourceBlocks':0,'coveredBlocks':0}
for gi,g in enumerate(groups):
 full=''.join(x for x in g['blocks'] if isinstance(x,str));parts=[]
 for block in g['blocks']:
  counts['sourceBlocks']+=1
  if isinstance(block,dict):parts.append(block);counts['coveredBlocks']+=1;continue
  el=BeautifulSoup(block,'html.parser').find()
  if el.name=='table':
   rows=el.find_all('tr');header=str(rows[0]);data=rows[1:]
   # At most two rows: long taxonomy rows remain legible on projection.
   for k in range(0,len(data),2):parts.append('<table>'+header+''.join(map(str,data[k:k+2]))+'</table>')
  elif el.name in ('ul','ol'):
   lis=el.find_all('li',recursive=False)
   for k in range(0,len(lis),2):parts.append('<'+el.name+'>'+''.join(map(str,lis[k:k+2]))+'</'+el.name+'>')
  else:parts.append(block)
  counts['coveredBlocks']+=1
 # Pack short consecutive paragraphs without rewriting their text.
 packed=[]
 for item in parts:
  if isinstance(item,str) and not item.startswith(('<table','<ul','<ol')) and packed and isinstance(packed[-1],str) and not packed[-1].startswith(('<table','<ul','<ol')):
   words=len(BeautifulSoup(packed[-1]+item,'html.parser').get_text(' ',strip=True).split())
   if words<=110:packed[-1]+=item;continue
  packed.append(item)
 parts=packed
 # Complete canonical text, with full section context on presenter.
 for pi,part in enumerate(parts):
  slide={'title':g['title'],'section':g['section'],'notesHtml':full,'group':gi,'part':pi+1,'parts':len(parts)}
  if isinstance(part,dict):
   slide.update(body='<p class="case-title">'+html.escape(g['title'])+'</p><p class="caption">مشاهدة داخل المنصة · استخدم التكبير عند الحاجة</p>',video=part['video'],kind='case')
  else:
   parsed=BeautifulSoup(part,'html.parser')
   for a in parsed.find_all('a',href=True):
    if a['href'].startswith('#'):a['href']='session-01.html'+a['href']
   blocks=list(parsed.children)
   if len(blocks)>1 and all(getattr(b,'name',None)=='p' for b in blocks):
    part=str(blocks[0])+'<div class="reveal" hidden>'+''.join(map(str,blocks[1:]))+'</div>'
   else:part=str(parsed)
   slide['body']=part
   slide['wordCount']=len(BeautifulSoup(part,'html.parser').get_text(' ',strip=True).split())
  slides.append(slide)
(root/'lessons/session-01-slides.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2))
(root/'lessons/session-01-coverage.json').write_text(json.dumps(dict(**counts,slides=len(slides),sections=len(groups)),indent=2))
p=root/'lessons/session-01-slides.html';txt=p.read_text();txt=re.sub(r'(<script id="deck-data" type="application/json">).*?(</script>)',lambda m:m[1]+json.dumps(slides,ensure_ascii=False).replace('</','<\\/')+m[2],txt,flags=re.S);p.write_text(txt)
print(len(slides),'slides;',len(groups),'sections;',counts)
