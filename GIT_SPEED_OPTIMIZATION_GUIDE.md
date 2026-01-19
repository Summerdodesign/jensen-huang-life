# Git 推送速度优化指南

## 当前状态检查结果

✅ **已检查项目状态：**
- 远程仓库：`https://github.com/Summerdodesign/jensen-huang-life.git` (使用 HTTPS)
- 未发现大文件问题（最大文件 75KB）
- 已检测到 SSH 公钥：`~/.ssh/id_ed25519_designagent.pub`

## 优化方案（按优先级排序）

### ⭐ 方案 1：切换到 SSH（最推荐，速度提升最明显）

SSH 通常比 HTTPS 更快，特别是在国内网络环境下。

#### 步骤：

1. **确认 SSH 公钥已添加到 GitHub**
   ```bash
   # 查看你的 SSH 公钥
   cat ~/.ssh/id_ed25519_designagent.pub
   ```
   
   - 复制公钥内容
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

2. **测试 SSH 连接**
   ```bash
   ssh -T git@github.com
   ```
   如果看到 "Hi xxx! You've successfully authenticated..." 说明配置成功

3. **切换远程仓库地址为 SSH**
   ```bash
   git remote set-url origin git@github.com:Summerdodesign/jensen-huang-life.git
   ```

4. **验证切换成功**
   ```bash
   git remote -v
   ```
   应该显示 `git@github.com:Summerdodesign/jensen-huang-life.git`

### 方案 2：优化 Git HTTP 配置

如果必须使用 HTTPS，可以优化以下配置：

#### 全局配置（推荐，影响所有仓库）：
```bash
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 300
git config --global core.compression 6
git config --global pack.windowMemory 256m
git config --global http.version HTTP/1.1
```

#### 仅当前仓库配置：
```bash
git config http.postBuffer 524288000
git config http.lowSpeedLimit 1000
git config http.lowSpeedTime 300
git config core.compression 6
git config pack.windowMemory 256m
```

#### 配置说明：
- `http.postBuffer`: 增加 HTTP 缓冲区到 500MB，适合推送大文件
- `http.lowSpeedLimit` 和 `http.lowSpeedTime`: 网络慢速处理，避免超时
- `core.compression`: 压缩级别（0-9），6 是平衡速度和压缩率
- `pack.windowMemory`: 打包内存限制，提高打包效率
- `http.version`: 使用 HTTP/1.1，在某些网络环境下更稳定

### 方案 3：使用代理（如果公司有代理）

如果公司网络有代理，可以配置 Git 使用代理：

```bash
# HTTP 代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:1080

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 方案 4：使用 GitHub 镜像（国内加速）

如果网络问题严重，可以考虑使用 GitHub 镜像服务，但需要谨慎选择可信的镜像。

## 验证优化效果

优化后，测试推送速度：

```bash
# 查看当前配置
git config --list | grep -E "(http|core|pack)"

# 测试推送（使用 verbose 模式查看详细信息）
git push -v origin main
```

## 常见问题

### Q: 为什么推送还是很慢？
A: 可能的原因：
1. 网络本身较慢（建议使用 SSH 或代理）
2. 需要推送的内容很多（可以分批推送）
3. GitHub 服务器响应慢（可能是临时问题）

### Q: SSH 和 HTTPS 哪个更快？
A: 通常 SSH 更快，因为：
- SSH 连接更稳定
- 不需要每次输入密码（使用 SSH key）
- 在某些网络环境下 SSH 端口（22）比 HTTPS 端口（443）更快

### Q: 如何查看推送进度？
A: 使用 `-v` 或 `--verbose` 参数：
```bash
git push -v origin main
```

### Q: 推送时卡住了怎么办？
A: 
1. 按 `Ctrl+C` 取消
2. 检查网络连接
3. 尝试使用 `--verbose` 查看卡在哪里
4. 如果只是慢，耐心等待（Git 会自动重试）

## 推荐配置（综合方案）

**最佳实践：**
1. ✅ 切换到 SSH（最快）
2. ✅ 配置 Git HTTP 优化参数（备用）
3. ✅ 使用 `git push -v` 查看详细进度

**执行顺序：**
```bash
# 1. 切换到 SSH
git remote set-url origin git@github.com:Summerdodesign/jensen-huang-life.git

# 2. 配置 HTTP 优化（作为备用）
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 300
git config --global core.compression 6

# 3. 验证
git remote -v
git push -v origin main
```

## 注意事项

- 修改 Git 配置可能需要管理员权限
- SSH key 需要添加到 GitHub 账户才能使用
- 某些公司网络可能限制 SSH 连接，需要联系 IT 部门
- 如果使用代理，需要知道代理服务器地址和端口

---

**创建时间：** $(date)
**项目：** jensen-huang-life
**当前远程：** https://github.com/Summerdodesign/jensen-huang-life.git

