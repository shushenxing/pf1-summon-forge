import {byId, monsters} from './monsters.js';

export const DEFAULT_STATE = {
  spell:2, monster:'wolf', origin:'good', casterAlignment:'LG', casterLevel:3,
  augment:true, summonGood:true, template:'celestial', smite:true,
  inspire:0, flank:false, charge:false, power:false, mastery:'normal'
};

export const signed = n => n >= 0 ? `+${n}` : String(n);
export const modifier = n => Math.floor((n-10)/2);
export const alignmentNames={LG:'守序善良',NG:'中立善良',CG:'混乱善良',LN:'守序中立',N:'绝对中立',CN:'混乱中立',LE:'守序邪恶',NE:'中立邪恶',CE:'混乱邪恶'};
export const isGoodAlignment = alignment => alignment?.endsWith('G');
export const isLawfulAlignment = alignment => alignment?.startsWith('L');
export const templateNames={celestial:'天界',fiendish:'炼狱',resolute:'绝对',none:''};
export const smiteNames={celestial:'惩击邪恶',fiendish:'惩击善良',resolute:'惩击混乱'};
export const resistNames={celestial:'强酸、寒冷、电击',fiendish:'寒冷、火焰',resolute:'强酸、寒冷、火焰'};
export const drNames={celestial:'邪恶',fiendish:'善良',resolute:'混乱'};
const crNumber = cr => cr.includes('/') ? Number(cr.split('/')[0])/Number(cr.split('/')[1]) : Number(cr);
export const templateChoices = (monster, alignment) => {
  if(!monster.templateEligible) return ['none'];
  const choices=alignment?.endsWith('G')?['celestial']:alignment?.endsWith('E')?['fiendish']:['celestial','fiendish'];
  if(isLawfulAlignment(alignment))choices.push('resolute');
  choices.push('none');
  return choices;
};

export function available(state){
  return monsters.filter(m => m.tier<=state.spell && (
    m.lists.includes('standard') || (state.summonGood && isGoodAlignment(state.casterAlignment) && m.lists.includes('good'))
  ));
}

export function normalize(input={}){
  const s={...DEFAULT_STATE,...input};
  s.spell=Math.min(2,Math.max(1,Number(s.spell)||2));
  s.casterLevel=Math.max(1,Math.min(20,Number(s.casterLevel)||3));
  s.inspire=Math.max(0,Math.min(4,Number(s.inspire)||0));
  // Migrate presets saved by the first version, which used a single alignment axis.
  s.casterAlignment=({good:'LG',neutral:'N',evil:'NE'})[s.casterAlignment]||s.casterAlignment;
  if(!alignmentNames[s.casterAlignment])s.casterAlignment='LG';
  if(!isGoodAlignment(s.casterAlignment))s.summonGood=false;
  const eligible=available(s);
  if(!eligible.some(m=>m.id===s.monster))s.monster=eligible[0]?.id || 'eagle';
  const m=byId[s.monster];
  const templates=templateChoices(m,s.casterAlignment);
  if(!templates.includes(s.template))s.template=templates[0];
  // The good-feat entry specifically says "celestial wolf/eagle/dog". A resolute
  // animal uses the standard list, so it does not acquire Diehard by that route.
  const origins=m.lists.filter(x=>x==='standard'||(s.summonGood&&isGoodAlignment(s.casterAlignment)&&!(s.template==='resolute'&&m.templateEligible)));
  if(!origins.includes(s.origin))s.origin=origins[0]||'standard';
  if(s.template==='none')s.smite=false;
  if(!m.feats.includes('猛力攻击'))s.power=false;
  if(!m.mastery)s.mastery='normal';
  if(!['normal','favorable','unfavorable'].includes(s.mastery))s.mastery='normal';
  return s;
}

