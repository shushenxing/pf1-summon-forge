import {monsters,byId} from './monsters.js';
import {DEFAULT_STATE,normalize,calculate,available,signed,modifier,formatAttack,statblock,templateChoices,templateNames,smiteNames,resistNames,isGoodAlignment} from './engine.js';

const key='pf1-summon-forge-v1';
const presetKey='pf1-summon-presets-v1';
const $=id=>document.getElementById(id);
const esc=t=>String(t).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const abilityNames=['力量 STR','敏捷 DEX','体质 CON','智力 INT','感知 WIS','魅力 CHA'];
const fields=['spell','monster','origin','casterAlignment','casterLevel','augment','summonGood','template','smite','inspire','flank','charge','power','mastery'];
const bools=new Set(['augment','summonGood','smite','flank','charge','power']);
const nums=new Set(['spell','casterLevel','inspire']);
const basePresets=[
  {name:'天界狼 · 惩击',settings:{...DEFAULT_STATE,monster:'wolf'}},
  {name:'绝对狼 · 惩击混乱',settings:{...DEFAULT_STATE,monster:'wolf',origin:'standard',template:'resolute',smite:true}},
  {name:'天界鹰群 · 降环',settings:{...DEFAULT_STATE,monster:'eagle',origin:'good',spell:2}},
  {name:'法翁 · 法术支援',settings:{...DEFAULT_STATE,monster:'faun',origin:'good',template:'none',smite:false}},
  {name:'土元素 · 隔墙战斗',settings:{...DEFAULT_STATE,monster:'earth',origin:'standard',template:'none',smite:false,mastery:'favorable'}}
];
let presets=[];
let state=normalize(readLocal(key,DEFAULT_STATE));
let current=calculate(state);
let toastTimer;

function readLocal(k,fallback){try{const obj=JSON.parse(localStorage.getItem(k));return obj??fallback;}catch{return fallback;}}
function saveLocal(k,x){try{localStorage.setItem(k,JSON.stringify(x));}catch{toast('此浏览器无法保存数据，当前操作仍可使用');}}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2500);}
function setSelect(el,opts,value){
  const html=opts.map(([v,label])=>`<option value="${esc(v)}">${esc(label)}</option>`).join('');
  if(el.innerHTML!==html)el.innerHTML=html;
  el.value=value;
}

function syncControls(){
  const allowed=available(state);
  setSelect($('monster'),allowed.map(m=>[m.id,`${m.name} / ${m.en} · ${m.tier}环`]),state.monster);
  const m=byId[state.monster];
  const origins=m.lists.filter(x=>x==='standard'||(state.summonGood&&isGoodAlignment(state.casterAlignment)&&!(state.template==='resolute'&&m.templateEligible)));
  setSelect($('origin'),origins.map(o=>[o,o==='good'?'召唤善良怪物特殊列表':'召唤怪物普通列表']),state.origin);
  const choices=templateChoices(m,state.casterAlignment);
  setSelect($('template'),choices.map(c=>[c,c==='none'?'无额外模板':`${templateNames[c]}模板`]),state.template);
  $('source-note').textContent=state.origin==='good'?'特殊列表：此生物额外获得顽强（Diehard）':state.template==='resolute'?'绝对模板使用普通召唤列表，不自动获得顽强':'普通列表：不会因为召唤善良怪物专长获得顽强';
  $('template-note').textContent=!m.templateEligible?'这个召唤选项没有额外的阵营模板':state.casterAlignment==='LG'?'守序善良：可以从天界与绝对模板中任选一种，不叠加。':'扩展召唤表：按召唤者阵营选择模板，同一生物一次只应用一种。';
  $('summonGood').disabled=!isGoodAlignment(state.casterAlignment);
  $('smiteRow').classList.toggle('hidden',state.template==='none');
  $('smiteTitle').textContent=`启用${smiteNames[state.template]||'惩击'}`;
  $('powerRow').classList.toggle('hidden',!m.feats.includes('猛力攻击'));
  $('masteryRow').classList.toggle('hidden',!m.mastery);
  $('masteryTitle').textContent=m.mastery==='earth'?'大地掌控：地形条件':'水流掌控：地形条件';
  for(const k of fields){if(['monster','origin','template'].includes(k))continue;const el=$(k);if(bools.has(k))el.checked=Boolean(state[k]);else el.value=String(state[k]);}
}

