/**
 * 🚀 Vercel API Function - Social Sharing Optimization (Day 5)
 * 超越Higgsfield的社交媒体分享功能 - 智能链接预览、病毒式传播优化
 * 
 * Features:
 * - 动态 Open Graph 生成
 * - 平台特定优化
 * - 病毒传播跟踪
 * - A/B 测试支持
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

interface ShareRequest {
  videoId: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram' | 'discord' | 'reddit';
  title?: string;
  description?: string;
  tags?: string[];
  customMessage?: string;
}

interface ShareMetadata {
  platform: string;
  shareUrl: string;
  optimizedTitle: string;
  optimizedDescription: string;
  hashtags: string[];
  previewImageUrl: string;
  trackingParams: string;
}

// 🎯 平台特定配置
const PLATFORM_CONFIG = {
  twitter: {
    maxTitleLength: 280,
    maxDescLength: 0, // Twitter doesn't use descriptions in cards
    hashtagStrategy: 'trending',
    viralMultiplier: 1.8,
    optimalHashtags: 3,
    shareTemplate: (data: any) => 
      `${data.title} ${data.hashtags} ${data.url} #DrawToVideo #AIVideo #Creative`
  },
  facebook: {
    maxTitleLength: 100,
    maxDescLength: 300,
    hashtagStrategy: 'minimal',
    viralMultiplier: 1.5,
    optimalHashtags: 2,
    shareTemplate: (data: any) => 
      `🎬 ${data.title}\n\n${data.description}\n\n${data.url}\n\n${data.hashtags}`
  },
  linkedin: {
    maxTitleLength: 150,
    maxDescLength: 200,
    hashtagStrategy: 'professional',
    viralMultiplier: 1.2,
    optimalHashtags: 5,
    shareTemplate: (data: any) => 
      `Professional video creation: ${data.title}\n\n${data.description}\n\n${data.url}\n\n${data.hashtags}`
  },
  whatsapp: {
    maxTitleLength: 65,
    maxDescLength: 0,
    hashtagStrategy: 'none',
    viralMultiplier: 2.0,
    optimalHashtags: 0,
    shareTemplate: (data: any) => 
      `🎥 Check out this amazing video I created!\n${data.title}\n${data.url}`
  },
  telegram: {
    maxTitleLength: 100,
    maxDescLength: 200,
    hashtagStrategy: 'moderate',
    viralMultiplier: 1.6,
    optimalHashtags: 3,
    shareTemplate: (data: any) => 
      `🎬 **${data.title}**\n\n${data.description}\n\n${data.url}\n\n${data.hashtags}`
  },
  discord: {
    maxTitleLength: 256,
    maxDescLength: 2048,
    hashtagStrategy: 'community',
    viralMultiplier: 1.4,
    optimalHashtags: 4,
    shareTemplate: (data: any) => 
      `🎥 **${data.title}**\n${data.description}\n\n${data.url}\n\n${data.hashtags}`
  },
  reddit: {
    maxTitleLength: 300,
    maxDescLength: 0,
    hashtagStrategy: 'none',
    viralMultiplier: 1.7,
    optimalHashtags: 0,
    shareTemplate: (data: any) => 
      `${data.title} (Created with DrawToVideo)`
  }
};

// 🔥 病毒式传播优化的标签库
const VIRAL_HASHTAGS = {
  trending: ['#viral', '#trending', '#fyp', '#amazing', '#creative', '#art', '#ai', '#tech'],
  professional: ['#marketing', '#business', '#professional', '#corporate', '#branding', '#content'],
  community: ['#community', '#share', '#awesome', '#cool', '#impressive', '#innovation'],
  minimal: ['#video', '#creative'],
  moderate: ['#video', '#creative', '#ai', '#art'],
  none: []
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS with optimized headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoId, platform, title, description, tags, customMessage }: ShareRequest = req.body;

    if (!videoId || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: videoId and platform'
      });
    }

    console.log(`🔗 Generating optimized share link for ${platform}: ${videoId}`);

    // 获取视频元数据 (模拟)
    const videoMetadata = await getVideoMetadata(videoId);
    
    // 生成平台优化的分享数据
    const shareData = await generateOptimizedShareData({
      videoId,
      platform,
      title: title || videoMetadata.title,
      description: description || videoMetadata.description,
      tags: tags || videoMetadata.tags,
      customMessage,
      videoMetadata
    });

    // 记录分享事件用于分析
    await trackSharingEvent(videoId, platform, shareData);

    res.json({
      success: true,
      data: shareData
    });

  } catch (error) {
    console.error('❌ Social share generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Share link generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * 🧠 获取视频元数据
 */
async function getVideoMetadata(videoId: string) {
  // 模拟从数据库获取视频信息
  return {
    title: 'Amazing Camera Movement - DrawToVideo',
    description: 'Professional video created with AI-powered camera movement',
    tags: ['creative', 'video', 'ai'],
    duration: 15,
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 1000),
    thumbnailUrl: `https://cdn.drawtovideo.com/thumbnails/${videoId}.jpg`,
    videoUrl: `https://app.drawtovideo.com/watch/${videoId}`,
    createdAt: new Date().toISOString(),
    qualityScore: 8.5
  };
}

