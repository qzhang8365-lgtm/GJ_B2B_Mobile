# 移动端 Skill 升级自检验收

2026-10-22。实现和测试完成；没有改版本、生产打包、Push 或创建/修改 Release。

## 来源与发布规则

- 实际 origin：`https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile.git`。
- latest：`https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile/releases/latest`，真实 HEAD 返回 `v1.0.0`。
- Tag：`vX.Y.Z`，包：`gj-b2b-mobile-design-skill-vX.Y.Z.zip`，顶层目录同名去后缀。
- 下载：`https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile/releases/download/vX.Y.Z/gj-b2b-mobile-design-skill-vX.Y.Z.zip`。
- 本地唯一版本源是根目录 package.json。已调整 build-release.py 收录它，并在打包前检查参数版本一致性。

## 实测方式与边界

`test-update.py` 在临时 skills 目录运行生产脚本，使用 macOS `/bin/bash` 3.2.57、真实 curl、unzip、ZIP 与目录移动。本地 HTTP 服务模拟 Release latest 与附件；PATH 包装只改传输目标或注入错误，不修改更新脚本。备份实际写入当前用户 `~/.cache/gj-b2b-mobile-design-skill/`，测试后只清理本次创建的备份。HOME 未改写，开发仓库与现有安装未被替换。

另已通过真实网络确认 Latest 并下载其 ZIP（1050 文件）。该线上附件既无 package.json，也无更新器；用原始下载字节测试时被正确拒绝覆盖。**旧版本成功升级测试通过的是合规 fixture latest，不是线上旧附件。真实线上成功升级需首个合规 Release 发布后再验，当前无法诚实标为通过。**

## 场景结果

| 场景 | 结果 |
| --- | --- |
| 0.9.0 → 合规测试 latest 1.0.0 | 通过：整目录替换，旧文件删除 |
| 已是 latest | 通过，退出0 |
| 12小时重复检查 | 通过，无网络请求 |
| --force | 通过，忽略时间戳 |
| --check-only | 通过，只写检查时间，不下载/替换 |
| 断网/DNS失败 | 通过，立即放行；实际curl不可用代理测试也通过 |
| .git目录或worktree文件 | 通过，网络请求前跳过、不写时间戳 |
| ZIP版本不等于Tag | 通过，保留旧目录 |
| node_modules | 通过，内容完整保留 |
| 缓存备份 | 通过，位于 ~/.cache，不在skills旁 |
| 下载失败 | 通过，保留旧版、退出0 |
| 安装目录不可写 | 通过，提示并退出0 |
| 最终安装rename失败 | 通过，回滚旧目录及依赖 |
| 当前真实v1.0.0附件 | 正确拒绝：缺package.json及更新器 |

逐项耗时、输出和生产脚本SHA256见 results.json。网络探测限时5秒，下载限时60秒；失败也受12小时检查间隔约束。只有成功安装才输出“已更新到”；其它已发现新版本的失败统一输出“发现新版本但未自动升级”。

## 校验

- `python3 scripts/validate-tokens.py`：通过。
- `python3 scripts/sync-inventory.py`：首次同步5项pageRules，第二次无变化；不改审计结论或previewVerified。
- `node scripts/build-markup.cjs --check`：59个模板一致。
- 全部 scripts/*.py AST、scripts/*.cjs 的 node --check、更新器 bash -n：通过。
- skill-creator `quick_validate.py`：通过；PyYAML仅安装到临时目录供校验使用。
- library-index更新器登记、预打包文件列表包含package.json和更新器、排除.git/node_modules/.update-check：通过（只枚举，未打生产包）。
- 未发现现有脚本白名单需额外登记。
- 额外逐目录结构核对发现既有keyboard/schema.json、markdown/schema.json缺失，未补造规范。icon按独立icons索引登记，无组件目录属既有结构。
- 额外尝试check-mapping浏览器校验时，本地监听被环境拒绝，未将其计为通过；本次未改组件渲染实现。

## 下次发布（须用户确认）

1. 确认新版本X.Y.Z，更新package.json；如维护package-lock，同步根版本；本次仍1.0.0。
2. 运行Token、覆盖、脚本/Skill结构及既有发布校验。
3. `python3 scripts/build-release.py X.Y.Z`；核验ZIP内package.json版本、SKILL.md及scripts/check-update.sh，排除安装依赖、时间戳和.git。
4. 经确认提交/Push，创建Tag `vX.Y.Z` 的移动端Release，上传对应ZIP并设为Latest；同步规范站下载元数据。
5. 首次采用此能力的旧包用户手动安装一次新版（旧包没有更新器）；之后在临时安装目录用 `--force` 复验真实远程升级。
