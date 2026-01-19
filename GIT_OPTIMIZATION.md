# Git 推送速度优化指南

## 当前状态
- 远程仓库：使用 HTTPS 连接
- SSH Key：已存在 (`id_ed25519_designagent.pub`)

## 优化方案

### 方案 1：切换到 SSH（推荐，速度更快）

SSH 连接通常比 HTTPS 更快，特别是在国内网络环境下。

#### 步骤 1：检查 SSH Key 是否已添加到 GitHub

```bash
# 查看你的 SSH public key
cat ~/.ssh/id_ed25519_designagent.pub
```

如果还没有添加到 GitHub：
1. 复制上面的公钥内容
2. 访问 https://github.com/settings/ssh/new
3. 粘贴公钥并保存

#### 步骤 2：测试 SSH 连接

```bash
ssh -T git@github.com
```

如果看到 "Hi xxx! You've successfully authenticated..." 说明连接成功。

#### 步骤 3：切换到 SSH

```bash
cd /Users/summer_xia/jensen-huang-life
git remote set-url origin git@github.com:Summerdodesign/jensen-huang-life.git
git remote -v  # 验证已切换
```

### 方案 2：优化 Git HTTP 配置

如果继续使用 HTTPS，可以优化以下配置：

#### 全局配置（推荐）

```bash
# 增加 HTTP 缓冲区大小（500MB）
git config --global http.postBuffer 524288000

# 优化慢速网络处理
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

# 优化压缩级别（0-9，6 是平衡点）
git config --global core.compression 6

# 优化打包内存
git config --global pack.windowMemory 256m

# 使用 HTTP/1.1（某些网络环境下更稳定）
git config --global http.version HTTP/1.1
```

#### 仅当前仓库配置

如果无法修改全局配置，可以只配置当前仓库：

```bash
cd /Users/summer_xia/jensen-huang-life

# 移除 --global 参数
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
git config core.compression 6
git config pack.windowMemory 256m
```

### 方案 3：使用代理（如果公司有代理）

如果公司网络有代理，可以配置 Git 使用代理：

```bash
# HTTP 代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# 或者只对 GitHub 使用代理
git config --global http.https://github.com.proxy http://proxy.example.com:8080

# 取消代理
# git config --global --unset http.proxy
# git config --global --unset https.proxy
```

### 方案 4：使用 GitHub 镜像（备选）

如果 GitHub 访问很慢，可以考虑使用镜像：

```bash
# 使用 GitHub 镜像（需要确认镜像服务可用性）
# 注意：这需要镜像服务支持，通常不推荐用于生产环境
```

## 验证优化效果

### 测试推送速度

```bash
# 创建一个测试提交
echo "# Test" >> test.md
git add test.md
git commit -m "Test push speed"

# 使用 verbose 模式查看详细推送信息
time git push -v origin main

# 清理测试文件
git reset HEAD~1
rm test.md
```

### 查看当前配置

```bash
# 查看所有 Git 配置
git config --list | grep -E "(http|core|pack|remote)"

# 查看远程仓库配置
git remote -v
```

## 推荐配置组合

**最佳实践（国内网络）：**

1. **优先使用 SSH**（最快最稳定）
   ```bash
   git remote set-url origin git@github.com:Summerdodesign/jensen-huang-life.git
   ```

2. **如果必须用 HTTPS，添加以下配置：**
   ```bash
   git config --global http.postBuffer 524288000
   git config --global http.lowSpeedLimit 0
   git config --global http.lowSpeedTime 999999
   git config --global core.compression 6
   ```

3. **推送时使用 verbose 模式查看进度：**
   ```bash
   git push -v origin main
   ```

## 常见问题

### Q: 推送时卡住不动？
A: 可能是网络问题，尝试：
- 使用 `git push -v` 查看详细进度
- 检查网络连接
- 尝试使用 SSH 代替 HTTPS

### Q: 推送很慢但能成功？
A: 这是正常的，特别是：
- 首次推送大量文件
- 网络环境较差
- 使用 HTTPS 连接

### Q: 如何查看推送进度？
A: 使用 `-v` 或 `--verbose` 参数：
```bash
git push -v origin main
```

### Q: SSH 连接失败？
A: 检查：
1. SSH key 是否已添加到 GitHub
2. SSH 配置文件是否正确
3. 网络是否允许 SSH 连接（端口 22）

## 注意事项

- 这些配置是安全的，不会影响代码
- 全局配置会影响所有 Git 仓库
- 如果公司网络有特殊限制，可能需要联系 IT 部门
- SSH 连接需要端口 22 开放，某些公司网络可能限制

