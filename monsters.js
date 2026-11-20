// PF1 Bestiary source data. Base stat blocks are kept separate from modifiers.
// "good" means the creature is on the Summon Good Monster special list.
export const monsters = [
  {
    id:'eagle', name:'鹰', en:'Eagle', tier:1, lists:['standard','good'], templateEligible:true,
    cr:'1/2', size:'小型', type:'动物', alignment:'N', hd:1, die:8, hp:5,
    ability:[10,15,12,2,15,7], init:2, ac:[14,13,12], saves:[3,4,2], bab:0, cmb:-1, cmd:11,
    speed:'陆行 10尺；飞行 80尺（一般）', senses:'昏暗视觉', feats:['武器娴熟'],
    attacks:[{name:'爪抓',count:2,bonus:3,dice:'1d4',damage:0,attackAbility:'finesse',scale:1},{name:'啮咬',count:1,bonus:3,dice:'1d4',damage:0,attackAbility:'finesse',scale:1}],
    skills:[['飞行',8],['察觉',10]], traits:['察觉获得+8种族加值'],
    source:'https://legacy.aonprd.com/bestiary/eagle.html', tip:'鹰具有三次天生武器攻击，可配合激励勇气；三次攻击都不会因增强召唤提高命中（武器娴熟使用敏捷），伤害则会提高。'
  },
  {
    id:'dog', name:'狗', en:'Dog', tier:1, lists:['standard','good'], templateEligible:true,
    cr:'1/3', size:'小型', type:'动物', alignment:'N', hd:1, die:8, hp:6,
    ability:[13,13,15,2,12,6], init:1, ac:[13,12,12], saves:[4,3,1], bab:0, cmb:0, cmd:11, cmdTrip:15,
    speed:'陆行 40尺', senses:'昏暗视觉；灵敏嗅觉', feats:['技能专攻（察觉）'],
    attacks:[{name:'啮咬',count:1,bonus:2,dice:'1d4',damage:1,attackAbility:'str',scale:1.5}],
    skills:[['特技',1],['察觉',8],['生存',1]], traits:['跳跃特技+8（原始面板）','循味追踪生存+4'],
    source:'https://legacy.aonprd.com/bestiary/dog.html', tip:'只有一个天生武器，增加的力量伤害按1.5倍计算。'
  },
  {
    id:'wolf', name:'狼', en:'Wolf', tier:2, lists:['standard','good'], templateEligible:true,
    cr:'1', size:'中型', type:'动物', alignment:'N', hd:2, die:8, hp:13,
    ability:[13,15,15,2,12,6], init:2, ac:[14,12,12], saves:[5,5,1], bab:1, cmb:2, cmd:14, cmdTrip:18,
    speed:'陆行 50尺', senses:'昏暗视觉；灵敏嗅觉', feats:['技能专攻（察觉）'],
    attacks:[{name:'啮咬',count:1,bonus:2,dice:'1d6',damage:1,attackAbility:'str',scale:1.5,note:'附带摔绊'}],
    skills:[['察觉',8],['隐匿',6],['生存',1]], traits:['循味追踪生存+4'],
    source:'https://legacy.aonprd.com/bestiary/wolf.html', tip:'啮咬命中后可以尝试摔绊；只有一种天生武器，力量加值按1.5倍计入伤害。'
  },
  {
    id:'hyena', name:'鬣狗', en:'Hyena', tier:2, lists:['standard'], templateEligible:true,
    cr:'1', size:'中型', type:'动物', alignment:'N', hd:2, die:8, hp:13,
    ability:[14,15,15,2,13,6], init:2, ac:[14,12,12], saves:[5,5,1], bab:1, cmb:3, cmd:15, cmdTrip:19,
    speed:'陆行 50尺', senses:'昏暗视觉；灵敏嗅觉', feats:['技能专攻（察觉）'],
    attacks:[{name:'啮咬',count:1,bonus:3,dice:'1d6',damage:3,attackAbility:'str',scale:1.5,note:'附带摔绊'}],
    skills:[['察觉',8],['隐匿',6]], traits:['高草中隐匿额外+4'],
    source:'https://legacy.aonprd.com/bestiary/hyena.html', tip:'鬣狗的力量初始调整值为+2，比狼更高；同样擅长摔绊。'
  },
  {
    id:'goblin-dog', name:'地精犬', en:'Goblin Dog', tier:2, lists:['standard'], templateEligible:true,
    cr:'1', size:'中型', type:'动物', alignment:'N', hd:1, die:8, hp:9,
    ability:[15,14,15,2,12,8], init:2, ac:[13,12,11], saves:[4,4,1], bab:0, cmb:2, cmd:14,
    speed:'陆行 50尺', senses:'昏暗视觉；灵敏嗅觉', feats:['健壮'],
    attacks:[{name:'啮咬',count:1,bonus:2,dice:'1d6',damage:3,attackAbility:'str',scale:1.5,note:'附带过敏反应'}],
    skills:[['隐匿',6]], traits:['免疫疾病'],
    specials:[{name:'过敏反应',dc:12,dcAbility:'con',text:'非地精类目标因啮咬受伤、接触或徒手攻击它时进行强韧豁免；失败则敏捷、魅力各–2，持续1天。属于疾病效果。'}],
    source:'https://legacy.aonprd.com/bestiary/goblinDog.html', tip:'地精犬的过敏反应DC依赖体质，增强召唤会提高DC。'
  },
  {
    id:'earth', name:'小型土元素', en:'Small Earth Elemental', tier:2, lists:['standard'], templateEligible:false,
    cr:'1', size:'小型', type:'异界生物（元素）', alignment:'N', hd:2, die:10, hp:13,
    ability:[16,8,13,4,11,11], init:-1, ac:[17,10,17], saves:[4,-1,3], bab:2, cmb:4, cmd:13,
    speed:'陆行 20尺；掘穴 20尺；穿地', senses:'黑暗视觉60尺；震颤感知60尺', feats:['精通冲撞（奖励）','猛力攻击'],
    attacks:[{name:'挥击',count:1,bonus:6,dice:'1d6',damage:4,attackAbility:'str',scale:1.5}],
    skills:[['估价',1],['攀爬',7,'str'],['知识（地城）',1],['知识（位面）',1],['察觉',4],['隐匿',7]],
    traits:['元素特性免疫','穿地：能穿过泥土和岩石，不留下通道','大地掌控：双方着地时攻击与伤害+1；任一方离地/在水中时攻击与伤害–4'],
    mastery:'earth', source:'https://legacy.aonprd.com/bestiary/elemental.html', tip:'土元素的挥击仅一种天生攻击；它既有猛力攻击专长，也有根据地面接触情况变化的「大地掌控」。'
  },
  {
    id:'air', name:'小型气元素', en:'Small Air Elemental', tier:2, lists:['standard'], templateEligible:false,
    cr:'1', size:'小型', type:'异界生物（元素）', alignment:'N', hd:2, die:10, hp:13,
    ability:[12,17,12,4,11,11], init:7, ac:[17,14,14], saves:[4,6,0], bab:2, cmb:2, cmd:15,
    speed:'飞行 100尺（完美）', senses:'黑暗视觉60尺', feats:['飞掠攻击','精通先攻（奖励）','武器娴熟（奖励）'],
    attacks:[{name:'挥击',count:1,bonus:6,dice:'1d4',damage:1,attackAbility:'finesse',scale:1.5}],
    skills:[['特技',7],['脱逃',7],['飞行',17],['知识（位面）',1],['察觉',4],['隐匿',11]],
    specials:[{name:'旋风',dc:12,dcAbility:'str',text:'能化为旋风；豁免DC随力量调整值变化。'}],
    traits:['元素特性免疫','空气掌控：飞行目标攻击气元素时，攻击和伤害均–1'],
    source:'https://legacy.aonprd.com/bestiary/elemental.html', tip:'有武器娴熟，因此增强力量通常不提高挥击命中；飞掠攻击能在移动中间发动一次攻击。'
  },
  {
    id:'fire', name:'小型火元素', en:'Small Fire Elemental', tier:2, lists:['standard'], templateEligible:false,
    cr:'1', size:'小型', type:'异界生物（元素）', alignment:'N', hd:2, die:10, hp:11,
    ability:[10,13,10,4,11,11], init:5, ac:[16,13,14], saves:[3,4,0], bab:2, cmb:1, cmd:13,
    speed:'陆行 50尺', senses:'黑暗视觉60尺', feats:['闪避','精通先攻（奖励）','武器娴熟（奖励）'],
    attacks:[{name:'挥击',count:1,bonus:4,dice:'1d4',damage:0,attackAbility:'finesse',scale:1.5,note:'附带燃烧'}],
    skills:[['特技',5],['攀爬',4,'str'],['脱逃',5],['威吓',4],['知识（位面）',1],['察觉',4]],
    specials:[{name:'燃烧',dc:11,dcAbility:'con',text:'命中或接触时可能令目标起火；额外1d4火焰伤害。'}],
    traits:['元素特性免疫','免疫火焰','易受寒冷伤害'],
    source:'https://legacy.aonprd.com/bestiary/elemental.html', tip:'增强召唤提高燃烧DC。火元素获得力量+4后，力量调整值高于敏捷，因此武器娴熟可改用力量取得更高命中。'
  },
  {
    id:'water', name:'小型水元素', en:'Small Water Elemental', tier:2, lists:['standard'], templateEligible:false,
    cr:'1', size:'小型', type:'异界生物（元素）', alignment:'N', hd:2, die:10, hp:13,
    ability:[14,10,13,4,11,11], init:0, ac:[17,11,17], saves:[4,3,0], bab:2, cmb:3, cmd:13,
    speed:'陆行 20尺；游泳 90尺', senses:'黑暗视觉60尺', feats:['猛力攻击'],
    attacks:[{name:'挥击',count:1,bonus:5,dice:'1d6',damage:3,attackAbility:'str',scale:1.5}],
    skills:[['特技',4],['脱逃',4],['知识（位面）',1],['察觉',4],['隐匿',8],['游泳',14,'str']],
    specials:[{name:'漩涡',dc:13,dcAbility:'str',text:'在水下变成漩涡，其豁免DC依赖力量调整值。'}],
    traits:['元素特性免疫','浇灭：能熄灭通常火焰，触碰魔法火焰可如解除魔法生效','水流掌控：双方接触水时攻击/伤害+1；任一方着地时–4'],
    mastery:'water', source:'https://legacy.aonprd.com/bestiary/elemental.html', tip:'水战时更强；在岸上战斗别忘了水流掌控的–4惩罚。'
  },
  {
    id:'faun', name:'法翁', en:'Faun', tier:2, lists:['good'], templateEligible:false,
    cr:'1', size:'中型', type:'精类', alignment:'CG', hd:3, die:6, hp:13,
    ability:[14,16,13,11,14,17], init:3, ac:[16,13,13], saves:[2,6,5], bab:1, cmb:3, cmd:16,
    speed:'陆行 30尺', senses:'昏暗视觉', feats:['近程射击','武器娴熟'],
    attacks:[{name:'匕首',count:1,bonus:4,dice:'1d4',damage:2,attackAbility:'finesse',scale:1,crit:'/19–20'},{name:'短弓',count:1,bonus:4,dice:'1d6',damage:0,attackAbility:'dex',scale:0,ranged:true,crit:'/×3'}],
    skills:[['特技',8],['唬骗',9],['察觉',8],['表演（管乐）',11],['察言观色',7],['隐匿',9],['生存',4]],
    languages:'通用语、木族语', dr:'2/寒铁',
    spells:[['随意','幻音术（DC13）'],['每日1次','狂笑术（DC15）；睡眠术（DC14）']],
    traits:['排箫（Su）：每日3次，以迅捷动作使当回合下一次类法术能力DC+2','类法术能力CL3，施法者等级检定+6'],
    source:'https://legacy.aonprd.com/bestiary3/faun.html', tip:'召唤善良怪物使它获得顽强。睡眠术与狂笑术的DC由魅力决定，增强召唤不会提高它们。'
  },
  {
    id:'grig', name:'格利精', en:'Grig', tier:2, lists:['good'], templateEligible:false,
    cr:'1', size:'超小型', type:'精类', alignment:'NG', hd:1, die:6, hp:4,
    ability:[5,18,13,10,13,14], init:4, ac:[17,17,12], saves:[1,6,3], bab:0, cmb:2, cmd:10, cmdTrip:16,
    speed:'陆行 30尺；飞行 40尺（一般）', senses:'昏暗视觉', feats:['闪避'],
    attacks:[{name:'短剑',count:1,bonus:-1,dice:'1d3',damage:-3,attackAbility:'str',scale:1,crit:'/19–20'},{name:'长弓',count:1,bonus:6,dice:'1d4',damage:-3,attackAbility:'dex',scale:1,ranged:true,crit:'/×3'}],
    skills:[['特技',8],['脱逃',8],['飞行',12],['察觉',5],['表演（弦乐）',6],['隐匿',16]],
    languages:'通用语、木族语', dr:'5/寒铁', sr:16,
    spells:[['每日3次','易容术；纠缠术（DC13）；隐形术（仅自身）；焰火术（DC14）']],
    traits:['根据召唤善良怪物规定：不可使用提琴能力','类法术能力CL9，施法者等级检定+11'],
    source:'https://legacy.aonprd.com/bestiary2/grig.html', tip:'通过召唤善良怪物召唤时，提琴能力禁用；但隐形术、纠缠术等类法术能力可用。'
  },
  {
    id:'pseudodragon', name:'伪龙', en:'Pseudodragon', tier:2, lists:['good'], templateEligible:false,
    cr:'1', size:'超小型', type:'龙类', alignment:'NG', hd:2, die:12, hp:15,
    ability:[7,15,13,10,12,10], init:2, ac:[16,14,14], saves:[4,5,4], bab:2, cmb:2, cmd:10, cmdTrip:14,
    speed:'陆行 15尺；飞行 60尺（良好）', senses:'盲感60尺；黑暗视觉60尺；昏暗视觉', feats:['武器娴熟'],
    attacks:[{name:'尾刺',count:1,bonus:6,dice:'1d3',damage:-2,attackAbility:'finesse',scale:1,note:'附带毒素；触及5尺'},{name:'啮咬',count:1,bonus:6,dice:'1d2',damage:-2,attackAbility:'finesse',scale:1}],
    skills:[['交涉',5],['飞行',15],['察觉',6],['察言观色',6],['隐匿',19],['生存',6]],
    languages:'龙语；心灵感应60尺', sr:12, immunity:['麻痹','睡眠'],
    specials:[{name:'毒素',dc:14,dcAbility:'con',text:'尾刺伤害附带毒素；强韧豁免，频率每分钟1次，持续10分钟；失败昏睡1分钟，1次成功豁免解毒（含+2种族DC）。'}],
    traits:['飞行良好；超小型，普通触及0尺（尾刺触及5尺）'],
    source:'https://legacy.aonprd.com/bestiary/pseudodragon.html', tip:'增强召唤会提高毒素DC、生命值、伤害与强韧，但武器娴熟的命中仍使用敏捷。'
  }
];

export const byId = Object.fromEntries(monsters.map(m=>[m.id,m]));
