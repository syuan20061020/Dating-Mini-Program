# 约会邀请小应用 - 需求拆解文档

## 产品概述

- **产品类型**: 移动端 Web 应用（约会邀请互动工具）
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 情侣/暧昧期对象，用于发起约会邀请
- **核心价值**: 通过趣味互动（不可拒绝的按钮）引导对方接受约会邀请，并完成时间、餐食选择，最终生成约会卡片
- **界面语言**: 中文
- **主题偏好**: 粉色系可爱浪漫风格
- **导航模式**: 路径导航（5 页流程式跳转）
- **导航布局**: 无全局导航（页面内左上角返回按钮）

---

## 页面结构总览

> **说明**：此表为页面生成的唯一数据源，包含所有页面（一级+二级）

| 页面名称 | 文件名 | 路由 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 邀请页 | `InvitePage.tsx` | `/` | 一级 | 导航（首页） |
| 确认页 | `ConfirmPage.tsx` | `/confirm` | 二级 | 邀请页 → 点击"愿意"按钮 |
| 时间选择页 | `DateTimePage.tsx` | `/datetime` | 二级 | 确认页 → 点击"继续"按钮 |
| 餐食选择页 | `MenuPage.tsx` | `/menu` | 二级 | 时间选择页 → 点击"继续"按钮 |
| 约会卡片页 | `CardPage.tsx` | `/card` | 二级 | 餐食选择页 → 选中餐食后自动跳转 |

---

## 页面布局建议

- **邀请页布局模式**: 上下分区 —— 上方为插画+标题区域（视觉重心），下方为按钮交互区域（相对定位容器，核心交互区）
- **邀请页视觉重心**: 插画与标题 —— 吸引注意力，营造浪漫氛围
- **邀请页结果承载区**: 按钮区域为动态交互区，初始态为左右并排两个按钮；交互后"愿意"居中、"不要"逃逸至角落
- **确认页布局模式**: 单栏居中 —— Emoji + 文案 + 按钮垂直排列
- **时间选择页布局模式**: 单栏居中 —— 日期输入 + 时间输入 + 继续按钮
- **餐食选择页布局模式**: 上下分区 —— 上方标题提示，下方 3 列网格展示 9 个餐食卡片
- **约会卡片页布局模式**: 上下分区 —— 上方插画+摘要信息，下方保存按钮；Canvas 离屏渲染不可见

---

## 插件规划

无 AI/飞书插件需求。

---

## 导航配置

- **导航布局**: 无全局导航（页面内左上角返回按钮实现回退）
- **页面间跳转**: 使用路由跳转（`/` → `/confirm` → `/datetime` → `/menu` → `/card`），配合淡入淡出过渡动画
- **返回按钮**: 第二至第五页左上角统一放置返回按钮，点击返回上一页并保留已填写数据

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 9 种餐食选项列表 | demo-mock | `src/data/menu.ts` 常量数组，含 id/name/desc/emoji | ✅ 本身就是 mock |
| 日期默认值（明天） | demo-mock | 前端 `new Date()` 计算，`getDate()+1` | 无需 mock |
| 时间默认值（17:00） | demo-mock | 前端常量 `'17:00'` | 无需 mock |
| 用户选择的日期/时间/餐食 | local-persist | 跨页面通过路由 state 或全局状态传递，页面返回时保留 | 无 |
| Canvas 生成 PNG 图片 | import-export | Canvas 离屏渲染 1080×1440，`canvas.toBlob()` 导出，优先 `navigator.share()` 系统分享，否则触发下载 | 无 |
| "不要"按钮文案循环 | demo-mock | 前端数组 `['不要', '再想想嘛', '点不到我', '真的不要吗']` 循环 | ✅ 本身就是 mock |

---

## 功能列表

- **页面/区块**: 邀请页（首页）
  - **页面目标**: 展示约会邀请，通过趣味按钮交互引导用户点击"愿意"
  - **功能点**:
    - **插画与标题展示**: 展示粉色圆角方块爱心插画、虚线圆环、两颗闪光装饰；标题"可以和我一起约会吗？"，配俏皮副文案
    - **按钮区域初始化**: 宽 100%、最小高 210px、`position: relative` 的按钮容器；粉色"愿意"按钮与白色"不要"按钮围绕中心左右并排，间距均衡
    - **"愿意"按钮交互**: 点击后路由跳转至确认页（`/confirm`），带淡入淡出过渡动画
    - **"不要"按钮首次点击**: "愿意"按钮平滑移动（360ms 过渡）至容器正中心（`left:50%; top:50%; transform:translate(-50%,-50%)`），之后保持居中、`z-index` 最高、始终可点击；"不要"按钮改为 `position: absolute`，平滑移动至容器四角之一（动态计算坐标，预留 10px 内边距，不越界、不遮挡"愿意"）
    - **"不要"按钮后续点击**: 每次点击移动到与当前不同的角落（优先对角），循环替换文案（`['不要', '再想想嘛', '点不到我', '真的不要吗']`）；移动仅由鼠标/触摸 `click` 触发，禁止 `hover` 触发；动画 360ms，首次切换无跳位
    - **窗口缩放响应**: `resize` 事件监听，重新计算按钮区域边界和四角坐标，确保"不要"按钮不越界
    - **无障碍支持**: 按钮添加 `aria-label`，支持键盘 `Enter/Space` 触发，焦点样式可见

