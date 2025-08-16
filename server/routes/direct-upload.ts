/**
 * 🎬 直接上传API - 解决URL参数过长问题
 * 提供快速的图片上传，避免跳转问题
 */

import { Request, Response } from 'express';
import { ObjectStorageService } from '../objectStorage';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

// 配置multer用于文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB限制
  },
  fileFilter: (req, file, cb) => {
    // 检查文件类型
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export const directUploadHandler = upload.single('file');

export async function handleDirectUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '未找到上传文件'
      });
    }

    const objectStorage = new ObjectStorageService();
    const fileExtension = path.extname(req.file.originalname) || '.jpg';
    const fileName = `upload-${randomUUID()}${fileExtension}`;
    const isPublic = req.body.public === 'true';
    
    const folderPath = isPublic ? 'public' : '.private';
    const fullPath = `${folderPath}/${fileName}`;

    // 上传到对象存储
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    
    // 使用获取的预签名URL上传文件
    const uploadResponse = await fetch(uploadURL, {
      method: 'PUT',
      body: req.file.buffer,
      headers: {
        'Content-Type': req.file.mimetype
      }
    });

    if (uploadResponse.ok) {
      // 构造公开访问URL
      const publicUrl = uploadURL.split('?')[0]; // 移除查询参数获取纯URL
      
      return res.json({
        success: true,
        publicUrl: publicUrl,
        fileName: fileName,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      });
    } else {
      throw new Error('上传到存储失败');
    }

  } catch (error) {
    console.error('Direct upload error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '上传失败'
    });
  }
}