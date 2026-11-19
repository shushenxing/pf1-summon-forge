# PF1 召唤工坊 / Summon Forge

这是一个完全静态的《Pathfinder 第一版》（PF1）召唤生物面板工具。选择召唤生物、增强召唤、召唤善良怪物、模板与战斗加值，网页会计算攻击、伤害、防御、技能和特殊能力。无须服务器、数据库、ChatGPT 账号或 API Key。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `index.html` | 网页结构和输入控件 |
| `styles.css` | 外观和手机适配 |
| `monsters.js` | 内置的生物原始数据 |
| `engine.js` | 模板、专长和战斗数值计算 |
| `app.js` | UI 交互、保存预设、复制/下载面板 |

所有 JS 都是浏览器原生 ES Modules，文件使用相对路径，能直接放在 GitHub Pages 的仓库子路径下运行。建议用本地静态服务器预览，而不是双击 `index.html` 打开 `file://` 地址。若电脑上有 Python，可以在解压目录运行 `python -m http.server 8000`，然后访问 `http://localhost:8000/`。

## 模板的规则说明

- 在召唤者阵营中选 **守序善良（LG）**，在生物模板中就可以直接选择 **天界模板** 或 **绝对模板**；两个模板不能叠加。其他守序阵营也可以选择绝对模板。
- 按 [PF1 官方怪物进阶规则](https://www.legacy.aonprd.com/bestiary/monsterAdvancement.html) 实现：黑暗视觉 60 尺、强酸/寒冷/火焰抗力、基于 HD 的 DR（混乱）及 SR，**惩击混乱** 1/日（迅捷动作指定混乱目标，魅力正调整值加命中、HD 加伤害）。HD 达 5 才增加 CR。
- 本工具采用包含四种阵营模板的[扩展版《召唤怪物》列表](https://www.d20pfsrd.com/magic/all-spells/s/summon-monster)：守序者可用绝对模板、善良者可用天界模板，因此守序善良者可以二选一。这与[最初《核心规则书》的法术文本](https://www.legacy.aonprd.com/coreRulebook/spells/summonMonster.html)有版本差异：旧版只明确列天界／炼狱模板。请让采用旧版列表的玩家留意，不影响本工具按扩展表直接选择绝对模板。
- “召唤善良怪物”特殊列表赋予的顽强（Diehard）不自动适用于绝对模板的普通列表生物。网页会自动避免这种叠加。
- 惩击效果只适用于合法目标，需按团内具体战况勾选“启用”。

目前是小范围可用版本，仅包含网页“召唤怪物 I / II”中的部分生物及部分专长和战斗因素，并非完整 PF1 怪物数据库；请与 GM 一起校对面板。

## 公开发布请阅读

这是非官方、免费、非商业的同人辅助工具。网页内已经包含 [Paizo Community Use Policy](https://paizo.com/licenses/communityuse) 要求的基本非官方声明。但该政策还要求**在项目中公开提供最新的作者联系方式**，以及保留所使用 Paizo 素材的相应版权/商标与作者署名。
联系邮箱：3276677065@qq.com
