# 部署指南

## 构建完成 ✅

项目已经成功构建，生成的文件在 `dist/` 目录中。

## 部署选项

### 方法1: Vercel（推荐 - 最简单）

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 点击 "New Project"
4. 导入你的项目仓库
5. Vercel 会自动检测 Vite 项目并部署
6. 部署完成后会获得一个免费的 URL（如：your-project.vercel.app）

**或者使用命令行：**
```bash
npm install -g vercel
vercel
```

### 方法2: Netlify

1. 访问 [netlify.com](https://www.netlify.com)
2. 注册/登录账号
3. 拖拽 `dist` 文件夹到 Netlify 的部署区域
4. 或者使用 Netlify CLI：
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 方法3: GitHub Pages

1. 在 GitHub 上创建仓库
2. 推送代码到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 `dist` 目录作为源
5. 访问 `https://yourusername.github.io/repository-name`

**注意：** 如果使用 GitHub Pages，需要修改 `vite.config.js` 中的 `base` 为你的仓库名：
```js
base: '/repository-name/'
```

### 方法4: 本地预览

如果你想在本地预览构建后的版本：
```bash
npm run preview
```

### 方法5: 其他静态托管服务

你也可以将 `dist` 文件夹的内容上传到任何静态网站托管服务：
- Cloudflare Pages
- Firebase Hosting
- AWS S3 + CloudFront
- 阿里云 OSS
- 腾讯云 COS

## 文件说明

- `dist/` - 构建后的生产文件，可以直接部署
- `dist/index.html` - 入口文件
- `dist/assets/` - 打包后的 CSS 和 JS 文件

## 注意事项

- 确保 Leaflet.js 的 CDN 链接可以正常访问
- 地图功能需要网络连接才能加载 OpenStreetMap 瓦片
- 所有图片使用 Unsplash CDN，需要网络连接

