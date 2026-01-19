#!/bin/bash

# Git 推送速度优化脚本
# 使用方法: bash optimize-git-push.sh

echo "=========================================="
echo "Git 推送速度优化脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 检查当前远程仓库配置
echo -e "${YELLOW}1. 检查当前远程仓库配置...${NC}"
git remote -v
echo ""

# 2. 检查 SSH key
echo -e "${YELLOW}2. 检查 SSH key...${NC}"
if [ -f ~/.ssh/id_ed25519_designagent.pub ]; then
    echo -e "${GREEN}✓ 找到 SSH 公钥: ~/.ssh/id_ed25519_designagent.pub${NC}"
    echo ""
    echo "公钥内容："
    cat ~/.ssh/id_ed25519_designagent.pub
    echo ""
    echo -e "${YELLOW}请确认此公钥已添加到 GitHub:${NC}"
    echo "https://github.com/settings/keys"
    echo ""
    read -p "公钥已添加到 GitHub？(y/n): " ssh_added
else
    echo -e "${RED}✗ 未找到 SSH 公钥${NC}"
    ssh_added="n"
fi

# 3. 切换到 SSH
if [ "$ssh_added" = "y" ]; then
    echo -e "${YELLOW}3. 切换到 SSH...${NC}"
    git remote set-url origin git@github.com:Summerdodesign/jensen-huang-life.git
    echo -e "${GREEN}✓ 已切换到 SSH${NC}"
    git remote -v
    echo ""
    
    # 测试 SSH 连接
    echo -e "${YELLOW}4. 测试 SSH 连接...${NC}"
    ssh -T git@github.com 2>&1 | head -3
    echo ""
else
    echo -e "${YELLOW}跳过 SSH 切换，继续优化 HTTP 配置...${NC}"
    echo ""
fi

# 5. 优化 Git HTTP 配置
echo -e "${YELLOW}5. 优化 Git HTTP 配置...${NC}"

# 检查是否有权限修改全局配置
if git config --global --get http.postBuffer > /dev/null 2>&1 || git config --global http.postBuffer 524288000 > /dev/null 2>&1; then
    echo -e "${GREEN}配置全局 Git 设置...${NC}"
    git config --global http.postBuffer 524288000
    git config --global http.lowSpeedLimit 1000
    git config --global http.lowSpeedTime 300
    git config --global core.compression 6
    git config --global pack.windowMemory 256m
    git config --global http.version HTTP/1.1
    echo -e "${GREEN}✓ 全局配置完成${NC}"
else
    echo -e "${YELLOW}无法修改全局配置，尝试本地配置...${NC}"
    git config http.postBuffer 524288000 2>/dev/null && echo "✓ 本地配置完成" || echo "✗ 配置失败（可能需要权限）"
fi

echo ""

# 6. 显示当前配置
echo -e "${YELLOW}6. 当前 Git 配置：${NC}"
echo "远程仓库："
git remote -v
echo ""
echo "HTTP/网络相关配置："
git config --list | grep -E "(http|core|pack)" | head -10
echo ""

# 7. 完成
echo "=========================================="
echo -e "${GREEN}优化完成！${NC}"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 如果切换到 SSH，测试推送: git push -v origin main"
echo "2. 如果仍使用 HTTPS，推送时使用: git push -v origin main"
echo "3. 查看详细进度和诊断信息"
echo ""
echo "如果推送仍然很慢，请查看 GIT_SPEED_OPTIMIZATION_GUIDE.md 获取更多解决方案"

