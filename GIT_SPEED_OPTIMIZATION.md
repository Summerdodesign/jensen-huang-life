# Git 推送速度优化指南

## 已完成的检查

✅ 当前使用 HTTPS 连接：`https://github.com/Summerdodesign/jensen-huang-life.git`
✅ 仓库大小正常：.git 目录约 296K
✅ 无大文件问题：最大文件 75K（package-lock.json）
✅ 已检查 SSH key：存在 `~/.ssh/id_ed25519_designagent`

## 优化方案

### 方案 1：切换到 SSH（推荐，通常更快）

SSH 连接通常比 HTTPS 更快，特别是在国内网络环境下。

**步骤：**

1. **确认 SSH key 已添加到 GitHub**
   ```bash
   # 查看你的 SSH public key
   cat ~/.ssh/id_ed25519_designagent.pub
   ```
   
   如果还没有添加到 GitHub：
   - 复制上面的公钥内容
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

2. **配置 SSH 使用你的 key**
   ```bash
   # 编辑或创建 ~/.ssh/config
   cat >> ~/.ssh/config << 'EOF'
   Host github.com
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_designagent
       IdentitiesOnly yes
   EOF
   ```

3. **测试 SSH 连接**
   ```bash
   ssh -T git@github.com
   ```
   应该看到：`Hi Summerdodesign! You've successfully authenticated...`

4. **切换远程仓库地址为 SSH**
   ```bash
   git remote set-url origin git@github.com:Summerdodesign/jensen-huang-life.git
   ```

5. **验证**
   ```bash
   git remote -v
   ```
   应该显示 `git@github.com:...` 而不是 `https://...`

### 方案 2：优化 Git HTTP 配置

如果继续使用 HTTPS，可以优化以下配置（需要手动执行，因为配置文件被锁定）：

```bash
# 全局配置（推荐）
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 300
git config --global core.compression 6
git config --global pack.windowMemory 256m

# 或者仅针对当前仓库
git config http.postBuffer 524288000
git config http.lowSpeedLimit 1000
git config http.lowSpeedTime 300
git config core.compression 6
git config pack.windowMemory 256m
```

**配置说明：**
- `http.postBuffer`: 增加 HTTP 缓冲区到 500MB，适合推送大文件
- `http.lowSpeedLimit`: 慢速连接阈值（字节/秒）
- `http.lowSpeedTime`: 慢速连接超时时间（秒）
- `core.compression`: 压缩级别（0-9，6 是平衡值）
- `pack.windowMemory`: 打包时使用的内存限制

### 方案 3：使用代理（如果可用）

如果你有可用的代理：

```bash
# HTTP 代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:1080
git config --global https.proxy socks5://127.0.0.1:1080

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 方案 4：使用 GitHub 镜像（国内）

如果网络问题严重，可以考虑使用 GitHub 镜像服务，但需要注意安全性。

## 验证优化效果

切换后测试推送速度：

```bash
# 查看远程配置
git remote -v

# 测试推送（如果有未推送的提交）
git push -v origin main

# 或者创建一个测试提交
echo "# Test" >> README.md
git add README.md
git commit -m "Test push speed"
git push origin main
```

## 常见问题

### Q: 为什么配置文件被锁定？
A: 可能是其他 Git 工具（如 IDE、Git GUI）正在使用，关闭它们后重试。

### Q: SSH 连接失败怎么办？
A: 
1. 检查 SSH key 是否已添加到 GitHub
2. 检查 `~/.ssh/config` 配置是否正确
3. 测试连接：`ssh -T git@github.com -v`（查看详细日志）

### Q: 推送还是很慢？
A: 
1. 检查网络连接
2. 尝试在不同时间段推送（避开高峰期）
3. 考虑使用代理或 VPN
4. 检查是否有大文件需要推送

## 推荐操作顺序

1. **优先尝试 SSH**（最快、最稳定）
2. 如果 SSH 不可用，优化 HTTP 配置
3. 如果还是慢，考虑使用代理

## 注意事项

- 切换到 SSH 后，需要确保 SSH key 已添加到 GitHub
- 修改 Git 配置是全局的，会影响所有仓库
- 如果使用公司网络，可能有防火墙限制，需要联系 IT 部门

