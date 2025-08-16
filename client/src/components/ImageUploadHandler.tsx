/**
 * 🎬 图片上传处理组件 - 统一管理上传逻辑
 * 解决URL过长和跳转缓慢问题
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadHandlerProps {
  onUploadSuccess?: (imageUrl: string) => void;
  className?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function ImageUploadHandler({ 
  onUploadSuccess,
  className,
  buttonText = "Upload Image",
  variant = "default",
  size = "lg"
}: ImageUploadHandlerProps) {
  const [, navigate] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      // 验证文件类型和大小
      if (!file.type.startsWith('image/')) {
        throw new Error('请选择图片文件');
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('图片文件不能超过10MB');
      }

      // 使用直接上传API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('public', 'true');

      const uploadResponse = await fetch('/api/images/direct-upload', { 
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await uploadResponse.json();
      
      if (result.success) {
        // 成功上传，直接导航到创建页面，图片URL存储在sessionStorage中
        sessionStorage.setItem('uploadedImageUrl', result.publicUrl);
        sessionStorage.setItem('uploadTimestamp', Date.now().toString());
        
        toast({
          title: "图片上传成功",
          description: "正在跳转到创建页面...",
        });
        
        // 延迟100ms确保toast显示
        setTimeout(() => {
          if (onUploadSuccess) {
            onUploadSuccess(result.publicUrl);
          } else {
            navigate('/create');
          }
        }, 100);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "请重试或选择其他图片",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // 重置input值以允许选择相同文件
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload-input"
        disabled={isUploading}
      />
      
      <Button
        onClick={() => document.getElementById('image-upload-input')?.click()}
        disabled={isUploading}
        variant={variant}
        size={size}
        className="w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
            上传中...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
}

// 获取sessionStorage中的图片URL的辅助函数
export function getUploadedImageFromSession(): string | null {
  try {
    const imageUrl = sessionStorage.getItem('uploadedImageUrl');
    const timestamp = sessionStorage.getItem('uploadTimestamp');
    
    // 检查时间戳，超过1小时的上传记录过期
    if (imageUrl && timestamp) {
      const uploadTime = parseInt(timestamp);
      const oneHour = 60 * 60 * 1000;
      
      if (Date.now() - uploadTime < oneHour) {
        return imageUrl;
      } else {
        // 清理过期记录
        sessionStorage.removeItem('uploadedImageUrl');
        sessionStorage.removeItem('uploadTimestamp');
      }
    }
  } catch (error) {
    console.error('Error reading session storage:', error);
  }
  
  return null;
}

// 清理sessionStorage的函数
export function clearUploadedImageSession(): void {
  try {
    sessionStorage.removeItem('uploadedImageUrl');
    sessionStorage.removeItem('uploadTimestamp');
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
}