- **页面/区块**: 确认页
  - **页面目标**: 确认对方愿意约会，展示惊喜反馈
  - **功能点**:
    - **左上角返回按钮**: 点击返回邀请页，保留邀请页状态
    - **害羞 Emoji 展示**: 展示害羞表情（如 😊 或 🥰）
    - **惊喜确认文案**: 展示惊喜确认文案（如"太好啦！那我们定个时间吧~"）
    - **继续按钮**: 点击后路由跳转至时间选择页（`/datetime`），带淡入淡出过渡

- **页面/区块**: 时间选择页
  - **页面目标**: 选择约会日期和时间
  - **功能点**:
    - **左上角返回按钮**: 点击返回确认页，保留已选数据
    - **日期选择**: 日期输入控件，默认值为明天（`new Date()` + 1 天），`min` 属性限制不得早于今天
    - **时间选择**: 时间输入控件，默认值为 `17:00`
    - **继续按钮**: 点击后将日期和时间通过路由 state 传递至餐食选择页，跳转至 `/menu`

- **页面/区块**: 餐食选择页
  - **页面目标**: 从 9 种餐食中选择一项
  - **功能点**:
    - **左上角返回按钮**: 点击返回时间选择页，保留已选数据
    - **3 列网格展示**: 9 种餐食以 3 列网格布局展示，每项含名称、描述、Emoji
    - **选中交互**: 点击任一餐食卡片后，该卡片变粉色背景、显示勾选图标；同时自动将选中餐食数据通过路由 state 传递，跳转至约会卡片页（`/card`）
    - **键盘无障碍**: 餐食卡片支持 `Tab` 聚焦、`Enter/Space` 选中

- **页面/区块**: 约会卡片页
  - **页面目标**: 展示约会摘要并生成/保存卡片图片
  - **功能点**:
    - **左上角返回按钮**: 点击返回餐食选择页，保留已选数据
    - **爱心插画展示**: 展示爱心插画装饰
    - **约会摘要展示**: 展示 DATE（日期）、TIME（时间）、MENU（餐食名称+描述）
    - **保存按钮**: 黄色按钮，点击后使用 Canvas 离屏渲染生成 1080×1440 PNG 图片（含爱心插画、DATE/TIME/MENU 摘要信息）
    - **系统分享**: 优先调用 `navigator.share()` 分享 PNG 图片；若不支持则触发浏览器下载（`Blob` + `URL.createObjectURL` + `<a>` 点击下载）
    - **Canvas 渲染**: 离屏 `<canvas>` 元素，尺寸 1080×1440，绘制粉色系背景、爱心插画、约会摘要文字，导出为 PNG

---

## 数据共享配置

| 存储键名 | 数据说明 | 使用页面 |
|---------|---------|---------|
| `__global_date_appointment` | 约会信息，类型为 `IAppointment` | 时间选择页、餐食选择页、约会卡片页 |

```ts
interface IAppointment {
  /** 约会日期，格式 YYYY-MM-DD */
  date: string;
  /** 约会时间，格式 HH:mm */
  time: string;
  /** 选中餐食 */
  menu: {
    id: number;
    name: string;
    desc: string;
    emoji: string;
  } | null;
}
```

---

## 全局技术要求

- **页面过渡**: 所有页面切换使用淡入淡出动画（CSS transition/framer-motion）
- **响应式**: 适配移动端（320px-428px）及桌面端，按钮区域和网格布局自适应
- **ARIA 无障碍**: 所有交互元素添加 `aria-label`，按钮支持键盘焦点和操作
- **触屏支持**: 所有点击事件兼容 `touch` 事件，无 300ms 延迟
- **异常处理**: Canvas 分享失败时降级为下载；日期输入非法时给出提示
- **按钮移动约束**: 按钮移动不得撑开页面或改变其他布局；窗口缩放后重新计算边界

