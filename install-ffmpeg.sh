#!/bin/bash

# 🎬 DrawToVideo FFmpeg 安装脚本
# 自动检测系统并安装FFmpeg

echo "🚀 DrawToVideo - FFmpeg 安装脚本"
echo "================================="

# 检测操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 检测到 macOS 系统"
    
    # 检查Homebrew是否安装
    if ! command -v brew &> /dev/null; then
        echo "📦 Homebrew 未安装，正在安装..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # 添加到PATH
        if [[ -f "/opt/homebrew/bin/brew" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    else
        echo "✅ Homebrew 已安装"
    fi
    
    # 安装FFmpeg
    if ! command -v ffmpeg &> /dev/null; then
        echo "🎬 正在安装 FFmpeg..."
        brew install ffmpeg
    else
        echo "✅ FFmpeg 已安装"
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 检测到 Linux 系统"
    
    # 检测发行版
    if command -v apt-get &> /dev/null; then
        echo "📦 使用 apt-get 安装 FFmpeg..."
        sudo apt-get update
        sudo apt-get install -y ffmpeg
        
    elif command -v yum &> /dev/null; then
        echo "📦 使用 yum 安装 FFmpeg..."
        sudo yum install -y epel-release
        sudo yum install -y ffmpeg
        
    elif command -v dnf &> /dev/null; then
        echo "📦 使用 dnf 安装 FFmpeg..."
        sudo dnf install -y ffmpeg
        
    else
        echo "❌ 未找到支持的包管理器"
        echo "请手动安装 FFmpeg: https://ffmpeg.org/download.html"
        exit 1
    fi
    
else
    echo "❌ 不支持的操作系统: $OSTYPE"
    echo "请手动安装 FFmpeg: https://ffmpeg.org/download.html"
    exit 1
fi

# 验证安装
echo ""
echo "🔍 验证 FFmpeg 安装..."

if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg 安装成功！"
    echo "版本信息:"
    ffmpeg -version | head -1
    
    # 测试基本功能
    echo ""
    echo "🧪 测试 FFmpeg 基本功能..."
    
    # 创建临时测试文件
    ffmpeg -f lavfi -i testsrc=duration=1:size=320x240:rate=1 -y test_output.mp4 2>/dev/null
    
    if [[ -f "test_output.mp4" ]]; then
        echo "✅ FFmpeg 功能测试通过"
        rm -f test_output.mp4
    else
        echo "⚠️ FFmpeg 安装成功，但功能测试失败"
    fi
    
else
    echo "❌ FFmpeg 安装失败"
    exit 1
fi

# 创建或更新.env文件
echo ""
echo "📝 配置环境变量..."

ENV_FILE=".env"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "创建 .env 文件..."
    cat > "$ENV_FILE" << 'EOF'
# DrawToVideo 环境变量配置

# 服务器端口
PORT=5000

# Replicate API Token (可选 - 用于AI视频生成)
# 获取地址: https://replicate.com/account/api-tokens
# REPLICATE_API_TOKEN=your_token_here

# 开发环境配置
NODE_ENV=development

# 文件上传配置
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# FFmpeg 配置
FFMPEG_AVAILABLE=true
EOF
    echo "✅ 创建 .env 文件完成"
else
    # 更新现有.env文件
    if grep -q "FFMPEG_AVAILABLE" "$ENV_FILE"; then
        sed -i.bak 's/FFMPEG_AVAILABLE=.*/FFMPEG_AVAILABLE=true/' "$ENV_FILE"
    else
        echo "" >> "$ENV_FILE"
        echo "# FFmpeg 配置" >> "$ENV_FILE"
        echo "FFMPEG_AVAILABLE=true" >> "$ENV_FILE"
    fi
    echo "✅ 更新 .env 文件完成"
fi

# 创建上传目录
echo ""
echo "📁 创建必要目录..."
mkdir -p uploads temp
chmod 755 uploads temp
echo "✅ 目录创建完成"

# 安装Node.js依赖 (如果需要)
if [[ -f "package.json" ]] && [[ ! -d "node_modules" ]]; then
    echo ""
    echo "📦 安装 Node.js 依赖..."
    npm install
    echo "✅ Node.js 依赖安装完成"
fi

echo ""
echo "🎉 安装完成！"
echo ""
echo "📋 下一步:"
echo "1. 如需AI视频生成，请在 .env 文件中配置 REPLICATE_API_TOKEN"
echo "2. 运行项目: npm run dev"
echo "3. 访问: http://localhost:5000"
echo ""
echo "🔧 故障排除:"
echo "- 如果FFmpeg命令仍不可用，请重启终端"
echo "- macOS用户可能需要运行: source ~/.zshrc"
echo "- 如遇问题，请查看: https://ffmpeg.org/download.html"
echo ""

# 显示系统状态
echo "📊 系统状态:"
echo "  FFmpeg: $(command -v ffmpeg &> /dev/null && echo '✅ 已安装' || echo '❌ 未安装')"
echo "  Node.js: $(command -v node &> /dev/null && echo '✅ 已安装' || echo '❌ 未安装')"
echo "  npm: $(command -v npm &> /dev/null && echo '✅ 已安装' || echo '❌ 未安装')"
echo ""