const pill=(label,highlight=false)=>`<span class="stat-tag ${highlight?'highlight':''}">${esc(label)}</span>`;
const row=(name,val)=>`<div class="stat-line"><span>${esc(name)}</span><strong>${esc(val)}</strong></div>`;
function render(){
  current=calculate(state);state=current.state;
  syncControls();
  const d=current,m=d.m;
  $('creature-title').textContent=d.name;
  $('creature-subtitle').textContent=`${m.en} · ${m.size}${m.type} · ${d.alignment} · ${state.origin==='good'?'善良专长列表':'标准召唤列表'}`;
  $('cr').textContent=d.cr;
  $('hp').textContent=d.hp;
  $('ac').textContent=d.ac[0];
  $('init').textContent=signed(m.init);
  $('speed').textContent=m.speed.replace('陆行 ','').split('；')[0];
  const tags=[];
  if(state.augment)tags.push(pill('增强召唤',true));
  if(d.templateName)tags.push(pill(`${d.templateName}模板`,true));
  if(d.featDiehard)tags.push(pill('顽强 Diehard',true));
  if(d.canSmite&&state.smite)tags.push(pill(`${smiteNames[state.template]}：已启用`,true));
  if(state.inspire)tags.push(pill(`激励勇气 +${state.inspire}`));
  if(state.flank)tags.push(pill('夹击'));
  if(state.charge)tags.push(pill('冲锋'));
  if(state.power)tags.push(pill('猛力攻击'));
  if(state.mastery!=='normal')tags.push(pill(state.mastery==='favorable'?'有利地形':'不利地形'));
  $('stat-tags').innerHTML=tags.join('')||pill('基础面板');
  $('summon-count').textContent=`召唤 ${d.countNotation} 只 · 持续 ${state.casterLevel} 分钟（大师召唤师 SLA）`;
  $('rolled-count').textContent='';
  $('defense').innerHTML=[
    row('防御等级',`${d.ac[0]} / 接触 ${d.ac[1]} / 措手 ${d.ac[2]}`),
    row('强韧 / 反射 / 意志',d.saves.map(signed).join(' / ')),
    row('基础攻击 / CMB',`${signed(m.bab)} / ${signed(d.cmb)}`),
    row('CMD',`${d.cmd}${d.cmdTrip!=null?`（防摔绊 ${d.cmdTrip}）`:''}`),
    ...(d.sr?[row('法术抗力 SR',d.sr)]:[]),
    ...(d.dr?[row('伤害减免 DR',d.dr)]:[]),
    ...(d.resist?[row('能量抗力',`${resistNames[state.template]} 各${d.resist}`)]:[]),
    ...(m.immunity?[row('免疫',m.immunity.join('、'))]:[])
  ].join('');
  $('abilities').innerHTML=d.ability.map((v,i)=>`<div class="ability-item ${v!==m.ability[i]?'modified':''}"><span>${abilityNames[i]}</span><strong>${v}</strong><small>${signed(modifier(v))}${v!==m.ability[i]?' · 已增强':''}</small></div>`).join('');
  $('attacks').innerHTML=d.attacks.map(a=>`<div class="attack-item"><div class="attack-item-head"><span>${esc(a.count>1?`${a.count} × `:'')}${esc(a.name)}</span><span>${a.ranged?'远程':'近战'}</span></div><div class="attack-item-bonus">${signed(a.attackBonus)}</div><div class="attack-item-dice">${esc(a.dice)}${a.damageBonus===0?'':esc(signed(a.damageBonus))}${esc(a.crit||'')}</div>${a.note?`<p class="attack-item-note">${esc(a.note)}</p>`:''}</div>`).join('');
  $('combat-math').textContent=`攻击面板包含所有勾选增益；惩击只针对指定有效目标。完整攻击写法：${d.attacks.map(formatAttack).join('；')}`;

  const feats=[...m.feats,...(d.featDiehard?['顽强（Diehard，专长额外赋予）']:[])];
  const specials=d.specials.map(x=>`${x.name}（DC ${x.calculatedDC}）：${x.text}`);
  const other=[...m.traits];
  if(d.canSmite)other.push(`${smiteNames[state.template]} 1/日，${state.smite?'当前已启用':'当前未启用'}；命中 ${signed(d.smiteAttack)}，伤害 +${d.smiteDamage}。`);
  if(d.templateName)other.push(`${d.templateName}模板赋予黑暗视觉60尺。`);
  const spells=m.spells?.flatMap(([frequency,text])=>[`${frequency}：${text}`])||[];
  $('features').innerHTML=`
    <div><p class="feature-title">已有专长</p><div class="feature-list">${feats.map(x=>`<p>✧ ${esc(x)}</p>`).join('')}</div><p class="feature-title" style="margin-top:22px">技能</p><div class="feature-list"><p>${d.skills.map(x=>`${x.name} ${signed(x.value)}`).join(' · ')}</p></div></div>
    <div><p class="feature-title">特殊能力</p><div class="feature-list">${[...specials,...other,...spells].map(x=>`<p>✦ ${esc(x)}</p>`).join('')}</div>${m.languages?`<p class="feature-title" style="margin-top:18px">语言</p><div class="feature-list"><p>${esc(m.languages)}</p></div>`:''}</div>
    <div class="feature-note" style="grid-column:1/-1">${esc(m.tip)}</div>`;
  $('calculations').innerHTML=[...d.details,...d.attacks.map(a=>`${a.name}：${a.formula}`)].map(x=>`<div class="formula-line">${esc(x)}</div>`).join('');
  $('source-link').href=m.source;
  saveLocal(key,state);
}