-------

<scene_type>prototype-app</scene_type>

# UI 设计指南

## 1. 设计推导依据

- **参考意图**: Free Direction —— 无成品参考图，从约会表白场景语义与交互趣味出发自主建立视觉系统
- **核心情绪 / 应用类型**: 甜蜜俏皮的约会邀请互动流，轻量移动端优先的渐进式叙事应用
- **独特记忆点**: "愿意"按钮始终居中、不可拒绝的温柔强制——视觉上粉色主按钮如心跳般稳定在画面中心，拒绝按钮像捉迷藏一样逃向四角

## 2. Art Direction

- **方向名**: Soft Pop 甜心
- **Design Style**: Rounded 圆润几何 + Soft Blocks 柔色块 —— 粉色系浪漫基调需要大面积柔和色块与圆角承载甜蜜感，圆润几何语言天然匹配约会场景的亲和力
- **DNA 参数**: 圆角 soft（`rounded-2xl` ~ `rounded-3xl`）/ 阴影 subtle（`shadow-sm` 轻投影，避免厚重阴影破坏轻盈感）/ 间距 spacious（`gap-6` ~ `gap-8`，给按钮追逐留足呼吸空间）/ 字体方向 圆体中文 + 几何无衬线 / 装饰手法 虚线圆环、闪光粒子、爱心插画
- **应用类型**: Interactive Narrative —— 五页渐进式故事流，每页一个核心交互焦点

## 3. Color System

**色彩关系**: 暖粉主色 + 同色极浅粉反馈底 + 暖白创作背景，点缀淡黄强调色
**配色设计理由**: primary 粉红承担"愿意"按钮、选中态、爱心插画等情感锚点；bg 暖白营造柔和画布感；accent 淡粉用于卡片底和 hover 反馈；黄色 accent 仅用于第五页保存按钮，形成完成动作的温暖收束
**主色推导**: 从约会表白的浪漫语义出发，取樱花粉为主色——明度偏高、饱和度适中，既甜美又不幼稚；避免荧光粉的刺眼感，保持成年人的温柔浪漫
**使用比例**: 60% 暖白中性 / 30% 浅粉辅助 / 10% 粉红 primary

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|---|---|---|---|---|
| bg | `--background` | `bg-background` | hsl(340 30% 98%) | 暖白基底，微偏粉的柔和画布 |
| card | `--card` | `bg-card` | hsl(340 25% 95%) | 浅粉卡片，与 bg 形成微弱层次 |
| text | `--foreground` | `text-foreground` | hsl(340 15% 20%) | 深粉灰正文，保持可读性 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | hsl(340 10% 50%) | 副文案、占位符、辅助信息 |
| primary | `--primary` | `bg-primary` / `text-primary` | hsl(348 75% 65%) | 樱花粉主色，"愿意"按钮、选中态、爱心 |
| primaryForeground | `--primary-foreground` | `text-primary-foreground` | hsl(0 0% 100%) | primary 上的白色文字 |
| accent | `--accent` | `bg-accent` | hsl(340 20% 92%) | 浅粉 hover 底、"不要"按钮默认底、菜单项状态 |
| accentForeground | `--accent-foreground` | `text-accent-foreground` | hsl(340 25% 35%) | accent 上的中粉文字 |
| border | `--border` | `border-border` | hsl(340 15% 85%) | 淡粉边界，虚线圆环、输入框边框 |

**语义色提示**:
- **成功/确认**: 淡黄 `hsl(45 80% 60%)` bg / `hsl(45 70% 45%)` border / `hsl(45 20% 20%)` text —— 第五页保存按钮专用，色温偏暖与粉红主色协调，饱和度略低于 primary 避免喧宾夺主
- **无错误/警告色需求**，本应用无负面反馈场景

## 4. 字体与节奏

- **font-display**: ZCOOL XiaoWei —— 中文标题用优雅小楷，圆润笔触匹配可爱浪漫调性
- **font-body**: Noto Sans SC —— 正文清晰可读，几何感与圆角设计语言一致
- **字号**: H1 text-4xl ~ text-5xl（标题"可以和我一起约会吗？"）；H2 text-xl ~ text-2xl；body text-base；muted text-sm
- **圆角**: 大 —— `rounded-2xl` 卡片、`rounded-3xl` 按钮、`rounded-full` 闪光粒子，全界面统一圆润语言

## 5. 全局布局契约

