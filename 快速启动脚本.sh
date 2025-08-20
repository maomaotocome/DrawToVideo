#!/bin/bash
# 🚀 DrawToVideo 快速启动脚本

echo "🎬 DrawToVideo 快速启动脚本"
echo "================================"

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node --version)
echo "Node.js版本: $node_version"

# 检查是否需要安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    echo "选择安装方式："
    echo "1) npm install (推荐)"
    echo "2) yarn install (如果npm失败)"
    echo "3) 跳过安装，直接运行"
    read -p "请选择 (1/2/3): " choice
    
    case $choice in
        1)
            echo "使用npm安装..."
            npm install --timeout=600000
            ;;
        2)
            echo "使用yarn安装..."
            yarn install
            ;;
        3)
            echo "跳过依赖安装..."
            ;;
        *)
            echo "无效选择，使用npm安装..."
            npm install --timeout=600000
            ;;
    esac
fi

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "⚠️  未找到.env文件，创建环境变量文件..."
    echo "REPLICATE_API_TOKEN=***REMOVED***" > .env
    echo "✅ 环境变量文件创建完成"
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo "网站将在 http://localhost:5173 打开"
echo "按 Ctrl+C 停止服务器"

# 尝试启动
if command -v npm &> /dev/null; then
    npm run dev
else
    echo "❌ npm未找到，请确保Node.js已正确安装"
    exit 1
fi