// Using built-in fetch in Node.js 18+

export interface VideoGenerationRequest {
  imageUrl: string;
  prompt: string;
  duration?: number;
  resolution?: '720p' | '1080p';
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: 'realistic' | 'artistic';
}

export interface VideoGenerationResponse {
  success: boolean;
  generationId?: string;
  status?: 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  processingTime?: number;
  error?: string;
}

export class HiggsfieldVideoService {
  private apiKey: string;
  private baseUrl = 'https://higgsfieldapi.com/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HIGGSFIELD_API_KEY || '';
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Higgsfield API key not configured. Please add HIGGSFIELD_API_KEY to environment variables.',
      };
    }

    try {
      const payload = {
        prompt: request.prompt,
        image_url: request.imageUrl,
        duration: request.duration || 5,
        resolution: request.resolution || '720p',
        aspect_ratio: request.aspectRatio || '16:9',
        style: request.style || 'realistic',
        fps: 30,
        camera_fixed: false,
      };

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `API request failed: ${response.status} ${errorText}`,
        };
      }

      const result = await response.json() as any;
      return {
        success: true,
        generationId: result.generation_id,
        status: result.status,
        videoUrl: result.video_url,
      };
    } catch (error) {
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async checkStatus(generationId: string): Promise<VideoGenerationResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Higgsfield API key not configured',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/status/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Status check failed: ${response.status}`,
        };
      }

      const result = await response.json() as any;
      return {
        success: true,
        status: result.status,
        videoUrl: result.video_url,
        processingTime: result.processing_time,
      };
    } catch (error) {
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async waitForCompletion(generationId: string, timeoutMs = 30 * 60 * 1000): Promise<VideoGenerationResponse> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const status = await this.checkStatus(generationId);
      
      if (!status.success) {
        return status;
      }

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        return {
          success: false,
          error: 'Video generation failed',
        };
      }

      // Wait 30 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 30000));
    }

    return {
      success: false,
      error: 'Video generation timed out after 30 minutes',
    };
  }
}

// Demo/fallback function for when API key is not available
export function createDemoVideo(): VideoGenerationResponse {
  return {
    success: true,
    generationId: 'demo_' + Date.now(),
    status: 'completed',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };
}