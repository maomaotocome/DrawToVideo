# Draw to Video 技术实现方案

## 架构概览

```mermaid
graph TB
    subgraph "Frontend"
        A[Next.js App] --> B[Canvas Drawing]
        A --> C[UI Components]
        A --> D[Video Player]
    end
    
    subgraph "Backend Services"
        E[API Gateway] --> F[Video Generation Service]
        E --> G[File Storage Service]
        E --> H[User Management]
    end
    
    subgraph "AI Pipeline"
        F --> I[Path Processing]
        I --> J[Motion Generation]
        J --> K[Video Rendering]
    end
    
    subgraph "Storage"
        G --> L[AWS S3/Cloudflare R2]
        H --> M[PostgreSQL]
        F --> N[Redis Cache]
    end
    
    A --> E
    K --> L
```

---

## 技术栈详细说明

### Frontend 技术栈

```javascript
// package.json 核心依赖
{
  "dependencies": {
    "next": "14.1.0",           // 框架
    "react": "18.2.0",          // UI库
    "fabric": "5.3.0",          // Canvas绘图库
    "framer-motion": "11.0.0",  // 动画
    "video.js": "8.6.0",        // 视频播放器
    "axios": "1.6.0",           // HTTP请求
    "zustand": "4.4.0",         // 状态管理
    "react-dropzone": "14.2.0", // 文件上传
    "@radix-ui/react-*": "*",   // UI组件
    "tailwindcss": "3.4.0"      // 样式
  }
}
```

### Backend 技术栈

```javascript
// 核心技术选择
{
  "runtime": "Node.js 20 LTS",
  "framework": "Express/Fastify",
  "database": "PostgreSQL 15",
  "cache": "Redis 7",
  "queue": "Bull Queue",
  "storage": "AWS S3 / Cloudflare R2",
  "ai_service": "Replicate API / Custom Model"
}
```

---

## 核心模块实现

### 1. Canvas 绘图模块

```typescript
// components/DrawingCanvas.tsx
import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface DrawingCanvasProps {
  backgroundImage?: string;
  onPathComplete: (path: PathData) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  backgroundImage,
  onPathComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        isDrawingMode: true
      });

      // 配置画笔
      fabricCanvas.freeDrawingBrush.width = 5;
      fabricCanvas.freeDrawingBrush.color = '#6366F1';

      // 设置背景图
      if (backgroundImage) {
        fabric.Image.fromURL(backgroundImage, (img) => {
          fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
            scaleX: fabricCanvas.width! / img.width!,
            scaleY: fabricCanvas.height! / img.height!
          });
        });
      }

      // 监听绘制完成
      fabricCanvas.on('path:created', (e) => {
        const path = e.path;
        const pathData = extractPathData(path);
        onPathComplete(pathData);
      });

      setCanvas(fabricCanvas);
    }

    return () => {
      canvas?.dispose();
    };
  }, [backgroundImage]);

  const clearCanvas = () => {
    canvas?.clear();
    if (backgroundImage) {
      // 重新设置背景
      fabric.Image.fromURL(backgroundImage, (img) => {
        canvas?.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }
  };

  const undo = () => {
    const objects = canvas?.getObjects();
    if (objects && objects.length > 0) {
      canvas?.remove(objects[objects.length - 1]);
    }
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
      <div className="canvas-controls">
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={undo}>Undo</button>
      </div>
    </div>
  );
};
```

### 2. 视频生成 API

