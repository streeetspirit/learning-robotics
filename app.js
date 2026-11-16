import { tracks, parts, phases, projects, schedule, resources } from './data.js';
const $ = (s) => document.querySelector(s);
const key = 'robotics-workbench-v1';
const seed = {parts, phases, projects, schedule, entries:[], weekChecks:{}, phase:'1', focus:'All tracks'};
function read(){try{return JSON.parse(localStorage.getItem(key)) || structuredClone(seed)}catch{return structuredClone(seed)}}
let state=read(), filter='All tracks', statusFilter='All statuses', sort='Balanced', limit=90;
const nav = [['home','⌂','Overview'],['path','⌁','Learning path'],['projects','▦','Project backlog'],['inventory','▤','Parts inventory'],['journal','▧','Experiment journal'],['review','◎','Weekly review'],['resources','↗','Resources']];
const statuses=['Backlog','In progress','Done','Parked'];
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const option=(x,y)=>'<option'+(x===y?' selected':'')+'>'+esc(x)+'</option>';
const byId=(items,id)=>items.find(item=>item.id===id);
const dateKey=(d)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const today=()=>dateKey(new Date());
function weekKey(){const d=new Date();d.setDate(d.getDate()-(d.getDay()+6)%7);return dateKey(d)}
let toastTimer;
function toast(s){$('#toast').textContent=s;$('#toast').className='show';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').className='',3300)}
function save(next, message){try{localStorage.setItem(key,JSON.stringify(next));state=next;if(message)toast(message);render();return true}catch{toast('Could not save. Browser storage may be full. Try fewer photos.');return false}}
function update(list, item){return state[list].some(x=>x.id===item.id)?state[list].map(x=>x.id===item.id?item:x):[...state[list],item]}
const id=()=>crypto.randomUUID();
const action=(name,label,ref='',cls='')=>'<button type="button" class="'+cls+'" data-action="'+name+'" data-id="'+esc(ref)+'">'+label+'</button>';
const badge=(label,cls='')=>'<span class="badge '+cls+'">'+esc(label)+'</span>';
const page=(label,title,desc)=>'<div class="page"><div class="eyebrow">'+label+'</div><h1>'+title+'</h1><p>'+desc+'</p></div>';
const section=(title,body,link='')=>'<section class="section"><div class="heading"><h2>'+title+'</h2>'+link+'</div>'+body+'</section>';
const partLink=(p)=>'<a class="part-link link" href="#inventory/'+encodeURIComponent(p.id)+'">'+esc(p.name)+'</a>';
function blockers(p){
 return [...p.prereqs.map(x=>byId(state.projects,x)).filter(x=>x?.status!=='Done').map(x=>'Finish '+(x?.name??'an unavailable prerequisite')),...p.needs.map(x=>byId(state.parts,x)).filter(x=>x?.state!=='Owned').map(x=>(x?.state==='Needed'?'Get ':'Verify ')+(x?.name??'a missing inventory item'))];
}
const score=(p)=>p.learning+p.enjoyment+p.portfolio-p.difficulty+(p.status==='In progress'?3:0)+(String(p.phase)===state.phase?2:0);
function ranked(){return state.projects.filter(p=>['Backlog','In progress'].includes(p.status)&&(state.focus==='All tracks'||p.track===state.focus)&&p.minutes<=limit).sort((a,b)=>blockers(a).length-blockers(b).length||(sort==='Shortest'?a.minutes-b.minutes:sort==='Most enjoyable'?b.enjoyment-a.enjoyment:score(b)-score(a))||a.minutes-b.minutes)}
function projectCard(p){
 const needs=blockers(p), readiness=p.status==='Done'?'Done':needs.length?needs.length+' to check':'Ready';
 return '<article class="card project"><div class="row"><span class="eyebrow">'+esc(p.track)+'</span>'+badge(readiness,needs.length?'':'ready')+'</div><h3>'+esc(p.name)+'</h3><p class="muted">'+esc(p.finish)+'</p><div class="chips">'+badge(p.minutes+' min')+badge('$'+p.cost)+badge('Difficulty '+p.difficulty+'/5')+'</div><div class="actions">'+action('project','Open project ↗',p.id)+(p.status!=='Backlog'?badge(p.status,'active'):'')+'</div></article>';
}
function weekly(){
 const wk=weekKey(), checks=state.weekChecks[wk]??[];
 return '<div class="card"><div class="row"><div><div class="eyebrow">Week of '+esc(wk)+'</div><h3>Weekly rhythm</h3></div>'+action('schedule','Edit')+'</div><p class="muted">'+checks.filter(i=>state.schedule[i]).length+' / '+state.schedule.length+' sessions complete</p>'+state.schedule.map((s,i)=>'<label class="schedule-line"><input type="checkbox" data-check="'+i+'" '+(checks.includes(i)?'checked':'')+'><span><strong>'+esc(s.task)+'</strong><small>'+esc(s.day)+' · '+s.minutes+' min</small><small>'+esc(s.desc)+'</small></span></label>').join('')+'</div>';
}
function home(){
 const done=state.projects.filter(p=>p.status==='Done').length, s=byId(state.phases,state.phase), p=state.projects.filter(p=>p.status==='In progress'), next=ranked().slice(0,3);
 return '<section class="hero"><div><div class="eyebrow">⌁ &nbsp; PERSONAL ROBOTICS LAB</div><h1>Robotics<br>Workbench</h1><p>Pick a small experiment, build it at the bench, and keep a record of what you learn.</p><div class="actions"><a class="button primary" href="#review">Choose next project →</a><a class="button" href="#path">View learning path</a></div></div></section>'+
 '<div class="stats">'+[['Learning focus',state.phase+' / 6',s.title],['Projects finished',done,state.projects.length+' in backlog'],['Parts on hand',state.parts.filter(p=>p.state==='Owned').length,'Inventory entries'],['Experiments logged',state.entries.length,'Journal entries']].map(([a,b,c])=>'<div class="card stat"><div class="eyebrow">'+a+'</div><span class="value">'+b+'</span><small>'+esc(c)+'</small></div>').join('')+'</div>'+
 '<div class="split"><div>'+section(p.length?'On the bench':'Start here','<div class="card">'+(p.length?p:state.projects.filter(x=>['continuity','blink','linkage'].includes(x.id)&&x.status!=='Done')).map((x,i)=>'<div class="item"><span class="tile">'+['⌁','▣','◇'][i%3]+'</span><div><strong>'+esc(x.name)+'</strong><small>'+esc(x.track)+' · '+x.minutes+' min</small></div>'+action('project','Open ↗',x.id)+'</div>').join('')+(!(p.length||state.projects.some(x=>['continuity','blink','linkage'].includes(x.id)&&x.status!=='Done'))?'<p>Choose a new experiment in Weekly review.</p>':'')+'</div>','<a href="#projects">All projects ↗</a>')+'</div>'+weekly()+'</div>'+
 section('Next experiments',next.length?'<div class="grid">'+next.map(projectCard).join('')+'</div>':'<div class="empty">No projects match your current review filters.</div>','<a href="#review">Open review ↗</a>');
}
function path(){
 const complete=state.projects.filter(p=>p.status==='Done').length;
 const map='<div class="card"><div class="map"><a class="badge" href="#path/1">Bench basics</a> → <a class="badge" href="#path/2">Arduino</a> → <a class="badge" href="#path/3">Embedded</a> → <a class="badge" href="#path/4">Actuated mechanisms</a> → <a class="badge" href="#path/6">Fabrication</a></div><p class="muted">Hand-powered mechanisms can start alongside circuits. <a class="link" href="#path/5">Simulation and camera work</a> can run in parallel once you’re ready to use your programming background. Projects list their individual prerequisites.</p></div>';
 return page('Plan','Learning path','Six suggested months. Set your current focus, repeat a phase or edit the weekly milestones as your interests change.')+'<div class="split"><div class="stack">'+map+'<div class="card"><div class="row"><h3>Project progress</h3><span>'+complete+' / '+state.projects.length+'</span></div><div class="progress"><span style="width:'+Math.round(100*complete/Math.max(1,state.projects.length))+'%"></span></div></div></div>'+weekly()+'</div>'+section('Six-month path','<div class="stack">'+state.phases.map(x=>{
 const own=state.projects.filter(p=>String(p.phase)===x.id);
 return '<article class="card phase" id="phase-'+x.id+'"><div class="phase-id">'+x.id.padStart(2,'0')+'</div><div><div class="row"><h3>'+esc(x.title)+'</h3>'+(state.phase===x.id?badge('Current focus','active'):'')+'</div><div class="muted">'+esc(x.source)+'</div><p>'+esc(x.desc)+'</p><div class="chips">'+x.weeks.map((w,i)=>badge('Week '+(i+1)+' · '+w)).join('')+'</div><div class="chips section">'+own.map(p=>action('project',esc(p.name)+(p.status==='Done'?' ✓':''),p.id)).join('')+'</div></div><div class="actions">'+action('phase-focus','Set focus',x.id)+action('phase-edit','Edit',x.id)+'</div></article>';
 }).join('')+'</div>');
}
function backlog(){
 const shown=state.projects.filter(p=>(filter==='All tracks'||filter===p.track)&&(statusFilter==='All statuses'||statusFilter===p.status));
 return page('Build','Project backlog','Browse small experiments by interest and status, or add a finish line of your own.')+'<div class="row toolbar"><div class="actions"><select id="track-filter" aria-label="Filter by interest">'+['All tracks',...tracks].map(x=>option(x,filter)).join('')+'</select><select id="status-filter" aria-label="Filter by status">'+['All statuses',...statuses].map(x=>option(x,statusFilter)).join('')+'</select></div>'+action('project-edit','＋ Add project','','primary')+'</div>'+
 (shown.length?'<div class="grid">'+shown.map(projectCard).join('')+'</div>':'<div class="empty">No projects match these filters.</div>');
}
function inventory(ref){
 return page('Build','Parts inventory','The components you already own are marked Owned. Check exact models, connectors, power supplies and kit quantities at the bench.')+'<div class="heading"><h2>'+state.parts.length+' inventory entries</h2>'+action('part','＋ Add part','','primary')+'</div><div class="table-wrap"><table><thead><tr><th scope="col">Part</th><th scope="col">Category</th><th scope="col">Quantity</th><th scope="col">Availability</th><th scope="col">Projects</th><th scope="col">Edit</th></tr></thead><tbody>'+state.parts.map(p=>'<tr id="part-'+esc(p.id)+'" class="'+(ref===p.id?'highlight':'')+'"><td><strong>'+esc(p.name)+'</strong>'+(p.notes?'<br><small class="muted">'+esc(p.notes)+'</small>':'')+'</td><td>'+esc(p.category)+'</td><td>'+esc(p.quantity)+'</td><td>'+badge(p.state,p.state==='Owned'?'ready':'')+'</td><td>'+state.projects.filter(x=>x.needs.includes(p.id)).length+'</td><td>'+action('part','Edit',p.id)+'</td></tr>').join('')+'</tbody></table></div>';
}
function journal(){
 return page('Document','Experiment journal','Capture your setup, test results and lessons so you can pick up where you left off.')+'<div class="heading"><h2>'+state.entries.length+' entries</h2>'+action('new-entry','＋ New entry','','primary')+'</div>'+
 (state.entries.length?'<div class="stack">'+[...state.entries].sort((a,b)=>b.date.localeCompare(a.date)).map(e=>'<article class="card entry"><div class="row"><div><div class="eyebrow">'+esc(e.date)+'</div><h3>'+esc(e.title)+'</h3></div>'+action('edit-entry','Edit entry',e.id)+'</div><p>'+ (e.project?action('project',esc(byId(state.projects,e.project)?.name??'Project'),e.project):'')+'</p><dl>'+[['Notes',e.notes],['Test results',e.results],['Lessons learned',e.lessons]].filter(([,v])=>v).map(([k,v])=>'<dt>'+k+'</dt><dd class="entry-text">'+esc(v)+'</dd>').join('')+'</dl><div class="photo-grid">'+e.photos.filter(x=>/^data:image\/jpeg;base64,/.test(x)).map(src=>'<a href="'+src+'" download="experiment-photo.jpg"><img alt="Experiment photo" src="'+src+'"></a>').join('')+'</div></article>').join('')+'</div>':'<div class="empty">Your journal is empty. Log your first measurement, failed attempt or completed experiment.</div>');
}
function review(){
 const rank=ranked(), ready=rank.filter(p=>!blockers(p).length), pending=rank.filter(p=>blockers(p).length);
 return page('Reflect','Weekly review','Choose one finish line that fits your next bench session. Change the interest, time limit or ranking whenever you review.')+'<div class="split"><div class="card"><h3>Choose your next session</h3><div class="form-grid multi section"><label class="field">Interest<select id="focus">'+['All tracks',...tracks].map(x=>option(x,state.focus)).join('')+'</select></label><label class="field">Maximum minutes<input id="time-limit" type="number" min="10" max="600" value="'+limit+'"></label><label class="field">Rank by<select id="sort">'+['Balanced','Shortest','Most enjoyable'].map(x=>option(x,sort)).join('')+'</select></label></div><p class="muted">Balanced uses learning, enjoyment and portfolio ratings, with a preference for lower difficulty, active builds and your current learning phase.</p><p class="muted">After the session, log what surprised you, update the project’s enjoyment rating, and decide whether to repeat, extend or park it.</p></div>'+weekly()+'</div>'+
 section('Ready to build',ready.length?'<div class="grid">'+ready.map(projectCard).join('')+'</div>':'<div class="empty">No ready projects match these filters. Check the items below or try a different session length.</div>')+
 section('Needs a check',pending.length?'<div class="grid">'+pending.map(p=>'<div>'+projectCard(p)+'<small class="muted">'+blockers(p).map(esc).join(' · ')+'</small></div>').join('')+'</div>':'<div class="empty">No prerequisite or parts checks in this selection.</div>');
}
function sources(){return page('Reference','Resources','Use the book at the bench, then add structured courses or practitioner references when a project calls for them.')+'<div class="grid">'+resources.map(([track,title,desc,url])=>'<article class="card project"><div class="eyebrow">'+esc(track)+'</div><h3>'+esc(title)+'</h3><p class="muted">'+esc(desc)+'</p><div class="actions"><a class="button" target="_blank" rel="noopener" href="'+url+'">Open resource ↗</a></div></article>').join('')+'</div>'}
const views={home,path,projects:backlog,inventory,journal,review,resources:sources};
function route(){const [name,ref] = location.hash.slice(1).split('/');return [Object.hasOwn(views,name)?name:'home',ref??'']}
function render(){
 const [name,ref]=route(), label=nav.find(x=>x[0]===name)[2];
 $('#nav').innerHTML='<div class="nav-title">Workspace</div>'+nav.map(([x,icon,title])=>'<a href="#'+x+'" class="nav-link" '+(name===x?'aria-current="page"':'')+'><i aria-hidden="true">'+icon+'</i>'+title+'</a>').join('');
 $('#crumb').innerHTML='Workbench &nbsp; / &nbsp; <strong>'+label+'</strong>';
 $('#view').innerHTML=views[name](ref);
}
addEventListener('hashchange',()=>{if($('#modal').open)$('#modal').close();render();const [page,ref]=route();const node=ref?document.getElementById((page==='path'?'phase-':'part-')+ref):null;if(node)node.scrollIntoView({block:'center'});else scrollTo(0,0)});
function modal(title,body){const d=$('#modal');d.innerHTML='<div class="heading"><h2>'+esc(title)+'</h2>'+action('close','✕')+'</div>'+body;if(!d.open)d.showModal()}
const field=(label,name,value='',attrs='')=>'<label class="field">'+label+'<input name="'+name+'" value="'+esc(value)+'" '+attrs+'></label>';
const area=(label,name,value='',required='')=>'<label class="field">'+label+'<textarea name="'+name+'" '+required+'>'+esc(value)+'</textarea></label>';
const select=(label,name,values,value)=>'<label class="field">'+label+'<select name="'+name+'">'+values.map(x=>option(x,value)).join('')+'</select></label>';
const submit=(text)=>'<div class="actions"><button class="primary">'+text+'</button>'+action('close','Cancel')+'</div>';
const multiselect=(label,name,items,selected)=>'<label class="field">'+label+'<select name="'+name+'" multiple size="5">'+items.map(x=>'<option value="'+esc(x.id)+'" '+(selected.includes(x.id)?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select><small class="muted">Select any that apply. Use Ctrl or Command for multiple on desktop.</small></label>';
function projectDetail(p){
 if(!p)return;
 const related=state.entries.filter(e=>e.project===p.id);
 modal(p.name,'<div class="chips">'+badge(p.track)+badge(p.minutes+' min')+badge('$'+p.cost+' estimated')+badge('Difficulty '+p.difficulty+'/5')+'</div><h3 class="section">Finish line</h3><p>'+esc(p.finish)+'</p><div class="chips">'+badge('Learning '+p.learning+'/5')+badge('Enjoyment '+p.enjoyment+'/5')+badge('Portfolio '+p.portfolio+'/5')+'</div><h3 class="section">Prerequisites</h3><div class="actions">'+(p.prereqs.map(i=>byId(state.projects,i)).filter(Boolean).map(x=>action('project',esc(x.name)+(x.status==='Done'?' ✓':''),x.id)).join('')||'<span class="muted">None</span>')+'</div><h3 class="section">Parts</h3><ul>'+ (p.needs.map(i=>byId(state.parts,i)).filter(Boolean).map(x=>'<li>'+partLink(x)+' · '+esc(x.state)+'</li>').join('')||'<li>Computer only</li>')+'</ul><div class="row section"><label class="field">Status<select id="project-status" data-id="'+esc(p.id)+'">'+statuses.map(x=>option(x,p.status)).join('')+'</select></label><div class="actions">'+action('project-edit','Edit project',p.id)+action('new-entry','Log experiment',p.id,'primary')+'</div></div><p class="muted">'+related.length+' linked journal '+(related.length===1?'entry':'entries')+(related.length?' · <a class="link" href="#journal">Open journal ↗</a>':'')+'</p>');
}
function projectEdit(item){
 const p=item??{id:id(),name:'',track:tracks[0],phase:Number(state.phase),minutes:45,difficulty:1,cost:'0',learning:3,enjoyment:3,portfolio:3,finish:'',needs:[],prereqs:[],status:'Backlog'};
 const validPrereqs=state.projects.filter(x=>{
  const stack=[x.id], seen=new Set();
  while(stack.length){const ref=stack.pop();if(ref===p.id)return false;if(seen.has(ref))continue;seen.add(ref);stack.push(...(byId(state.projects,ref)?.prereqs??[]))}
  return true;
 });
 modal(item?'Edit project':'Add project','<form>'+field('Project name','name',p.name,'required maxlength="100"')+'<div class="form-grid">'+select('Interest','track',tracks,p.track)+select('Status','status',statuses,p.status)+'</div>'+area('Finish line or test criterion','finish',p.finish,'required maxlength="1500"')+'<div class="form-grid multi">'+field('Suggested month','phase',p.phase,'required type="number" min="1" max="6"')+field('Estimated minutes','minutes',p.minutes,'required type="number" min="5" max="600"')+field('Additional cost in USD','cost',p.cost,'required maxlength="25"')+['difficulty','learning','enjoyment','portfolio'].map(x=>field(x[0].toUpperCase()+x.slice(1)+' (1–5)',x,p[x],'required type="number" min="1" max="5"')).join('')+'</div><div class="form-grid">'+multiselect('Required parts','needs',state.parts,p.needs)+multiselect('Prerequisite projects','prereqs',validPrereqs,p.prereqs)+'</div>'+submit('Save project')+'</form>');
 $('#modal form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);const data={...p,...Object.fromEntries(f),needs:f.getAll('needs'),prereqs:f.getAll('prereqs')};for(const k of ['phase','minutes','difficulty','learning','enjoyment','portfolio'])data[k]=Number(f.get(k));if(save({...state,projects:update('projects',data)},'Project saved'))projectDetail(data)};
}
function partEdit(item){
 const p=item??{id:id(),name:'',category:'',quantity:'',state:'Needed',notes:''};
 modal(item?'Edit part':'Add part','<form>'+field('Part name','name',p.name,'required maxlength="100"')+'<div class="form-grid">'+field('Category','category',p.category,'required')+field('Quantity / model','quantity',p.quantity)+'</div>'+select('Availability','state',['Owned','Verify','Needed'],p.state)+area('Notes','notes',p.notes)+submit('Save part')+'</form>');
 $('#modal form').onsubmit=e=>{e.preventDefault();if(save({...state,parts:update('parts',{...p,...Object.fromEntries(new FormData(e.currentTarget))})},'Part saved'))$('#modal').close()};
}
async function photo(file){
 const url=URL.createObjectURL(file), img=new Image();img.src=url;
 try{await img.decode();const scale=Math.min(1,900/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.72)}finally{URL.revokeObjectURL(url)}
}
function entryEdit(item,ref=''){
 const p=item??{id:id(),title:'',date:today(),project:ref,notes:'',results:'',lessons:'',photos:[]};
 modal(item?'Edit experiment':'Log experiment','<form>'+field('Experiment title','title',p.title,'required maxlength="130"')+'<div class="form-grid">'+field('Date','date',p.date,'required type="date"')+'<label class="field">Project<select name="project"><option value="">Independent experiment</option>'+state.projects.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===p.project?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></label></div>'+area('Notes and setup','notes',p.notes)+area('Test results and measurements','results',p.results)+area('Lessons and next adjustment','lessons',p.lessons)+'<label class="field">Add photos<input type="file" name="photos" accept="image/*" multiple><small class="muted">Photos are resized to fit browser storage.</small></label>'+p.photos.map((_,i)=>'<label><input type="checkbox" name="remove" value="'+i+'"> Remove photo '+(i+1)+'</label>').join('')+submit('Save entry')+'</form>');
 $('#modal form').onsubmit=async e=>{
  e.preventDefault();const form=e.currentTarget,f=new FormData(form),button=form.querySelector('button.primary');button.disabled=true;
  try{const files=f.getAll('photos').filter(x=>x.size);const photos=[...p.photos.filter((_,i)=>!f.getAll('remove').includes(String(i))),...await Promise.all(files.map(photo))];const entry={...p,...Object.fromEntries(f),photos};delete entry.remove;if(save({...state,entries:update('entries',entry)},'Experiment logged')){$('#modal').close();location.hash='journal'}}
  catch{toast('A photo could not be read. Try a JPG or PNG.')}finally{button.disabled=false}
 };
}
function phaseEdit(p){
 modal('Edit learning phase','<form>'+field('Name','title',p.title,'required')+field('Resource or focus','source',p.source)+area('Learning goal','desc',p.desc)+p.weeks.map((w,i)=>field('Week '+(i+1),'week'+i,w,'required')).join('')+submit('Save phase')+'</form>');
 $('#modal form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);const next={id:p.id,title:f.get('title'),source:f.get('source'),desc:f.get('desc'),weeks:p.weeks.map((_,i)=>f.get('week'+i))};if(save({...state,phases:update('phases',next)},'Phase updated'))$('#modal').close()};
}
function scheduleEdit(){
 modal('Edit weekly rhythm','<form>'+state.schedule.map((s,i)=>'<div class="card"><div class="form-grid">'+field('Day or session label','day'+i,s.day,'required')+field('Minutes','minutes'+i,s.minutes,'required type="number" min="5" max="600"')+'</div>'+field('Task','task'+i,s.task,'required')+area('What to do','desc'+i,s.desc)+'</div>').join('')+submit('Save schedule')+'</form>');
 $('#modal form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);const session=state.schedule.map((_,i)=>Object.fromEntries(['day','minutes','task','desc'].map(x=>[x,x==='minutes'?Number(f.get(x+i)):f.get(x+i)])));if(save({...state,schedule:session},'Schedule updated'))$('#modal').close()};
}
function validBackup(x){
 const strings=(o,keys)=>keys.every(k=>typeof o?.[k]==='string');
 const list=(v)=>Array.isArray(v)&&v.every(z=>typeof z==='string');
 return x&&['parts','phases','projects','schedule','entries'].every(k=>Array.isArray(x[k]))&&
 x.parts.every(p=>strings(p,['id','name','category','quantity','state','notes']))&&
 x.phases.length===6&&x.phases.some(p=>p.id===x.phase)&&x.phases.every(p=>strings(p,['id','title','source','desc'])&&list(p.weeks))&&
 x.projects.every(p=>strings(p,['id','name','track','status','finish','cost'])&&list(p.prereqs)&&list(p.needs)&&['phase','minutes','difficulty','learning','enjoyment','portfolio'].every(k=>Number.isFinite(p[k])))&&
 x.schedule.every(s=>strings(s,['day','task','desc'])&&Number.isFinite(s.minutes))&&
 x.entries.every(e=>strings(e,['id','title','date','project','notes','results','lessons'])&&list(e.photos))&&
 typeof x.focus==='string'&&x.weekChecks&&Object.values(x.weekChecks).every(a=>Array.isArray(a)&&a.every(Number.isInteger));
}
function backup(){
 modal('Backup & restore','<p class="muted">Projects, progress, and photos are saved in this browser. Export a backup to keep a copy or move your workspace to another device. Restoring replaces the current browser’s workspace.</p><div class="actions">'+action('export','Download backup','','primary')+'</div><form class="section"><label class="field">Restore a backup file<input type="file" accept=".json,application/json" required></label>'+submit('Restore workspace')+'</form>');
 $('#modal form').onsubmit=async e=>{e.preventDefault();try{const next=JSON.parse(await e.currentTarget.querySelector('input').files[0].text());if(!validBackup(next))throw Error();if(save(next,'Workspace restored'))$('#modal').close()}catch{toast('This file is not a valid Workbench backup.')}};
}
function download(){
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(state)],{type:'application/json'}));a.href=url;a.download='robotics-workbench-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-action]');if(!b)return;const ref=b.dataset.id,p=byId(state.projects,ref);
 const actions={'close':()=>$('#modal').close(),'project':()=>projectDetail(p),'project-edit':()=>projectEdit(p),'part':()=>partEdit(byId(state.parts,ref)),'new-entry':()=>entryEdit(null,ref),'edit-entry':()=>entryEdit(byId(state.entries,ref)),'schedule':scheduleEdit,'phase-edit':()=>phaseEdit(byId(state.phases,ref)),'phase-focus':()=>save({...state,phase:ref},'Learning focus updated'),'export':download};
 actions[b.dataset.action]?.();
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.matches('[data-check]')){const wk=weekKey(), checks=new Set(state.weekChecks[wk]??[]),i=Number(t.dataset.check);if(t.checked)checks.add(i);else checks.delete(i);save({...state,weekChecks:{...state.weekChecks,[wk]:[...checks]}});document.querySelector('[data-check="'+i+'"]')?.focus()}
 if(t.id==='track-filter'){filter=t.value;render();$('#track-filter').focus()}
 if(t.id==='status-filter'){statusFilter=t.value;render();$('#status-filter').focus()}
 if(t.id==='sort'){sort=t.value;render();$('#sort').focus()}
 if(t.id==='time-limit'&&t.value){limit=Math.max(10,Math.min(600,Number(t.value)));render()}
 if(t.id==='focus'){save({...state,focus:t.value});$('#focus').focus()}
 if(t.id==='project-status'){const p={...byId(state.projects,t.dataset.id),status:t.value};if(save({...state,projects:update('projects',p)},'Status updated'))projectDetail(p)}
});
$('#backup').addEventListener('click',backup);
render();
