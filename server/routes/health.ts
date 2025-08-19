/**
 * 🏥 系统健康检查API - 诊断视频生成能力
 */

import { Router } from "express";
import { robustVideoGenerator } from "../services/robustVideoGenerator";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";

const router = Router();

/**
 * GET /api/health
 * 系统健康状态检查
 */
router.get("/", async (req, res) => {
  try {
    const healthStatus = await performHealthCheck();
    
    res.json({
      success: true,
      data: healthStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Health check failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/health/video
 * 视频生成能力专项检查
 */
router.get("/video", async (req, res) => {
  try {
    const videoHealth = await robustVideoGenerator.healthCheck();
    
    res.json({
      success: true,
      data: {
        ...videoHealth,
        recommendations: generateRecommendations(videoHealth),
        setupInstructions: getSetupInstructions(videoHealth)
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Video health check failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/health/test-generation
 * 测试视频生成功能
 */
router.post("/test-generation", async (req, res) => {
  try {
    console.log('🧪 Starting video generation test...');
    
    // 创建测试图片
    const testImageUrl = await createTestImage();
    
    // 测试视频生成
    const startTime = Date.now();
    const result = await robustVideoGenerator.generateVideo({
      imageUrl: testImageUrl,
      effect: 'zoom_in',
      duration: 2 // 短视频用于测试
    });
    
    const generationTime = Date.now() - startTime;
    
    res.json({
      success: true,
      data: {
        testResult: 'passed',
        generationTime: generationTime,
        videoUrl: result,
        message: '✅ 视频生成测试成功！'
      }
    });
    
  } catch (error) {
    console.error('❌ Video generation test failed:', error);
    
    res.json({
      success: false,
      data: {
        testResult: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        suggestions: [
          'Check if FFmpeg is installed: ./install-ffmpeg.sh',
          'Verify upload directory permissions',
          'Check API configuration if using external services'
        ]
      }
    });
  }
});

/**
 * 执行完整系统健康检查
 */
async function performHealthCheck() {
  const checks = {
    system: await checkSystemInfo(),
    dependencies: await checkDependencies(),
    directories: await checkDirectories(),
    video: await robustVideoGenerator.healthCheck()
  };
  
  // 计算总体健康分数
  const overallStatus = calculateOverallStatus(checks);
  
  return {
    overall: overallStatus,
    details: checks,
    summary: generateHealthSummary(checks)
  };
}

/**
 * 检查系统信息
 */
async function checkSystemInfo() {
  const os = process.platform;
  const nodeVersion = process.version;
  const architecture = process.arch;
  
  return {
    status: 'healthy',
    platform: os,
    nodeVersion,
    architecture,
    memory: {
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
    },
    uptime: Math.round(process.uptime()) + ' seconds'
  };
}

/**
 * 检查关键依赖
 */
async function checkDependencies() {
  const dependencies = {
    ffmpeg: await checkFFmpeg(),
    node: checkNode(),
    directories: await checkRequiredDirectories()
  };
  
  const allHealthy = Object.values(dependencies).every(dep => dep.status === 'available');
  
  return {
    status: allHealthy ? 'healthy' : 'degraded',
    details: dependencies
  };
}

/**
 * 检查FFmpeg
 */
async function checkFFmpeg(): Promise<{ status: string; version?: string; message: string }> {
  try {
    return new Promise((resolve) => {
      const ffmpeg = spawn('ffmpeg', ['-version']);
      let output = '';
      
      ffmpeg.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      ffmpeg.on('close', (code) => {
        if (code === 0 && output.includes('ffmpeg version')) {
          const version = output.split('\n')[0].replace('ffmpeg version ', '').split(' ')[0];
          resolve({
            status: 'available',
            version,
            message: '✅ FFmpeg is available and working'
          });
        } else {
          resolve({
            status: 'unavailable',
            message: '❌ FFmpeg installed but not working properly'
          });
        }
      });
      
      ffmpeg.on('error', () => {
        resolve({
          status: 'missing',
          message: '❌ FFmpeg not found. Run: ./install-ffmpeg.sh'
        });
      });
    });
    
  } catch (error) {
    return {
      status: 'error',
      message: '❌ Error checking FFmpeg: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  }
}

/**
 * 检查Node.js
 */
function checkNode() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split('.')[0]);
  
  return {
    status: majorVersion >= 14 ? 'available' : 'outdated',
    version,
    message: majorVersion >= 14 
      ? '✅ Node.js version is supported'
      : '⚠️ Node.js version may be too old (recommended: 14+)'
  };
}

/**
 * 检查必需目录
 */
async function checkRequiredDirectories() {
  const directories = ['uploads', 'temp'];
  const results = {};
  
  for (const dir of directories) {
    try {
      const fullPath = path.join(process.cwd(), dir);
      await fs.access(fullPath);
      await fs.writeFile(path.join(fullPath, '.test'), 'test');
      await fs.unlink(path.join(fullPath, '.test'));
      
      results[dir] = {
        status: 'available',
        path: fullPath,
        message: '✅ Directory exists and writable'
      };
      
    } catch (error) {
      try {
        await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
        results[dir] = {
          status: 'created',
          path: path.join(process.cwd(), dir),
          message: '✅ Directory created successfully'
        };
      } catch (createError) {
        results[dir] = {
          status: 'error',
          message: '❌ Cannot create directory: ' + (createError instanceof Error ? createError.message : 'Unknown error')
        };
      }
    }
  }
  
  return results;
}

/**
 * 检查目录状态
 */
async function checkDirectories() {
  return await checkRequiredDirectories();
}

/**
 * 计算整体状态
 */
function calculateOverallStatus(checks: any) {
  const hasFFmpeg = checks.video.capabilities.some((cap: string) => cap.includes('FFmpeg'));
  const hasAPI = checks.video.capabilities.some((cap: string) => cap.includes('Replicate'));
  
  if (hasFFmpeg || hasAPI) {
    return {
      status: 'healthy',
      message: '✅ System is ready for video generation',
      score: hasFFmpeg && hasAPI ? 100 : hasFFmpeg ? 85 : 70
    };
  } else {
    return {
      status: 'degraded',
      message: '⚠️ Limited capabilities - using fallback methods only',
      score: 40
    };
  }
}

/**
 * 生成健康摘要
 */
function generateHealthSummary(checks: any) {
  const issues = [];
  const recommendations = [];
  
  if (checks.video.status === 'degraded') {
    issues.push('Video generation capabilities are limited');
    recommendations.push('Install FFmpeg for high-quality video generation');
  }
  
  if (!checks.video.capabilities.some((cap: string) => cap.includes('Replicate'))) {
    recommendations.push('Configure REPLICATE_API_TOKEN for AI-powered generation');
  }
  
  return {
    issues,
    recommendations,
    capabilities: checks.video.capabilities
  };
}

/**
 * 生成建议
 */
function generateRecommendations(videoHealth: any) {
  const recommendations = [];
  
  if (!videoHealth.capabilities.some((cap: string) => cap.includes('FFmpeg'))) {
    recommendations.push({
      priority: 'high',
      action: 'Install FFmpeg',
      command: './install-ffmpeg.sh',
      description: '安装FFmpeg以启用高质量本地视频生成'
    });
  }
  
  if (!videoHealth.capabilities.some((cap: string) => cap.includes('Replicate'))) {
    recommendations.push({
      priority: 'medium',
      action: 'Configure Replicate API',
      description: '在.env文件中设置REPLICATE_API_TOKEN以启用AI视频生成'
    });
  }
  
  return recommendations;
}

/**
 * 获取设置说明
 */
function getSetupInstructions(videoHealth: any) {
  const instructions = [];
  
  if (videoHealth.status === 'degraded') {
    instructions.push({
      step: 1,
      title: '安装FFmpeg',
      description: '运行安装脚本来安装FFmpeg',
      command: './install-ffmpeg.sh',
      estimated_time: '2-5 minutes'
    });
    
    instructions.push({
      step: 2,
      title: '重启应用',
      description: '重启应用以应用更改',
      command: 'npm run dev',
      estimated_time: '30 seconds'
    });
    
    instructions.push({
      step: 3,
      title: '测试功能',
      description: '运行测试验证视频生成功能',
      command: 'curl -X POST http://localhost:5000/api/health/test-generation',
      estimated_time: '10 seconds'
    });
  }
  
  return instructions;
}

/**
 * 创建测试图片
 */
async function createTestImage(): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  
  // 创建一个简单的SVG测试图片
  const svgContent = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#4F46E5"/>
  <circle cx="200" cy="150" r="50" fill="#FFFFFF"/>
  <text x="200" y="220" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="20">
    DrawToVideo Test
  </text>
</svg>`;
  
  const testImagePath = path.join(uploadsDir, 'test-image.svg');
  await fs.writeFile(testImagePath, svgContent);
  
  // 返回公开URL
  const baseUrl = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : `http://localhost:${process.env.PORT || 5000}`;
  
  return `${baseUrl}/uploads/test-image.svg`;
}

export default router;