```typescript
// api/video/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3, generateVideoWithAI } from '@/lib/services';
import { redis } from '@/lib/redis';

interface GenerateVideoRequest {
  imageUrl: string;
  pathData: PathData;
  effect: 'zoom_in' | 'orbit' | 'pull_back';
  duration?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, pathData, effect, duration = 5 } = req.body;
    
    // 生成任务ID
    const taskId = uuidv4();
    
    // 存储任务状态
    await redis.set(`task:${taskId}`, JSON.stringify({
      status: 'processing',
      progress: 0
    }), 'EX', 3600);

    // 异步处理视频生成
    processVideoGeneration(taskId, {
      imageUrl,
      pathData,
      effect,
      duration
    });

    // 立即返回任务ID
    res.status(202).json({
      taskId,
      statusUrl: `/api/video/status/${taskId}`
    });
    
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
}

async function processVideoGeneration(
  taskId: string,
  params: GenerateVideoRequest
) {
  try {
    // Step 1: 处理路径数据
    const motionData = processPathToMotion(params.pathData, params.effect);
    
    // Step 2: 调用AI生成视频
    const videoUrl = await generateVideoWithAI({
      image: params.imageUrl,
      motion: motionData,
      duration: params.duration
    });
    
    // Step 3: 上传到存储
    const finalUrl = await uploadToS3(videoUrl, `videos/${taskId}.mp4`);
    
    // Step 4: 更新任务状态
    await redis.set(`task:${taskId}`, JSON.stringify({
      status: 'completed',
      videoUrl: finalUrl,
      progress: 100
    }), 'EX', 3600);
    
  } catch (error) {
    // 错误处理
    await redis.set(`task:${taskId}`, JSON.stringify({
      status: 'failed',
      error: error.message
    }), 'EX', 3600);
  }
}

function processPathToMotion(pathData: PathData, effect: string): MotionData {
  // 将用户绘制的路径转换为相机运动数据
  const points = pathData.points;
  const smoothedPoints = smoothPath(points);
  
  switch(effect) {
    case 'zoom_in':
      return generateZoomInMotion(smoothedPoints);
    case 'orbit':
      return generateOrbitMotion(smoothedPoints);
    case 'pull_back':
      return generatePullBackMotion(smoothedPoints);
    default:
      return generateZoomInMotion(smoothedPoints);
  }
}
```

### 3. AI 视频生成服务

```python
# services/video_generator.py
import replicate
import numpy as np
from PIL import Image
import cv2
import os

class VideoGenerator:
    def __init__(self):
        self.client = replicate.Client(api_token=os.environ["REPLICATE_API_TOKEN"])
        
    def generate_from_path(self, image_path, motion_data, duration=5):
        """
        使用AI模型生成视频
        """
        # 方案1: 使用Stable Video Diffusion
        output = self.client.run(
            "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
            input={
                "input_image": open(image_path, "rb"),
                "frames_per_second": 24,
                "motion_bucket_id": self._calculate_motion_intensity(motion_data),
                "cond_aug": 0.02,
                "decoding_t": 7,
                "seed": 42
            }
        )
        
        return output
    
    def generate_with_custom_motion(self, image_path, path_points, effect_type):
        """
        自定义运镜效果生成
        """
        # 加载图片
        img = Image.open(image_path)
        img_array = np.array(img)
        
        # 根据路径生成运镜序列
        frames = []
        for i, point in enumerate(path_points):
            # 计算相机位置
            camera_pos = self._calculate_camera_position(point, effect_type)
            
            # 应用透视变换
            transformed = self._apply_perspective_transform(
                img_array, 
                camera_pos,
                effect_type
            )
            
            frames.append(transformed)
        
        # 生成视频
        video_path = self._frames_to_video(frames)
        return video_path
    
    def _calculate_camera_position(self, point, effect_type):
        """计算相机位置"""
        if effect_type == "zoom_in":
            return {
                "x": point[0],
                "y": point[1],
                "zoom": 1.0 + (point[2] * 0.5),  # 逐渐放大
                "rotation": 0
            }
        elif effect_type == "orbit":
            angle = point[2] * 360  # 完整旋转
            return {
                "x": np.cos(np.radians(angle)) * 100,
                "y": np.sin(np.radians(angle)) * 100,
                "zoom": 1.0,
                "rotation": angle
            }
        elif effect_type == "pull_back":
            return {
                "x": point[0],
                "y": point[1],
                "zoom": 2.0 - (point[2] * 1.0),  # 逐渐缩小
                "rotation": 0
            }
    
    def _apply_perspective_transform(self, image, camera_pos, effect_type):
        """应用透视变换"""
        h, w = image.shape[:2]
        
        # 计算变换矩阵
        if effect_type == "zoom_in":
            # 缩放和平移
            scale = camera_pos["zoom"]
            tx = camera_pos["x"] * (1 - scale)
            ty = camera_pos["y"] * (1 - scale)
            M = np.array([
                [scale, 0, tx],
                [0, scale, ty]
            ], dtype=np.float32)
            transformed = cv2.warpAffine(image, M, (w, h))
            
        elif effect_type == "orbit":
            # 旋转变换
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, camera_pos["rotation"], 1.0)
            transformed = cv2.warpAffine(image, M, (w, h))
            
        elif effect_type == "pull_back":
            # 透视变换
            pts1 = np.float32([[0, 0], [w, 0], [0, h], [w, h]])
            zoom = camera_pos["zoom"]
            offset = (1 - zoom) * 0.5
            pts2 = np.float32([
                [w * offset, h * offset],
                [w * (1 - offset), h * offset],
                [w * offset, h * (1 - offset)],
                [w * (1 - offset), h * (1 - offset)]
            ])
            M = cv2.getPerspectiveTransform(pts1, pts2)
            transformed = cv2.warpPerspective(image, M, (w, h))
        
        return transformed
    
    def _frames_to_video(self, frames, fps=24, output_path="output.mp4"):
        """将帧序列转换为视频"""
        h, w = frames[0].shape[:2]
        
        # 使用 OpenCV 创建视频
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))
        
        for frame in frames:
            # BGR 转换（OpenCV 使用 BGR）
            frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            out.write(frame_bgr)
        
        out.release()
        return output_path
```