- **Reference Layout Use**: 按需求结构推导，五页叙事流每页独立布局
- **Page / Section Order**: 第一页（邀请 + 按钮交互）→ 第二页（确认惊喜）→ 第三页（日期时间）→ 第四页（餐食选择）→ 第五页（摘要 + 保存）
- **Standard Content Zone**: 移动端优先 `max-w-md mx-auto`，桌面端 `max-w-lg`，单列垂直居中布局
- **Shell / Frame Alignment**: 无 chrome 框架，全屏沉浸式页面，内容容器独立居中
- **Padding & Rhythm**: `px-6 py-8 md:px-8 md:py-12`，页面间 `gap-8` 节奏
- **Full-bleed Zones**: 柔和渐变背景 `w-full min-h-dvh`，内容区仍受 max-w 约束
- **Local Narrowing**: 第三页表单区 `max-w-xs` 居中；第四页网格 `max-w-sm`
- **Overflow Strategy**: 按钮区域 `overflow-hidden` 防止"不要"按钮越界；第四页网格固定 3 列不横向滚动
- **Flexibility Boundary**: 允许移动端 padding 微调、按钮尺寸响应式缩放；不允许改变五页顺序、按钮交互逻辑、圆角系统和主色

## 6. 视觉与动效

- **装饰**: 虚线圆环、四角星闪光粒子、圆角爱心插画块
- **阴影/边界**: 轻 —— `shadow-sm` 仅用于卡片和按钮，保持轻盈通透
- **动效**: 精致 —— 页面切换 `fade-in` 300ms；"不要"按钮移动 `ease-in-out 360ms`；"愿意"居中缩放呼吸感 `scale 1.02` 微动；选中餐食 `scale + background` 过渡 200ms

## 7. 组件原则

- 按钮：`rounded-3xl px-8 py-3`，primary 粉红实心 / accent 浅粉底 + 中粉文字（"不要"默认态）；hover 微提亮 `brightness-105`；active `scale-95`；focus-visible `ring-2 ring-primary/40 ring-offset-2`
- 输入框：`rounded-2xl border-border bg-card`，focus `border-primary ring-1 ring-primary/30`
- 餐食卡片：`rounded-2xl bg-card`，未选中 `border border-border`，选中 `bg-primary/10 border-primary ring-1 ring-primary/30` + 右上角勾选图标
- 加载与空状态：爱心骨架屏 `animate-pulse rounded-2xl bg-accent`；空状态用虚线圆环 + 俏皮文案

## 8. Image Direction

- **Image Role**: 插画 —— 第一页爱心主视觉、第五页摘要爱心插画
- **Image Art Direction**: 扁平矢量插画风，圆角方块爱心为主体，线条柔和无锐角，配色与 UI 色板一致（粉红主色 + 浅粉填充 + 暖白底）；周围点缀虚线圆环和四角星闪光，整体构图居中偏上，留出下方按钮区域；风格参考 LINE 贴图的可爱治愈感，但更简洁克制，避免过度幼稚
- **Image Prompt Keywords**: flat vector illustration, rounded square heart shape, soft pink and cream palette, dashed circle outline, tiny sparkle stars, cute but minimal, mobile app illustration, warm romantic mood, clean line art, pastel gradient background
- **Image Avoidance**: 避免写实照片风爱心、3D 渲染、过度复杂的装饰元素、荧光粉或霓虹色、拟物化纹理、西方情人节 cliché（丘比特、玫瑰堆叠）

## 9. Anti-patterns

- **Split personality**: 五页之间切换圆角强度、主色饱和度或阴影语言；全五页共享同一套粉色圆润系统
- **Phantom tokens**: 编造 shadcn/ui 不存在的 `--love` 或 `--sparkle` 变量；所有颜色从已定义的 9 角色色板派生
- **Default SaaS drift**: 回到默认蓝按钮或通用灰卡片；"愿意"按钮必须是 primary 粉红，"不要"按钮必须是 accent 浅粉
- **Invisible interaction**: "不要"按钮移动后 focus-visible 丢失；每次移动后需将焦点主动移至新位置，确保键盘可达
- **Mono-hue tyranny**: 粉红铺满所有元素；按 60-30-10 把 primary 收回到"愿意"按钮、选中态和爱心插画，其余交由 accent 浅粉和暖白中性色
- **Status color drift**: 保存按钮黄色饱和度过高刺眼；淡黄 `hsl(45 80% 60%)` 饱和度与 primary 粉红 `hsl(348 75% 65%)` 对齐，保持视觉权重一致
- **Animation abuse**: 页面切换动画超过 400ms 造成等待感；所有过渡统一 200-360ms，不拖沓
- **Button chase overflow**: "不要"按钮移动时撑开页面或触发滚动条；按钮区域必须 `overflow-hidden` + 动态坐标计算含 10px 内边距安全区