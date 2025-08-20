#!/bin/bash
# 🚀 DrawToVideo Production Deployment Script
# 一键部署脚本，解决网络连接问题

echo "🎬 DrawToVideo Production Deployment"
echo "===================================="

# 检查网络连接
echo "📡 Testing network connectivity..."
if ping -c 1 github.com > /dev/null 2>&1; then
    echo "✅ Network connection OK"
else
    echo "❌ Network connection failed. Please check your internet connection."
    echo "💡 Try running this script again, or use GitHub Desktop app."
    exit 1
fi

# 检查 Git 状态
echo "📋 Checking Git status..."
git status --porcelain
if [ $? -ne 0 ]; then
    echo "❌ Git repository error"
    exit 1
fi

# 推送到 GitHub (多种方法)
echo "🚀 Pushing to GitHub..."

# Method 1: Direct push
echo "📤 Attempt 1: Direct push..."
if timeout 60 git push origin main; then
    echo "✅ Successfully pushed to GitHub!"
    exit 0
fi

# Method 2: Force HTTP/1.1
echo "📤 Attempt 2: Using HTTP/1.1..."
git config --global http.version HTTP/1.1
if timeout 60 git push origin main; then
    echo "✅ Successfully pushed to GitHub with HTTP/1.1!"
    exit 0
fi

# Method 3: Increase buffer size
echo "📤 Attempt 3: Increasing buffer size..."
git config --global http.postBuffer 524288000
if timeout 60 git push origin main; then
    echo "✅ Successfully pushed to GitHub with large buffer!"
    exit 0
fi

# Method 4: Push in smaller chunks (if we had multiple commits)
echo "📤 Attempt 4: Alternative push strategy..."
git config --global push.default simple
if timeout 120 git push -v origin main; then
    echo "✅ Successfully pushed to GitHub with verbose output!"
    exit 0
fi

# If all methods fail
echo "❌ All push attempts failed. This might be due to:"
echo "   1. Network connectivity issues"
echo "   2. GitHub server issues"
echo "   3. Repository permissions"
echo ""
echo "🛠️  Alternative solutions:"
echo "   1. Use GitHub Desktop app"
echo "   2. Try again later when network is more stable"
echo "   3. Use 'git push --force-with-lease origin main' (with caution)"
echo "   4. Check GitHub status at https://githubstatus.com"
echo ""
echo "📦 Your code is safely committed locally. The repository is ready for deployment."

exit 1