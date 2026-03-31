# 亚面知识库本地正式版

这是一套面向客户演示与内部评审的本地静态站。

## 特点

- 不改动现有知识库 Markdown 正文
- 首页以 `品牌 / 共创` 为两条主轴
- `产品` 作为品牌主线里的快捷入口
- 支持搜索、左侧目录、正文内跳转、源 Markdown 打开
- 默认隐藏 `90_内部源档`，开启“内部模式”后才显示
- 从现有 `pptx` 中抽取安全素材做视觉壳

## 使用方式

1. 双击 `打开正式版预览.cmd`
2. 如需重新同步知识库内容，双击 `重建正式版预览.cmd`

## 构建说明

- 内容源：上一级目录中的知识库 Markdown
- 生成物：
  - `site-data.js`
  - `asset-manifest.js`
  - `asset-manifest.json`
  - `assets/extracted/*`

## 目录说明

- `build.mjs`：构建脚本
- `index.html`：网站入口
- `app.js`：前端交互与路由
- `styles.css`：视觉样式