/**
 * 🎯 生成平台优化的分享数据
 */
async function generateOptimizedShareData(params: any): Promise<ShareMetadata> {
  const { videoId, platform, title, description, tags, customMessage, videoMetadata } = params;
  const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];

  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  // 🎯 标题优化
  const optimizedTitle = optimizeTextForPlatform(
    title, 
    config.maxTitleLength,
    platform === 'reddit' ? 'reddit' : 'standard'
  );

  // 📝 描述优化
  const optimizedDescription = config.maxDescLength > 0 
    ? optimizeTextForPlatform(description, config.maxDescLength, 'description')
    : '';

  // 🏷️ 智能标签生成
  const hashtags = generateSmartHashtags(
    platform,
    config.hashtagStrategy,
    config.optimalHashtags,
    tags,
    videoMetadata.qualityScore
  );

  // 📊 跟踪参数
  const trackingParams = generateTrackingParams(videoId, platform);

  // 🔗 分享链接生成
  const shareUrl = generateShareUrl(videoId, platform, trackingParams);

  // 🖼️ 预览图片优化
  const previewImageUrl = await generateOptimizedPreview(
    videoMetadata.thumbnailUrl,
    platform
  );

  return {
    platform,
    shareUrl,
    optimizedTitle,
    optimizedDescription,
    hashtags,
    previewImageUrl,
    trackingParams
  };
}

/**
 * ✨ 智能文本优化
 */
function optimizeTextForPlatform(
  text: string, 
  maxLength: number, 
  type: 'standard' | 'description' | 'reddit'
): string {
  if (text.length <= maxLength) return text;

  // 智能截断，保持完整性
  let optimized = text.substring(0, maxLength - 3);
  
  // 避免截断单词中间
  const lastSpace = optimized.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    optimized = optimized.substring(0, lastSpace);
  }

  // 根据平台调整结尾
  switch (type) {
    case 'reddit':
      return optimized + '...';
    case 'description':
      return optimized + '... 🎬';
    default:
      return optimized + '...';
  }
}

/**
 * 🔥 智能标签生成 - 病毒传播优化
 */
function generateSmartHashtags(
  platform: string,
  strategy: string,
  optimalCount: number,
  baseTags: string[],
  qualityScore: number
): string[] {
  if (optimalCount === 0) return [];

  const viralTags = VIRAL_HASHTAGS[strategy as keyof typeof VIRAL_HASHTAGS] || [];
  const combinedTags = [...new Set([...baseTags, ...viralTags])];

  // 🎯 根据质量评分调整标签策略
  let selectedTags = combinedTags.slice(0, optimalCount);
  
  if (qualityScore > 8.0) {
    // 高质量视频使用更多病毒标签
    selectedTags = ['#viral', '#amazing', ...selectedTags.slice(2)];
  }

  // 确保DrawToVideo品牌标签
  if (!selectedTags.some(tag => tag.includes('DrawToVideo'))) {
    selectedTags[selectedTags.length - 1] = '#DrawToVideo';
  }

  return selectedTags.slice(0, optimalCount);
}

/**
 * 📊 生成跟踪参数
 */
function generateTrackingParams(videoId: string, platform: string): string {
  const params = new URLSearchParams({
    utm_source: platform,
    utm_medium: 'social',
    utm_campaign: 'video_share',
    utm_content: videoId,
    t: Date.now().toString()
  });

  return params.toString();
}

/**
 * 🔗 生成分享链接
 */
function generateShareUrl(videoId: string, platform: string, trackingParams: string): string {
  const baseUrl = `https://app.drawtovideo.com/watch/${videoId}`;
  return `${baseUrl}?${trackingParams}`;
}

/**
 * 🖼️ 生成优化的预览图片
 */
async function generateOptimizedPreview(thumbnailUrl: string, platform: string): Promise<string> {
  // 根据平台优化预览图尺寸
  const optimizations: Record<string, string> = {
    twitter: 'w_1200,h_628,c_fill',
    facebook: 'w_1200,h_630,c_fill',
    linkedin: 'w_1200,h_627,c_fill',
    whatsapp: 'w_400,h_400,c_fill',
    telegram: 'w_512,h_512,c_fill',
    discord: 'w_1920,h_1080,c_fill',
    reddit: 'w_1200,h_628,c_fill'
  };

  const optimization = optimizations[platform] || 'w_1200,h_628,c_fill';
  
  // 假设使用 Cloudinary 或类似服务
  return thumbnailUrl.replace('/upload/', `/upload/${optimization}/`);
}

/**
 * 📈 记录分享事件
 */
async function trackSharingEvent(videoId: string, platform: string, shareData: ShareMetadata) {
  // 模拟发送到分析服务
  const eventData = {
    event: 'video_shared',
    videoId,
    platform,
    timestamp: new Date().toISOString(),
    shareUrl: shareData.shareUrl,
    hashtags: shareData.hashtags,
    trackingParams: shareData.trackingParams
  };

  console.log(`📊 Tracking share event:`, eventData);
  
  // 实际项目中会发送到 Google Analytics, Mixpanel 等
  // await analytics.track(eventData);
}