# 图标维护续作验收 · 2026-10-27

本轮继续原任务，仅执行本地修改、生成与验证；本轮没有执行 Git 提交、Push、Release 或网站发布命令。工作区中其他来源产生的新提交和资源记录均保留。

## 实际修改和生成

- 两端Icon页以唯一manifest和字体映射展示382枚普通图标，line240、fill142、13分类；class直接取映射，禁止按名称推断风格。
- 更新分类、名称/关键词/Unicode/CSS类名/历史别名搜索；详情显示style、Unicode和CSS类。复制优先Clipboard API，保留file/iframe选择复制降级。
- SVG下载直接使用最新源码缓存；普通图标新增可用PNG导出，最低96×96。下载文件经过实际浏览器操作取得并校验，不只检查提示文字。
- 同步117份System派生审计镜像（115项System、2项最终归File），保持已有路径、名称、别名，不叠加到普通图标总量。镜像明确不作为独立选图入口或未经核实的新Figma源。
- 最新line导出中 `icf_file_file-zip-1-line.svg` 按现有canonical名 `icf_file_file-zip-line-1.svg` 交付；带锁文件夹同理更新。仅将最新导出1024画布适配为24画布、解析已有颜色，不修改字体、Unicode或CSS类。修复两份旧SVG填实效果与新字体不一致的问题；复制缓存、下载内容和两端SVG均同步。
- 重建catalog、SVG源码缓存、旧副本与移动端 `preview/_data/icon-rules.js`；字体URL使用内容hash，两端Icon页及导航入口更新缓存版本。
- 重建移动端8个已有E2E内嵌块，PC导入工作台和视频预览内嵌块；均通过各端embed-icons --check。
- 图标索引、USAGE与审计中维护权威入口，维护脚本在移动端library-index登记；同步脚本按manifest和map计数验证，后续不需另改一份固定总数。

## 浏览器实际验证

使用Codex内置浏览器通过本地HTTP运行两端真实Icon页，不发布网站。全量字体审计页加载同一真实Icon页，读取已加载字体和DOM；对每枚绘制字形检查是否为空、实际CSS码位是否与对应字体命名空间一致。

| 检查 | 移动端 | PC |
| --- | --- | --- |
| 普通图标总数 | 382 | 382 |
| Line/Fill筛选 | 240/142 | 240/142 |
| Media分类筛选 | 23 | 23 |
| volume搜索 | 4项 | 4项 |
| 静音搜索 | 2项 | 2项 |
| 旧delete_back-fill别名 | 正确解析1项 | 正确解析1项 |
| U+F080搜索 | 返回各命名空间合法的2项 | 同左 |
| CSS类名检索 | 正确1项 | 正确1项 |
| 已加载line/fill WOFF2 | loaded，HTTP200 | loaded，HTTP200 |
| 空字形/错码 | 0/0（逐枚382项） | 0/0（逐枚382项） |
| 失败资源/控制台错误 | 0/0 | 0/0 |
| F080详情和复制 | 正确，复制与源SVG逐字一致 | 同左 |
| 实际SVG/PNG下载 | 新版zip-line-1，SVG与源逐字一致，PNG96×96 | zip-fill-1，SVG与源逐字一致，PNG96×96 |

压缩文件空心与拉链、音量与静音、带锁文件夹已做字体与SVG并排视觉核对。修复后的最新zip-line-1复制内容和实际下载文件又逐字比对一次，均一致。

浏览器全量数据见 `mobile-font-results.json` / `pc-font-results.json`；交互见 `interaction-results.json`，下载见 `download-results.json`，截图见 `font-svg-focus.png` / `mobile-volume.png` / `pc-volume.png`。GJTypeDisplay/GJType在此页面未被实际使用而为unloaded，不属于图标字体加载失败。

## 本地校验

- `sync-icon-resources.py --check`（移动端及 --root PC）：通过。
- `build-preview-data.py --check`、移动端 `validate-tokens.py`：通过。
- PC `validate-tokens.mjs`、`build-coverage.mjs --check`：通过。
- 移动端 `build-markup.cjs --check`：59模板一致。
- 两端Icon页内联JS与同步脚本语法：通过。
- 8种字体文件（line/fill × ttf/otf/woff/woff2）内名及全部Unicode覆盖：通过。
- 两端全部SVG及8种字体文件字节一致；382项既有mapping字段逐一保持；alias表完整。
- F080 SVG与已有版本字节一致；各字体格式与相同旧格式比较，F080轮廓及COLR层逐条绘图命令一致。
- 382份复制/下载缓存与canonical SVG逐字一致。

## 来源状态差异（待确认）

本轮原始要求为“F080来源仍待定位”，本轮据此仅核验兼容资源保留，没有自行关闭来源问题。续作中检测到并行维护已在SKILL、system-audit与原REPORT写入Figma节点 `5396:3700` 并标记ICO-008关闭；本轮没有重新读取该节点，也没有覆盖这一并行结论。需维护方确认该来源记录是否已完成设计方确认，再统一最终来源状态。

ICO-006、ICO-007保持已关闭，本轮没有重开。除上述F080来源状态差异外，当前图标展示、搜索、复制、下载、码位和字体加载没有未解决问题。
