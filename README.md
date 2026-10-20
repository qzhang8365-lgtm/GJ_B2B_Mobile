# 国金 B 端设计 Skill（移动端）

面向国金内部员工使用的 B 端移动产品（H5 / 小程序）的设计系统 Skill。它把 Figma 移动端规范中的 Token、组件、页面模式，以及设计审查沉淀下来的页面生成规则整理成 AI 可读取的资料，用于生成高保真原型、检查已有页面和辅助组件选型。

- 设计源：[【移动端】新版 B 端设计规范（Figma）](https://www.figma.com/design/KCpwE2Lh1yCGQ86y8ckYFN)
- 设计基准：375 × 812 逻辑画板，按屏宽换算 rem 适配，320–359 宽度单独兜底
- 不适用：PC 端页面、面向消费者的产品、推断真实前端组件库 API

## 快速开始

1. 解压发布包，保持目录结构不变。
2. 把整个目录放到 AI 工具或工作区可读取的位置；支持自定义 Skill 的工具直接挂载该目录。
3. 让 AI 从 `SKILL.md` 开始读取，例如：

   ```text
   先读取「[本目录]/SKILL.md」，为内部员工生成「[页面名称]」移动端原型，运行在[小程序原生 / H5 / web-view]。
   角色是[角色]，核心任务是[任务]，业务数据是[数据]。不清楚的业务信息标记待确认。
   ```

4. 交付前在 375、320、768 宽度实际运行并触发交互，按 `SKILL.md`「生成后自检」核对。

更多 Prompt 示例与验收清单见规范站「使用指南」。

## 目录结构

```text
国金B端设计skill（移动端）/
├── SKILL.md                 入口：适用范围、读取顺序、生成流程与生成后自检
├── README.md                本文件
├── references/              AI 读取的设计依据
│   ├── page-rules.md        页面生成规则（PR-xxx），选组件、定尺寸前先查
│   ├── patterns/            7 种页面模式（index.json + 各模式 .md）
│   ├── components/          48 个组件：inventory.json + 每个组件的 rules / schema / mapping / audit
│   ├── tokens/              颜色、字体、间距、圆角、效果 Token 与调用约定
│   ├── icons/               图标索引与 manifest
│   └── h5-*.md              H5 尺寸适配、控件尺寸、卡片圆角、小屏兜底
├── assets/                  原型资源
│   ├── styles/              Token CSS 与 gj-m-* 组件基座
│   ├── icons/               通用图标、毛玻璃 PNG、文件图标、动效
│   ├── images/              空状态插图、Logo、示例图
│   └── fonts/               数字字体 GJType
├── preview/                 人工浏览与验收的规范站
├── planning/e2e/            只依据 Skill 生成的端到端示例页面与缺口记录（仓库与规范网站上，不进发布包）
└── scripts/                 构建、校验与打包脚本
```

## 查看规范站

直接双击打开 `preview/index.html` 即可（`file://` 下数据与图标都能正常显示）；也可以在本目录下起静态服务：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/preview/
```

预览站不用 fetch 读文件：页面数据通过 `<script>` 引入 `preview/_data/*.js`，由 `python3 scripts/build-preview-data.py` 从 `references/` 的 JSON 与基座 CSS 生成。改了 Token、分割线 source、基座 / 控制面板 CSS 里的图标或动效 JSON 后要重跑；`--check` 校验一致性并禁止预览站出现 fetch / XHR，发布脚本会自动执行。

端到端示例：`http://localhost:8000/planning/e2e/index.html`（只在仓库里，发布包不带）。

## 内容概览

| 类别 | 内容 |
| --- | --- |
| 基础规范 | 语义颜色与色板、文字样式、九档间距与语义间距、圆角、阴影与渐变 |
| 组件 | 48 个，覆盖导航、数据展示、输入、反馈等；原型统一使用 `gj-m-*` 类 |
| 页面模式 | 工作台首页、列表 + 搜索 / 筛选、详情 + 底部操作、分组表单提交、日历 + 记录时间轴、批量处理列表、登录 |
| 页面生成规则 | 设计方逐页审查沉淀的规则，优先于单个组件规则 |

## 重要约定

- **页面生成规则优先**：生成或检查页面时先查 `references/page-rules.md`，再查组件 `rules.md`。
- **资源可追溯**：图标只用 `assets/icons/` 中登记的资源；未登记的组件不自造样式，标为待确认。
- **运行容器**：小程序原生页面由容器提供导航与输入行为；H5 / web-view 自绘导航，viewport 加 `maximum-scale=1`。
- **原型不是工程 API**：`gj-m-*` 基座与示意类名只用于原型，真实项目的组件、属性与事件以实际代码为准。
- **审计不上网页**：组件的待确认项与审计记录保存在各组件 `audit.md`，不在规范站展示。

## 维护

| 场景 | 命令 |
| --- | --- |
| 修改 Token 源数据后 | `python3 scripts/build-tokens.py` 和 `python3 scripts/validate-tokens.py` |
| 修改组件审计后 | `python3 scripts/sync-inventory.py`（更新 inventory 的待确认项） |
| 修改组件基座 CSS 后 | 同步修改 `preview/phone-stage.js` 中的样式版本号，避免浏览器使用旧样式 |
| 修改组件 mapping 的 templates 后 | `node scripts/build-markup.cjs`（用模板示例更新 markup，打包 `assets/scripts/gj-m-templates.js`） |
| 修改组件基座、mapping、预览页或 kit.js 后 | `node scripts/check-mapping.cjs`（mapping 片段可渲染、类名存在于基座；预览页与示例用到的写法都已收录进 mapping） |
| 页面验收 | `node scripts/verify-page.cjs <页面> --container h5`（判定见 `references/generation-verification.md`） |
| 发布新版本 | 见下方「发布」 |

新的设计审查意见：先修改页面，再判断是否适用于同类场景，适用的写入 `page-rules.md`（新编号，写明场景、做法、原因、避免与来源），并同步组件规则与基座。

## 发布

与 PC 端一致：仓库 [qzhang8365-lgtm/GJ_B2B_Mobile](https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile) 存放规范网站与 Skill 源文件；发布包手动上传为 GitHub Release 附件；规范网站总览页的「下载 Skill 包」链到 Release 附件地址。

1. 改 `package.json` 的 `version`，在下方「版本」表加一行。
2. `python3 scripts/build-release.py <版本>`：校验后在 `dist/` 生成 `gj-b2b-mobile-design-skill-v<版本>.zip` 与 `release.json`，同时更新 `preview/_data/release.js`（总览页的下载地址、文件数与体积）。
3. 提交并推送（`dist/` 不进仓库）。
4. GitHub 上新建 Release，标签 `v<版本>`，上传 `dist/` 里的 zip。附件名必须与 `release.json` 的 `file` 一致，下载地址为 `https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile/releases/download/v<版本>/<file>`。
5. 规范网站从仓库部署（根目录 `_redirects` 把首页指到 `preview/index.html`）。

发布包内容：SKILL.md、README.md、references、assets、preview、scripts；不带端到端示例与过程文档（`planning/`）、截图与核对记录。包内规范站的「页面模式」页会隐藏端到端示例区块并说明去处。

## 版本

| 版本 | 日期 | 说明 |
| --- | --- | --- |
| v1.0.0 | 2026-10-20 | 首个发布包：48 个组件、7 个页面模式、页面生成规则 PR-001～PR-034、规范站；端到端示例只在仓库与规范网站。 |
