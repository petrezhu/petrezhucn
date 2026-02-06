---
title: Hexo如何新建笔记
data: 2025-7-27 20:52:02
comments: true
tags:
  - Hexo
categories:
  - Hexo
  - Markdown
Keywords: Hexo how to new post
---

**创建新文章**

#### 方式一：直接放入_posts目录
`/source/_posts`目录下放入新博客的.md文件（包含 title，data等属性）

| 配置项        | 意义         |
| ---------- | ---------- |
| title      | 网页文章标题     |
| date       | 文章创建如期     |
| comments   | 文章评论功能是否启动 |
| tags       | 文章标签       |
| categories | 文章分类       |
| keywords   | 文章关键字      |


#### 方式二：命令行创建

在网站根目录下打开命令行，使用如下命令创建新文章：

```javascript
hexo new <title>
```

![](https://ask.qcloudimg.com/http-save/yehe-1088047/wavnpax0wr.png)

执行该命令，Hexo会在`/source/_posts`目录下创建一篇新的文章：

![](https://ask.qcloudimg.com/http-save/yehe-1088047/l6ekfyzp16.png)

接下来在这篇文章里使用 MarkDown 语法编写文章即可。

**Front-matter**

打开 Hexo 创建的文章可以看到，文章开头有这样一段：

![](https://ask.qcloudimg.com/http-save/yehe-1088047/rpunttrv54.png)

这个使用`---`包括起来的内容称之为`Front-matter`，即前置信息，用于给 Hexo 渲染该 md 文档，除了这三项，还有很多的配置项可以自己添加：

| 配置项        | 意义         |
| ---------- | ---------- |
| title      | 网页文章标题     |
| date       | 文章创建如期     |
| comments   | 文章评论功能是否启动 |
| tags       | 文章标签       |
| categories | 文章分类       |
| keywords   | 文章关键字      |

这里我用一张图来说明如何使用：

![](https://ask.qcloudimg.com/http-save/yehe-1088047/5ri7n3v7o7.png)

**Markdown内容**

Hexo 支持大多数的 MD 语法，如果对MD语法还不熟悉，可以查看该教程：

- 菜鸟教程-Markdown 教程

> https://www.runoob.com/markdown/md-tutorial.html


### 重新生成网站
```bash
npx hexo clean
npx hexo g
npx hexo s
```