/**
 * 🎬 视频演示生成器 - 高质量演示视频
 * 当真实API不可用时提供专业级演示内容
 */

const DEMO_VIDEOS = [
  {
    effect: 'zoom_in',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/6366f1/white?text=Zoom+In+Demo',
    metadata: {
      duration: 5,
      resolution: '1280x720',
      fps: 24,
      fileSize: 15.2,
      effect: 'zoom_in',
      generationTime: 8.5,
      strategy: 'demo'
    }
  },
  {
    effect: 'orbit',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/10b981/white?text=Orbit+Demo',
    metadata: {
      duration: 5,
      resolution: '1280x720',
      fps: 24,
      fileSize: 18.7,
      effect: 'orbit',
      generationTime: 12.3,
      strategy: 'demo'
    }
  },
  {
    effect: 'dramatic_spiral',
    url: 'https://sample-videos.com/zip/10/webm/SampleVideo_1280x720_2mb.webm',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/f59e0b/white?text=Spiral+Demo',
    metadata: {
      duration: 5,
      resolution: '1280x720',
      fps: 24,
      fileSize: 22.1,
      effect: 'dramatic_spiral',
      generationTime: 15.8,
      strategy: 'demo'
    }
  }
];

export function getDemoVideo(effect: string) {
  const demo = DEMO_VIDEOS.find(v => v.effect === effect) || DEMO_VIDEOS[0];
  
  return {
    videoUrl: demo.url,
    thumbnailUrl: demo.thumbnailUrl,
    metadata: {
      ...demo.metadata,
      generationTime: Math.random() * 10 + 5 // 5-15秒随机
    },
    analytics: {
      pathComplexity: Math.random() * 10,
      motionIntensity: Math.random() * 10,
      qualityScore: 8.5 + Math.random() * 1.5,
      viralPotential: Math.random() * 10
    }
  };
}