### 4. 性能优化策略

```typescript
// lib/optimization.ts

// 1. 图片优化
export async function optimizeImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    img.onload = () => {
      // 限制最大尺寸
      const maxSize = 1920;
      let { width, height } = img;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/jpeg',
        0.85 // 85% 质量
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// 2. 路径数据简化
export function simplifyPath(points: Point[]): Point[] {
  // Douglas-Peucker 算法简化路径
  const epsilon = 2.0; // 容差值
  return douglasPeucker(points, epsilon);
}

// 3. 缓存策略
export class VideoCache {
  private cache = new Map<string, string>();
  
  generateKey(params: VideoParams): string {
    // 生成唯一缓存键
    return crypto
      .createHash('md5')
      .update(JSON.stringify(params))
      .digest('hex');
  }
  
  async get(key: string): Promise<string | null> {
    // 先检查内存缓存
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    // 再检查 Redis
    const cached = await redis.get(`video:${key}`);
    if (cached) {
      this.cache.set(key, cached);
      return cached;
    }
    
    return null;
  }
  
  async set(key: string, url: string): Promise<void> {
    this.cache.set(key, url);
    await redis.set(`video:${key}`, url, 'EX', 86400); // 24小时
  }
}

// 4. 并发控制
export class ConcurrencyManager {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private maxConcurrent = 3;
  
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.process();
    });
  }
  
  private async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    this.running++;
    const task = this.queue.shift()!;
    
    try {
      await task();
    } finally {
      this.running--;
      this.process();
    }
  }
}
```

### 5. 部署配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:4000
    depends_on:
      - api

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/drawvideo
      - REDIS_URL=redis://redis:6379
      - S3_BUCKET=drawvideo-assets
      - REPLICATE_API_TOKEN=${REPLICATE_API_TOKEN}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=drawvideo
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - api

volumes:
  postgres_data:
  redis_data:
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name drawtovideo.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name drawtovideo.ai;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 前端静态文件
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API 路由
    location /api {
        proxy_pass http://api:4000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        
        # 上传大小限制
        client_max_body_size 10M;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 成本估算

### 开发成本
- 前端开发：1人 x 1周 = $2,000
- 后端开发：1人 x 1周 = $2,000
- AI集成：1人 x 3天 = $1,200
- 测试部署：3天 = $600
- **总计：$5,800**

### 运营成本（月度）
```
基础设施：
- Vercel Pro: $20
- Database (Supabase): $25
- Redis (Upstash): $10
- Storage (Cloudflare R2): $5

AI成本：
- Replicate API: $0.0005/秒
- 预估: 1000视频/天 x 5秒 x $0.0005 = $2.5/天 = $75/月

CDN & 带宽：
- Cloudflare: $20

监控 & 分析：
- Sentry: $26
- Google Analytics: $0

总计: ~$181/月
```

---

## 监控与运维

### 监控指标
```javascript
// 关键性能指标
const metrics = {
  // 业务指标
  videoGenerationRate: 'videos/hour',
  conversionRate: 'downloads/generations',
  userRetention: 'returning_users/total_users',
  
  // 技术指标
  apiLatency: 'p50, p95, p99',
  errorRate: 'errors/requests',
  generationTime: 'seconds',
  
  // 资源指标
  cpuUsage: 'percentage',
  memoryUsage: 'MB',
  storageUsage: 'GB'
};
```

### 告警规则
1. API响应时间 > 3秒
2. 错误率 > 1%
3. 视频生成失败率 > 5%
4. 存储使用率 > 80%
5. 日活用户突降 > 20%

---

## 安全考虑

### 安全措施清单
- [x] HTTPS 全站加密
- [x] Rate Limiting (100请求/分钟)
- [x] CORS 配置
- [x] SQL注入防护
- [x] XSS防护（CSP头）
- [x] 文件上传验证
- [x] API密钥加密存储
- [x] 用户数据GDPR合规

---

*文档版本：1.0*
*更新日期：2025年1月14日*