export function calculate(rawState){
  const state=normalize(rawState);
  const m=byId[state.monster];
  const oldStr=modifier(m.ability[0]);
  const oldCon=modifier(m.ability[2]);
  const dexMod=modifier(m.ability[1]);
  const scores=m.ability.map((x,i)=>x+(state.augment&&(i===0||i===2)?4:0));
  const newStr=modifier(scores[0]);
  const newCon=modifier(scores[2]);
  const strDelta=newStr-oldStr;
  const conDelta=newCon-oldCon;
  const isTemplate=state.template!=='none';
  const isSmite=isTemplate&&state.smite;
  const smiteAttack=isSmite?Math.max(0,modifier(scores[5])):0;
  const smiteDamage=isSmite?m.hd:0;
  const masteryBonus=state.mastery==='favorable'?1:state.mastery==='unfavorable'?-4:0;
  const acDelta=state.charge?-2:0;
  const hitPoints=m.hp+m.hd*conDelta;
  const saves=[m.saves[0]+conDelta,m.saves[1],m.saves[2]];
  const cr=crNumber(m.cr)+(isTemplate&&m.hd>=5?1:0);
  const sr=isTemplate?Math.floor(cr+5):m.sr||null;
  const resist=isTemplate?(m.hd<=4?5:m.hd<=10?10:15):null;
  const dr=isTemplate&&m.hd>=5?`${m.hd<=10?5:10}/${drNames[state.template]}`:m.dr||null;
  const moreDamage=state.inspire+masteryBonus+smiteDamage;
  const attackList=m.attacks.map(a=>{
    const finesseDelta=a.attackAbility==='finesse'?
      Math.max(newStr,dexMod)-Math.max(oldStr,dexMod):0;
    let attackBonus=a.bonus+(a.attackAbility==='str'?strDelta:finesseDelta)
      +state.inspire+smiteAttack+masteryBonus;
    if(!a.ranged){attackBonus+=(state.flank?2:0)+(state.charge?2:0);}
    const powerApplicable=state.power&&!a.ranged;
    if(powerApplicable)attackBonus-=1;
    // Recalculate the ability contribution, rather than rounding the delta.
    const strengthDamageDelta=(a.scale??1)>0?
      Math.floor((a.scale??1)*newStr)-Math.floor((a.scale??1)*oldStr):0;
    const powerBonus=powerApplicable ? (a.scale===1.5?3:2) : 0;
    const damageBonus=a.damage+strengthDamageDelta+moreDamage+powerBonus;
    return {...a,attackBonus,damageBonus,
      formula:`原始命中 ${signed(a.bonus)}${a.attackAbility==='str'?`，力量 ${signed(strDelta)}`:a.attackAbility==='finesse'?`，武器娴熟取力量/敏捷较优值 ${signed(finesseDelta)}`:'，敏捷命中不受力量影响'}，激励 ${signed(state.inspire)}${masteryBonus?`，地形 ${signed(masteryBonus)}`:''}${smiteAttack?`，惩击 ${signed(smiteAttack)}`:''}${!a.ranged&&state.flank?'，夹击 +2':''}${!a.ranged&&state.charge?'，冲锋 +2':''}${powerApplicable?'，猛力 –1':''}；伤害：基础 ${signed(a.damage)}，力量变化 ${signed(strengthDamageDelta)}，增益 ${signed(moreDamage)}${powerBonus?`，猛力 +${powerBonus}`:''}`};
  });
  const specials=(m.specials||[]).map(v=>({...v,calculatedDC:v.dc +
    (v.dcAbility==='con'?conDelta:v.dcAbility==='str'?strDelta:0)}));
  const skills=(m.skills||[]).map(([name,value,ability])=>({name,value:value+(ability==='str'?strDelta:ability==='con'?conDelta:0)}));
  const canSmite=m.templateEligible&&isTemplate;
  const featDiehard=state.origin==='good'&&state.summonGood;
  const templateName=templateNames[state.template];
  const name=`${templateName}${m.name}`;
  const countNotation=state.spell===m.tier?'1':'1d3';
  const details=[
    `原始生命值 ${m.hp} + ${m.hd} HD × 体质调整值变化 ${signed(conDelta)} = ${hitPoints}`,
    `强韧 ${signed(m.saves[0])} + 体质调整值变化 ${signed(conDelta)} = ${signed(saves[0])}`,
    `CMB ${signed(m.cmb)} + 力量调整值变化 ${signed(strDelta)} = ${signed(m.cmb+strDelta)}`,
    `CMD ${m.cmd} + 力量调整值变化 ${signed(strDelta)} = ${m.cmd+strDelta}`,
  ];
  if(isTemplate){
    details.push(`${templateName}模板：黑暗视觉60尺；${resistNames[state.template]}抗力按生命骰决定；SR=CR+5（非整数CR向下取整）`);
    if(canSmite)details.push(`${smiteNames[state.template]}：攻击加魅力正调整值 ${signed(smiteAttack)}，每次命中伤害 +${m.hd}（已${isSmite?'启用':'关闭'}）；需要以迅捷动作指定目标。`);
    if(state.template==='resolute')details.push('扩展召唤表：守序施法者可以选择绝对模板；守序善良施法者同时符合天界与绝对模板条件，可以任选一种，但不能叠加。');
  }
  if(featDiehard)details.push('通过「召唤善良怪物」的特殊列表召唤：自动获得顽强（Diehard）。');
  if(m.id==='grig')details.push('格利精：召唤善良怪物的特殊列表明确禁止使用提琴（Fiddle）能力。');
  if(state.power)details.push('猛力攻击：BAB +1～+3 时命中 –1；唯一主要天生武器伤害额外 +3。');
  return {state,m,name,ability:scores,cr:(m.cr.includes('/') && !(isTemplate && m.hd>=5) ? m.cr : cr),ac:m.ac.map(x=>x+acDelta),hp:hitPoints,saves,
    cmb:m.cmb+strDelta,cmd:m.cmd+strDelta,cmdTrip:m.cmdTrip!=null?m.cmdTrip+strDelta:null,
    attacks:attackList,specials,skills,featDiehard,smiteAttack,smiteDamage,
    sr,resist,dr,canSmite,templateName,countNotation,
    alignment:m.templateEligible&&isTemplate ? alignmentNames[state.casterAlignment] : m.alignment,
    details};
}

