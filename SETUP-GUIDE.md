# 🚀 DrawToVideo 设置指南

## 🎯 快速开始

### 第一步：安装FFmpeg（推荐）

#### macOS 用户
```bash
# 安装Homebrew（如果尚未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 使用Homebrew安装FFmpeg
brew install ffmpeg

# 验证安装
ffmpeg -version
```

#### Ubuntu/Debian 用户
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows 用户
1. 访问 https://ffmpeg.org/download.html
2. 下载Windows版本
3. 解压并添加到PATH环境变量

### 第二步：配置环境变量

创建 `.env` 文件：
```bash
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
```

### 第三步：安装依赖并启动

```bash
# 安装Node.js依赖
npm install

# 启动开发服务器
npm run dev
```

## 🏥 系统健康检查

启动应用后，访问以下端点检查系统状态：

- **完整健康检查**: `GET http://localhost:5000/api/health`
- **视频生成能力检查**: `GET http://localhost:5000/api/health/video`
- **测试视频生成**: `POST http://localhost:5000/api/health/test-generation`

## 📊 功能级别

### ✅ Level 1: CSS动画回退（总是可用）
- 无需外部依赖
- 创建CSS动画效果
- 适合演示和原型

### 🎬 Level 2: 本地FFmpeg生成（推荐）
- 需要安装FFmpeg
- 高质量视频输出
- 快速本地处理
- 多种专业效果

### 🤖 Level 3: AI驱动生成（最高质量）
- 需要Replicate API Token
- AI增强的视频生成
- 最高质量输出
- 需要网络连接

## 🔧 故障排除

### FFmpeg相关问题

#### 问题：command not found: ffmpeg
**解决方案：**
1. 确保FFmpeg已正确安装
2. 重启终端/命令行界面
3. macOS用户：运行 `source ~/.zshrc`

#### 问题：Permission denied
**解决方案：**
```bash
# 确保uploads目录有写权限
mkdir -p uploads temp
chmod 755 uploads temp
```

### API相关问题

#### 问题：Replicate API失败
**解决方案：**
1. 检查网络连接
2. 验证API Token是否正确设置
3. 检查API额度是否充足

### 性能优化

#### 大文件处理
```bash
# 在.env中增加文件大小限制
MAX_FILE_SIZE=52428800  # 50MB
```

#### 内存优化
```bash
# 启动时增加内存限制
node --max-old-space-size=4096 dist/index.js
```

## 📋 支持的视频效果

| 效果名称 | 描述 | 难度 | 质量 |
|---------|------|------|------|
| `zoom_in` | 相机向前推进 | 初级 | 电影级 |
| `orbit` | 360°环绕拍摄 | 初级 | 专业级 |
| `pull_back` | 拉远镜头揭示全景 | 中级 | 电影级 |
| `dramatic_spiral` | 戏剧性螺旋运动 | 高级 | 病毒式优化 |
| `vertigo_effect` | 希区柯克式变焦 | 大师级 | 大师级 |
| `bullet_time` | 矩阵式360°冻结 | 专家级 | 大片级 |
| `crash_zoom` | 快速冲击变焦 | 中级 | 动作片级 |
| `floating_follow` | 梦幻浮动跟随 | 高级 | 空灵级 |

## 🎨 定制化配置

### 添加自定义效果

在 `server/services/robustVideoGenerator.ts` 中：

```typescript
// 在 getImprovedVideoFilter 方法中添加新效果
private getImprovedVideoFilter(effect: string, duration: number): string {
  const filters = {
    // ... 现有效果
    
    my_custom_effect: `自定义FFmpeg滤镜表达式`,
  };
  
  return filters[effect as keyof typeof filters] || filters.zoom_in;
}
```

### 调整质量设置

```typescript
// 修改输出参数
const ffmpeg = spawn('ffmpeg', [
  '-loop', '1',
  '-i', imagePath,
  '-c:v', 'libx264',        // 编解码器
  '-preset', 'medium',      // 编码速度 (ultrafast, fast, medium, slow, veryslow)
  '-crf', '23',            // 质量 (0-51, 越小越好)
  '-pix_fmt', 'yuv420p',   // 像素格式
  '-r', '24',              // 帧率
  // ... 其他参数
]);
```

## 📞 获取帮助

### 检查系统状态
```bash
curl http://localhost:5000/api/health
```

### 测试视频生成
```bash
curl -X POST http://localhost:5000/api/health/test-generation
```

### 查看日志
- 开发模式下，所有日志都会显示在控制台
- 生产环境中，检查系统日志

## 🚀 生产部署

### 环境变量
```bash
NODE_ENV=production
PORT=5000
REPLICATE_API_TOKEN=your_production_token
```

### PM2 部署
```bash
npm install -g pm2
pm2 start npm --name "drawtovideo" -- start
pm2 startup
pm2 save
```

### Docker 部署
```dockerfile
FROM node:18-slim

# 安装FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

---

## ⚡ 快速诊断

如果遇到问题，按顺序检查：

1. **✅ Node.js版本**: `node --version` (需要 >= 14)
2. **🎬 FFmpeg安装**: `ffmpeg -version`
3. **📁 目录权限**: `ls -la uploads/` 
4. **🔌 端口可用**: `lsof -i :5000`
5. **🏥 健康检查**: `curl http://localhost:5000/api/health`

---

需要更多帮助？请查看项目文档或提交issue。