# Personal Portfolio Website — Project Context

> 每次修改网页时调用此文档作为参考。最后更新：2026-05-22

## 项目概览

- **路径**: `d:\ai PROJECT\First-cc\个人网页\`
- **GitHub**: `https://github.com/jimmyYTGH/Jimmy` (branch: `portfolio-v1`)
- **开发服务器**: `npm run dev` → `http://localhost:5173/`
- **构建**: `npm run build` (输出到 `dist/`)

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^19 | UI 框架 |
| TypeScript | ~6 | 类型安全 |
| Vite | ^8 | 构建工具 |
| Tailwind CSS | ^4 | 原子化 CSS（Vite 原生插件 `@tailwindcss/vite`） |
| Framer Motion | ^12 | 动画（入场、滚动、弹簧物理） |
| Lucide React | ^1.16 | 通用图标（Mail, Send, Menu, Chevron 等） |

**注意**: Lucide React v1.16+ 已移除品牌图标（Github, Linkedin, Twitter）。品牌图标在 `src/components/Icons.tsx` 中用内联 SVG 实现。

## 版本历史

| 标签 | 说明 | 回退命令 |
|------|------|---------|
| `v1.0.0` | 初始赛博朋克脚手架 | `git checkout v1.0.0` |
| `v2.0.0` | 增强光标 + 流动背景 + 有机设计 | `git checkout v2.0.0` |

## 文件结构

```
src/
├── main.tsx                    # React 入口
├── App.tsx                     # 根组件（7 section + GridOverlay + CustomCursor）
├── index.css                   # Tailwind v4 @theme + 流动背景动画 + 全局样式
├── components/
│   ├── CustomCursor.tsx        # 白点 + 渐变小球（弹簧物理）
│   ├── SectionWrapper.tsx      # 滚动驱动的 section 淡入/淡出
│   ├── Header.tsx              # 固定导航（流光 LOGO + 毛玻璃）
│   ├── Hero.tsx                # 首页（浮动光球 + 流光标题）
│   ├── About.tsx               # 个人介绍 + 时间线卡片
│   ├── Skills.tsx              # 技能进度条（按分类 + 霓虹发光）
│   ├── Projects.tsx            # 项目卡片（悬停上浮 + 渐变光球）
│   ├── Contact.tsx             # 联系表单 + 社交链接
│   ├── Footer.tsx              # 版权 + 社交图标
│   └── Icons.tsx               # GitHub/LinkedIn/X 内联 SVG 图标
└── data/
    ├── projects.ts             # 项目数据（Project[]）
    └── skills.ts               # 技能数据（Skill[]，含 category 和 level）
```

## 设计规范

### 配色方案

| 颜色 | 十六进制 | 用途 |
|------|---------|------|
| 主背景 | `#020617` | 页面底色 |
| 卡片背景 | `rgba(255,255,255,0.02-0.03)` | 半透明卡片 |
| 主文字 | `#ffffff` / `#e2e8f0` | 标题/正文 |
| 次要文字 | `#94a3b8` / `#b0bec5` | 描述文字 |
| 占位文字 | `#64748b` | 表单 placeholder |
| 主霓虹色 | `#00f0ff` | 青（链接、高亮、按钮） |
| 次霓虹色 | `#a855f7` | 紫（装饰、次要元素） |
| 边框 | `rgba(255,255,255,0.04-0.06)` | 卡片/输入框边框 |

### 字体

- **标题**: Space Grotesk (400/500/600/700) — 通过 `font-heading` 使用
- **正文**: Inter (300/400/500/600) — 通过 `font-body` 使用
- **等宽**: 系统 monospace — 用于小标签（ABOUT, SKILLS 等）

### CSS 架构

- Tailwind v4 使用 `@import "tailwindcss"` + `@theme {}` 配置自定义令牌
- **无 `tailwind.config.js`** — v4 配置全部在 CSS 中
- 流动背景: `body::before` 伪元素 + `@keyframes gradientFlow` (18s 循环)
- 浮动光球: `body::after` 伪元素 + `@keyframes orbsFloat` (20s 循环)
- 网格覆盖: `.grid-overlay` div（带 `mask-image` 径向渐变遮罩）
- 原生鼠标隐藏: `* { cursor: none !important }`

## 自定义光标

### 结构（CustomCursor.tsx）
- **白点** (`.size-[6px]`): 6px 纯白圆，`z-[9999]`，弹簧系数 0.45（快速吸附）
- **渐变球** (`size-6`): 24px 渐变圆，`z-[9998]`，弹簧系数 0.055（慢速滞后）
- 使用 `requestAnimationFrame` 循环，模块级变量避免 React 重渲染

### 交互行为
- **默认**: 球为紫→青径向渐变，轻微模糊
- **悬停可交互元素** (`a, button, input, textarea, select, [role=button], [tabindex]`):
  - 球放大至 2.4 倍
  - 背景切换为青色主导
  - 添加 `box-shadow: 0 0 35px rgba(0,240,255,0.5)`
  - 缩放使用弹簧插值 `ballScale += (targetScale - ballScale) * 0.1`

### 事件监听
- `mousemove` (passive) — 更新目标位置
- `mouseover` / `mouseout` (passive) — 检测可交互元素（用 `closest()` 委托）

## 滚动动效

### SectionWrapper
- 使用 Framer Motion `useInView` + `margin: "-30% 0px -30% 0px"`
- Section 离开视口中心区域 → `opacity: 0.15, blur(4px), scale: 0.97`
- Section 进入视口中心区域 → `opacity: 1, blur(0), scale: 1`
- `transition: 0.6s easeInOut`

### 内部元素动效
- Framer Motion `whileInView` + `viewport: { once: true }`
- 进度条动画: `width` 从 0 到目标值，`easeOut` 缓动
- 卡片入场: `y: 40 → 0`，stagger delay

## 关键设计决策

1. **无路由**: 单页应用，锚点导航（`#hero`, `#about`, `#skills`, `#projects`, `#contact`）
2. **无状态管理库**: 数据量小，用 TypeScript 静态数据文件（`src/data/`）
3. **品牌图标自绘**: Lucide 移除了品牌图标，在 `Icons.tsx` 中用内联 SVG
4. **Tailwind v4 Vite 插件**: 比 PostCSS 方式性能更好，配置更简洁
5. **模块级 rAF 状态**: CustomCursor 的状态变量放在模块作用域避免闭包陷阱
6. **伪元素背景**: `body::before` (流动渐变) + `body::after` (光球) + `.grid-overlay` div (网格)
7. **Git 策略**: 本地 master → 远程 portfolio-v1 分支，每个大版本打 annotated tag

## 已知问题 / 注意事项

- Windows CRLF 警告: Git 会自动转换，不影响功能
- `gh` CLI 安装失败: 使用 `git` 命令行直接推送
- 图片文件 `33a1bd1e0e1207fcd8e069747fea7c2c.png` 及 `AGENTS 2.0` 已包含在仓库中
- 自定义光标在 iframe 或某些浏览器安全限制下可能不显示

## 常用命令

```bash
# 开发
cd "d:\ai PROJECT\First-cc\个人网页"
npm run dev

# 构建
npm run build

# 预览生产构建
npm run preview

# Git (需要先刷新 PATH)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 回退到旧版本
git checkout v1.0.0

# 推送更新
git add -A
git commit -m "..."
git tag -a vX.Y.Z -m "..."
git push origin master:portfolio-v1 --tags
```
