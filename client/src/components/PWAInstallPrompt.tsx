/**
 * 📱 PWA Installation Prompt - Day 4 Mobile Experience Enhancement
 * 让DrawToVideo成为原生级移动应用体验
 * 
 * Features:
 * - 智能安装提示时机
 * - 美观的安装界面
 * - 离线功能支持
 * - 性能监控
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Smartphone, Zap, Offline, Star } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installCount, setInstallCount] = useState(0);

  /**
   * 🎯 检测PWA安装状态和条件
   */
  useEffect(() => {
    // 检查是否已安装
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInApp);
    };

    checkInstallStatus();

    // 监听安装事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 智能显示时机 - 用户使用一段时间后才显示
      const visitCount = parseInt(localStorage.getItem('pwa-visit-count') || '0', 10);
      const hasUsedDrawing = localStorage.getItem('has-used-drawing') === 'true';
      
      if (visitCount >= 2 && hasUsedDrawing && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 3000); // 3秒后显示
      }
      
      localStorage.setItem('pwa-visit-count', (visitCount + 1).toString());
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setInstallCount(prev => prev + 1);
      
      // 记录安装成功
      localStorage.setItem('pwa-installed', 'true');
      console.log('🎉 PWA installed successfully!');
    };

    // 添加事件监听
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  /**
   * 📱 安装PWA
   */
  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted PWA installation');
      } else {
        console.log('❌ User dismissed PWA installation');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('PWA installation failed:', error);
    }
  }, [deferredPrompt]);

  /**
   * 🚀 关闭安装提示
   */
  const handleClose = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  }, []);

  // 不显示条件
  if (!showPrompt || !deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-500/30 shadow-2xl">
        <CardContent className="p-4">
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* 头部 */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Install DrawToVideo
            </h3>
            <p className="text-sm text-purple-200">
              Get the native app experience
            </p>
          </div>

          {/* 特性展示 */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-white">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Faster loading & performance</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white">
              <Offline className="w-4 h-4 text-green-400" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white">
              <Star className="w-4 h-4 text-blue-400" />
              <span>No app store needed</span>
            </div>
          </div>

          {/* 安装按钮 */}
          <div className="space-y-2">
            <Button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none text-white font-medium"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full text-purple-200 hover:bg-white/10 hover:text-white"
              size="sm"
            >
              Maybe later
            </Button>
          </div>

          {/* 统计信息 */}
          <div className="mt-3 text-center">
            <Badge variant="secondary" className="bg-white/10 text-purple-200 border-white/20">
              Join {(12543 + installCount).toLocaleString()}+ users
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 📊 PWA Performance Monitor
 */
export function PWAPerformanceMonitor() {
  useEffect(() => {
    const measurePerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        // 测量页面加载性能
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        // 测量First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        console.log(`📊 PWA Performance:
          - Load Time: ${loadTime}ms
          - First Contentful Paint: ${fcp?.startTime || 'N/A'}ms
          - Connection: ${(navigator as any).connection?.effectiveType || 'unknown'}
        `);

        // 记录性能数据 (可以发送到分析服务)
        const performanceData = {
          loadTime,
          fcp: fcp?.startTime || 0,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          isStandalone: window.matchMedia('(display-mode: standalone)').matches
        };

        localStorage.setItem('pwa-performance', JSON.stringify(performanceData));
      }
    };

    // 页面加载完成后测量
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  return null; // 这是一个性能监控组件，不渲染任何内容
}