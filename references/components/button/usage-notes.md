# 按钮组合使用
来源：移动端 Figma 312:2295；只读提取的说明见 usage-source.json。

- 常规横向、纵向组合间距 8；大按钮 12；小按钮 4，可按场景调整。实现分别使用 --space-btn-gap、--space-btn-gap-footer、--space-4。
- 通栏按钮依据页面边距撑满所在容器。
- 案例一以 Primary 表选中，Ghost 表未选中。
- 案例二以 Secondary-pressed 表选中，Tertiary 表未选中。这里 pressed 视觉被规范明确用于选中呈现，不将所有按钮按下状态自动解释为持久选中。
- 网页展示为组合示意，不代表已提取筛选器、弹窗或业务页面组件。

## 来源待同步
规范页开头称小按钮为 32，与当前 Small 母版 28 存在冲突；继续使用已提取母版 28，不据旧说明改写控件 Token。
读取案例实例 componentProperties 时工具报告组件集存在错误，本次核对范围为规范文字与截图，未确认每个业务实例的完整属性绑定。

## 案例细节（2026-10-09 补充，Figma 312:2295 实例属性）
- 按钮组合：Medium Primary + Secondary 间距 8；多行排列为 Medium Tertiary，横纵间距 8；Large 两个按钮间距 12；Small Tertiary 间距 4。
- 通栏按钮：弹窗单按钮为 Large Primary 撑满；弹窗双按钮为 Large Secondary（取消）+ Primary（确认），间距 12 等分；底部面板双按钮竖排（Figma 312:3071，2026-10-09 更新）为 Large Secondary（取消）在上、Large Primary（确认）在下，左右边距 16（页面边距）、纵向间距 12，均撑满。
- 案例 1 的筛选行为 Small，行内间距 8（不是小按钮组合的 4）；横滑筛选使用 Small pill，右侧筛选图标 icf_system_filter。
- 案例 2 的“立即填写”选项卡片为两行文字的自定义框（圆角 8、内边距 12），选中态沿用 Secondary-pressed 外观、未选中沿用 Tertiary；多选项为 Medium，横纵间距 8。
