# 项目体系结构 (AGENTS)

本文档基于 Next.js 项目范本与当前实际代码结构生成，详细说明各级目录与文件的功能定义。

## 完整目录树结构

```text
├── messages/                   # 国际化 多语言翻译 (next-intl)
├── public/                     # 公共资源，放一些不需要经过编译的文件
├── scripts/                    # 自定义脚本，工程化相关
│   ├── manage.mjs              # 核心脚本：根据不同环境变量启动服务，构建服务
│   ├── next/                   # Next.js 相关特定脚本
│   │   ├── genDesignToken.mjs  # 生成样式变量，执行后创建 src/styles/css-variables.css
│   │   ├── genRoutes.mjs       # 动态监听 src/app/[locale] 目录结构生成 src/constants/routes.ts
│   │   └── ...
│   └── utils.mjs               # 脚本通用工具函数
├── src/                        # 源代码目录 (见下文详细 breakdown)
├── .env.*                      # 环境变量文件
├── next.config.mjs             # Next.js 配置文件
└── package.json                # 项目依赖配置
```

## Src 源码目录详解 (First Layer Breakdown)

`src` 目录是项目的核心，采用了模块化与分层设计的原则：

```text
src/
├── apis/                   # 接口请求层 (对应描述中的 api)
│   ├── queries/            # Get 请求封装 (React Query useQuery)
│   ├── mutations/          # Post/Put/Delete 请求封装 (React Query useMutation)
│   └── ...                 # 请求工具类与类型定义
├── app/                    # Next.js App Router 路由层
│   └── [locale]/           # 国际化路由入口，仅负责路由定义，具体实现委托给 appTemplates
├── appTemplates/           # 页面逻辑层 (扁平化目录)
│   └── [PageName]/         # 每个页面一个独立文件夹，包含该页面独有的组件、样式、Hooks
├── assets/                 # 静态资源层
│   ├── images/             # 图片资源
│   ├── fonts/              # 字体文件
│   └── ...
├── components/             # 全局组件层
│   # 仅存放被多个页面 (appTemplates) 复用的通用组件
│   # 页面私有组件应存放在 appTemplates/[PageName]/components
├── constants/              # 全局常量层
│   # 存放路由表、枚举值、配置项等静态数据
├── contexts/               # 全局状态层
│   # 基于 Context API 或 Zustand 的全局状态管理
├── hooks/                  # 全局 Hooks 层
│   # 存放通用的自定义 Hooks (如 useWindowSize, useAuth 等)
├── i18n/                   # 国际化配置层
│   # next-intl 的配置与导航封装
├── icons/                  # 图标组件层
│   # SVG Icon 组件集合
├── middlewares/            # 中间件逻辑层
│   # 拆分的中间件处理函数 (如 路由重定向、权限校验逻辑)
├── navigation/             # 导航组件层
│   # 封装的 Link 组件与路由跳转逻辑 (含登录拦截等)
├── services/               # 业务服务层
│   # 复杂的业务逻辑封装，独立于 UI 组件之外的处理层
├── store/                  # 全局状态管理 (Zustand Stores)
│   # 定义全局 Store Slices
├── styles/                 # 全局样式层
│   # 全局 CSS 变量、Mixins、Antd 主题覆盖
├── types/                  # 全局类型层
│   # 通用的 TypeScript 类型定义 (.d.ts)
├── utils/                  # 工具函数层
│   # 纯函数工具集合
├── global.d.ts             # 全局类型声明补充
├── instrumentation.ts      # 监控埋点配置 (Sentry)
└── middleware.ts           # Next.js 中间件入口 (聚合 middlewares 目录下的逻辑)
```

## 页面模块结构规范 (appTemplates)

`src/appTemplates` 目录下的每个页面文件夹（`A_SPECIFIC_PAGE`）应遵循以下结构：

```text
src/appTemplates/A_SPECIFIC_PAGE/
├── Banner/                     # 页面内模块拆分的子组件
│   ├── index.module.scss       # 组件私有样式
│   └── index.tsx               # 组件逻辑
├── index.module.scss           # 页面主样式 (模块化隔离)
├── index.tsx                   # 页面主入口 (src/app 路由直接饮用此处)
├── store.ts                    # 模块所需的状态存储管理 (Zustand Slice)
├── type.ts                     # 模块私有类型声明 (公共类型抽离至全局)
├── use[Feature].ts             # 模块私有 Hooks (逻辑复用)
└── demo.tsx                    # (可选) Demo 展示或测试用例
```
