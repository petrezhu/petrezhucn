# PetreZhu Blog

> 一个专注于BIM与代码工程的技术博客

## 简介

这是PetreZhu的个人技术博客，基于[Hexo](https://hexo.io/)静态博客框架构建，使用[NexT](https://theme-next.js.org/)主题。

**网站地址:** http://petrezhu.cn

**关键词:** BIM, Code, Blog

## 技术栈

- **框架:** Hexo 7.3.0
- **主题:** NexT
- **语言:** 简体中文 (zh-CN)
- **时区:** Asia/Shanghai

## 环境要求

- Node.js (推荐 v24.x)
- npm 或 yarn

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 本地预览

```bash
npm run server
# 或
hexo server
```

访问 http://localhost:4000 查看博客

### 创建新文章

```bash
hexo new "文章标题"
```

### 生成静态文件

```bash
npm run build
# 或
hexo generate
```

### 清理缓存

```bash
npm run clean
# 或
hexo clean
```

### 部署

```bash
npm run deploy
# 或
hexo deploy
```

## 项目结构

```
.
├── _config.yml          # Hexo主配置文件
├── _config.landscape.yml # Landscape主题配置
├── package.json         # 项目依赖
├── scaffolds/           # 文章模板
├── source/              # 源文件目录
│   ├── _posts/         # 文章Markdown文件
│   └── webgl-demo/     # WebGL演示文件
├── themes/              # 主题目录
│   └── next/           # NexT主题
└── public/              # 生成的静态文件（构建后）
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `hexo new [layout] <title>` | 创建新文章 |
| `hexo generate` | 生成静态文件 |
| `hexo server` | 启动本地服务器 |
| `hexo deploy` | 部署网站 |
| `hexo clean` | 清除缓存文件 |

## 配置说明

### 站点配置

站点基本信息在 `_config.yml` 中配置：

- **title:** 站点标题
- **description:** 站点描述
- **author:** 作者名称
- **language:** 语言设置
- **timezone:** 时区设置

### 主题配置

NexT主题的配置文件位于 `themes/next/_config.yml`

## 文章编写

文章使用Markdown格式编写，存放在 `source/_posts/` 目录下。

### Front-matter 示例

```yaml
---
title: 文章标题
date: 2026-02-06 10:00:00
tags:
  - BIM
  - 代码
categories:
  - 技术
---
```

## 开发与部署

### 开发流程

1. 在 `source/_posts/` 创建或编辑Markdown文章
2. 运行 `hexo server` 本地预览
3. 使用 `hexo generate` 生成静态文件
4. 使用 `hexo deploy` 部署到服务器

### 部署配置

在 `_config.yml` 中配置部署方式：

```yaml
deploy:
  type: git
  repo: <repository url>
  branch: main
```

## 许可证

本项目为个人博客项目

## 作者

**PetreZhu** - BIM Code Engineer

## 相关链接

- [Hexo 官方文档](https://hexo.io/docs/)
- [NexT 主题文档](https://theme-next.js.org/)
- [Hexo 插件列表](https://hexo.io/plugins/)