export function formatAttack(a){
  return `${a.count>1?`${a.count}次`:''}${a.name} ${signed(a.attackBonus)}（${a.dice}${a.damageBonus===0?'':signed(a.damageBonus)}${a.crit||''}${a.note?`；${a.note}`:''}）`;
}

export function statblock(d){
  const {state:s,m}=d;
  return [
    `${d.name}（${m.en}）　CR ${d.cr}　${m.size} ${m.type}　阵营 ${d.alignment}`,
    `来源：召唤怪物 ${s.spell===1?'I':'II'} / ${s.origin==='good'?'召唤善良怪物列表':'普通列表'}　数量 ${d.countNotation}　持续 ${s.casterLevel}分钟（大师召唤师类法术能力）`,
    `先攻 ${signed(m.init)}；感官 ${m.senses}`,
    `AC ${d.ac[0]}，接触 ${d.ac[1]}，措手不及 ${d.ac[2]}`,
    `生命值 ${d.hp}（${m.hd}d${m.die}；基础面板 ${m.hp}，体质调整后 ${signed(d.hp-m.hp)}）`,
    `强韧 ${signed(d.saves[0])}，反射 ${signed(d.saves[1])}，意志 ${signed(d.saves[2])}`,
    `${d.dr?`DR ${d.dr}；`:''}${d.sr?`SR ${d.sr}；`:''}${d.resist?`能量抗力 ${resistNames[s.template]} 各${d.resist}；`:''}${(m.immunity||[]).length?`免疫 ${(m.immunity||[]).join('、')}；`:''}`,
    `速度 ${m.speed}`,
    `近战 ${d.attacks.filter(a=>!a.ranged).map(formatAttack).join('，') || '—'}`,
    d.attacks.some(a=>a.ranged)?`远程 ${d.attacks.filter(a=>a.ranged).map(formatAttack).join('，')}`:'',
    `力量 ${d.ability[0]} 敏捷 ${d.ability[1]} 体质 ${d.ability[2]} 智力 ${d.ability[3]} 感知 ${d.ability[4]} 魅力 ${d.ability[5]}`,
    `BAB ${signed(m.bab)}；CMB ${signed(d.cmb)}；CMD ${d.cmd}${d.cmdTrip!=null?`（对抗摔绊 ${d.cmdTrip}）`:''}`,
    `专长 ${[...m.feats,...(d.featDiehard?['顽强']:[])].join('、')}`,
    `技能 ${d.skills.map(x=>`${x.name} ${signed(x.value)}`).join('、')}`,
    d.sr&&d.canSmite?`${smiteNames[s.template]} ${s.smite?'已启用':'未启用'}（${signed(d.smiteAttack)}命中／+${d.smiteDamage}伤害）`:'',
    d.specials.length?`特殊能力 ${d.specials.map(x=>`${x.name} DC${x.calculatedDC}：${x.text}`).join('；')}`:'',
    m.spells?.length?`类法术能力 ${m.spells.map(x=>x.join('：')).join('；')}`:'',
    `其他 ${m.traits.join('；')}`,
    m.languages?`语言 ${m.languages}`:'',
    `规则来源：${m.source}`,
  ].filter(Boolean).join('\n');
}
