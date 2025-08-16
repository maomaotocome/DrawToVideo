/**
 * 🎬 文件上传处理器 - 支持图像和视频
 * 集成Replit对象存储，提供安全的文件上传功能
 */

import { Router } from "express";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import crypto from "crypto";

const router = Router();

// 配置 Google Cloud Storage
const storage = new Storage();
const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
const bucket = storage.bucket(bucketId!);

// 配置 multer 内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

/**
 * POST /api/images/upload
 * 生成预签名上传URL
 */
router.post('/upload', async (req, res) => {
  try {
    const fileName = `${Date.now()}_${crypto.randomUUID()}`;
    const publicPath = `public/${fileName}`;
    
    const file = bucket.file(publicPath);
    
    // 生成预签名上传URL（24小时有效）
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 24 * 60 * 60 * 1000,
      contentType: 'application/octet-stream',
    });
    
    res.json({
      success: true,
      uploadURL: signedUrl,
      publicUrl: `https://storage.googleapis.com/${bucketId}/${publicPath}`,
      fileName: publicPath
    });
    
  } catch (error) {
    console.error('Upload URL generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate upload URL'
    });
  }
});

/**
 * POST /api/images/direct-upload  
 * 直接上传文件
 */
router.post('/direct-upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }
    
    const fileName = `${Date.now()}_${crypto.randomUUID()}_${req.file.originalname}`;
    const isPublic = req.body.public === 'true';
    const filePath = isPublic ? `public/${fileName}` : `.private/${fileName}`;
    
    const file = bucket.file(filePath);
    
    // 上传文件
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedAt: new Date().toISOString()
        }
      },
      public: isPublic
    });
    
    const publicUrl = isPublic 
      ? `https://storage.googleapis.com/${bucketId}/${filePath}`
      : await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天
        }).then(urls => urls[0]);
    
    res.json({
      success: true,
      publicUrl,
      fileName: filePath,
      size: req.file.size,
      contentType: req.file.mimetype
    });
    
  } catch (error) {
    console.error('Direct upload failed:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed'
    });
  }
});

/**
 * GET /api/images/:fileName
 * 获取文件的访问URL
 */
router.get('/:fileName(*)', async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const file = bucket.file(fileName);
    
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    // 检查文件是否公开
    const [metadata] = await file.getMetadata();
    const isPublic = metadata.acl?.some((acl: any) => acl.entity === 'allUsers');
    
    if (isPublic) {
      res.json({
        success: true,
        publicUrl: `https://storage.googleapis.com/${bucketId}/${fileName}`
      });
    } else {
      // 生成临时访问URL（1小时有效）
      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
      });
      
      res.json({
        success: true,
        signedUrl,
        expiresIn: 3600
      });
    }
    
  } catch (error) {
    console.error('File access failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to access file'
    });
  }
});

export default router;