function setState(update){state=normalize({...state,...update});render();}
function readControls(k){const el=$(k);const value=bools.has(k)?el.checked:nums.has(k)?Number(el.value):el.value;setState({[k]:value});}

async function copy(){
  const t=statblock(current);
  try{await navigator.clipboard.writeText(t);toast('完整中文面板已复制');}
  catch{
    const textarea=document.createElement('textarea');textarea.value=t;textarea.style.position='fixed';textarea.style.left='-9999px';document.body.append(textarea);textarea.select();
    const ok=document.execCommand('copy');textarea.remove();toast(ok?'完整中文面板已复制':'复制受限，可使用下载文本');
  }
}

function download(){
  const blob=new Blob([statblock(current)],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`PF1_${current.name}_面板.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);toast('已开始下载面板文本');
}

function renderPresets(){
  const container=$('presets');container.replaceChildren();
  if(!presets.length){const p=document.createElement('p');p.className='empty-presets';p.textContent='还没有预设。配置好面板后，可以在这里保存。';container.append(p);return;}
  for(const [i,p] of presets.entries()){
    const wrap=document.createElement('div');wrap.className='preset-item';
    const open=document.createElement('button');open.textContent=p.name;open.title=`加载 ${p.name}`;
    open.addEventListener('click',()=>{state=normalize(p.settings);render();toast(`已加载：${p.name}`);});
    const del=document.createElement('button');del.className='delete';del.textContent='×';del.title=`删除 ${p.name}`;del.setAttribute('aria-label',`删除 ${p.name}`);
    del.addEventListener('click',()=>{presets.splice(i,1);saveLocal(presetKey,presets);renderPresets();});
    wrap.append(open,del);container.append(wrap);
  }
}

function setup(){
  const saved=readLocal(presetKey,null);
  presets=Array.isArray(saved)?saved:basePresets;
  for(const k of fields){$(k).addEventListener('change',()=>readControls(k));}
  $('copy').addEventListener('click',copy);$('copy-top').addEventListener('click',copy);
  $('download').addEventListener('click',download);
  $('reset').addEventListener('click',()=>{state=normalize(DEFAULT_STATE);render();toast('已恢复默认设置');});
  $('roll-count').addEventListener('click',()=>{$('rolled-count').textContent=current.countNotation==='1'?'1 只':`${Math.floor(Math.random()*3)+1} 只`;});
  $('save-preset').addEventListener('click',()=>{
    const name=$('preset-name').value.trim()||`${current.name} · ${state.origin==='good'?'善良专长':'普通列表'}`;
    if(presets.length>=24){toast('最多保存24个预设，请先删除旧预设');return;}
    presets.unshift({name,settings:{...state}});saveLocal(presetKey,presets);$('preset-name').value='';renderPresets();toast('召唤预设已保存');
  });
  $('preset-name').addEventListener('keydown',e=>{if(e.key==='Enter')$('save-preset').click();});
  render();renderPresets();
}
setup();
