/**
 * 📱 Mobile Gesture Handler - Day 4 Advanced Mobile Optimization
 * 超越Higgsfield的移动端交互体验 - 支持多点触控、手势识别、性能优化
 * 
 * Features:
 * - 多点触控绘制
 * - 手势缩放旋转
 * - 压感检测
 * - 防抖优化
 * - 60FPS 流畅体验
 */

import { useRef, useCallback, useEffect } from 'react';

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

interface GestureState {
  isDrawing: boolean;
  isPinching: boolean;
  isRotating: boolean;
  lastPinchDistance: number;
  lastRotationAngle: number;
  activeTouches: TouchPoint[];
}

interface MobileGestureHandlerProps {
  onDrawStart: (point: TouchPoint) => void;
  onDraw: (point: TouchPoint) => void;
  onDrawEnd: () => void;
  onPinch: (scale: number, center: { x: number; y: number }) => void;
  onRotate: (angle: number, center: { x: number; y: number }) => void;
  onTap: (point: TouchPoint) => void;
  onDoubleTap: (point: TouchPoint) => void;
  element: HTMLElement | null;
}

export function useMobileGestureHandler({
  onDrawStart,
  onDraw, 
  onDrawEnd,
  onPinch,
  onRotate,
  onTap,
  onDoubleTap,
  element
}: MobileGestureHandlerProps) {
  
  const gestureStateRef = useRef<GestureState>({
    isDrawing: false,
    isPinching: false,
    isRotating: false,
    lastPinchDistance: 0,
    lastRotationAngle: 0,
    activeTouches: []
  });
  
  const lastTapRef = useRef<{ time: number; point: TouchPoint } | null>(null);
  const rafRef = useRef<number>();

  /**
   * 🎯 高精度触点提取 - 支持压感和多点
   */
  const extractTouchPoints = useCallback((touches: TouchList, rect: DOMRect): TouchPoint[] => {
    const points: TouchPoint[] = [];
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      points.push({
        id: touch.identifier,
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        pressure: (touch as any).force || touch.radiusX / 40 || 0.5, // 压感检测
        timestamp: Date.now()
      });
    }
    
    return points;
  }, []);

  /**
   * 🚀 优化手势计算 - 60FPS流畅体验
   */
  const calculatePinchDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);

  const calculateRotationAngle = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  }, []);

  const calculateCenter = useCallback((p1: TouchPoint, p2: TouchPoint): { x: number; y: number } => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }, []);

  /**
   * 📱 Touch Start Handler - 智能手势识别
   */
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault(); // 防止滚动和缩放
    
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const points = extractTouchPoints(e.touches, rect);
    
    gestureStateRef.current.activeTouches = points;
    
    if (points.length === 1) {
      // 单点触控 - 绘制模式
      gestureStateRef.current.isDrawing = true;
      onDrawStart(points[0]);
      
      // 双击检测
      const now = Date.now();
      if (lastTapRef.current && (now - lastTapRef.current.time) < 300) {
        const distance = calculatePinchDistance(lastTapRef.current.point, points[0]);
        if (distance < 30) { // 30px 内算作双击
          onDoubleTap(points[0]);
          lastTapRef.current = null;
          return;
        }
      }
      lastTapRef.current = { time: now, point: points[0] };
      
    } else if (points.length === 2) {
      // 双点触控 - 缩放/旋转模式
      gestureStateRef.current.isDrawing = false;
      gestureStateRef.current.isPinching = true;
      gestureStateRef.current.lastPinchDistance = calculatePinchDistance(points[0], points[1]);
      gestureStateRef.current.lastRotationAngle = calculateRotationAngle(points[0], points[1]);
    }
  }, [element, extractTouchPoints, onDrawStart, onDoubleTap, calculatePinchDistance, calculateRotationAngle]);

  /**
   * 🎨 Touch Move Handler - 高性能绘制
   */
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const points = extractTouchPoints(e.touches, rect);
    
    gestureStateRef.current.activeTouches = points;

    // 使用 RAF 优化性能，确保 60FPS
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (points.length === 1 && gestureStateRef.current.isDrawing) {
        // 单点绘制
        onDraw(points[0]);
        
      } else if (points.length === 2 && gestureStateRef.current.isPinching) {
        // 双点手势处理
        const currentDistance = calculatePinchDistance(points[0], points[1]);
        const currentAngle = calculateRotationAngle(points[0], points[1]);
        const center = calculateCenter(points[0], points[1]);
        
        // 缩放手势
        if (Math.abs(currentDistance - gestureStateRef.current.lastPinchDistance) > 5) {
          const scale = currentDistance / gestureStateRef.current.lastPinchDistance;
          onPinch(scale, center);
          gestureStateRef.current.lastPinchDistance = currentDistance;
        }
        
        // 旋转手势
        const angleDiff = currentAngle - gestureStateRef.current.lastRotationAngle;
        if (Math.abs(angleDiff) > 2) { // 2度阈值避免误触
          onRotate(angleDiff, center);
          gestureStateRef.current.lastRotationAngle = currentAngle;
        }
      }
    });
  }, [element, extractTouchPoints, onDraw, onPinch, onRotate, calculatePinchDistance, calculateRotationAngle, calculateCenter]);

  /**
   * 🏁 Touch End Handler - 手势结束处理
   */
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const remainingTouches = e.touches.length;
    
    if (remainingTouches === 0) {
      // 所有触点结束
      if (gestureStateRef.current.isDrawing) {
        onDrawEnd();
      }
      
      // 单击检测
      if (gestureStateRef.current.activeTouches.length === 1 && !gestureStateRef.current.isDrawing) {
        onTap(gestureStateRef.current.activeTouches[0]);
      }
      
      // 重置状态
      gestureStateRef.current.isDrawing = false;
      gestureStateRef.current.isPinching = false;
      gestureStateRef.current.activeTouches = [];
      
    } else if (remainingTouches === 1) {
      // 从多点回到单点 - 继续绘制模式
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const points = extractTouchPoints(e.touches, rect);
      
      gestureStateRef.current.isPinching = false;
      gestureStateRef.current.isDrawing = true;
      gestureStateRef.current.activeTouches = points;
      onDrawStart(points[0]);
    }
  }, [element, extractTouchPoints, onDrawEnd, onTap, onDrawStart]);

  /**
   * 🔧 事件监听器绑定
   */
  useEffect(() => {
    if (!element) return;

    // 添加被动事件监听器以提升性能
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // 防止浏览器默认手势
    element.style.touchAction = 'none';

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [element, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    gestureState: gestureStateRef.current,
    isDrawing: gestureStateRef.current.isDrawing,
    isPinching: gestureStateRef.current.isPinching,
    activeTouchCount: gestureStateRef.current.activeTouches.length
  };
}

/**
 * 📱 Mobile Performance Optimizer Hook
 */
export function useMobileOptimization(element: HTMLElement | null) {
  useEffect(() => {
    if (!element) return;

    // 🚀 移动端性能优化
    const optimizeForMobile = () => {
      // 禁用文本选择
      element.style.userSelect = 'none';
      element.style.webkitUserSelect = 'none';
      
      // 优化触摸响应
      element.style.touchAction = 'none';
      element.style.webkitTouchCallout = 'none';
      element.style.webkitTapHighlightColor = 'transparent';
      
      // 启用硬件加速
      element.style.transform = 'translateZ(0)';
      element.style.willChange = 'transform';
      
      // 优化滚动性能
      element.style.webkitOverflowScrolling = 'touch';
    };

    optimizeForMobile();
    
    // 设备方向变化时重新优化
    const handleOrientationChange = () => {
      setTimeout(optimizeForMobile, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [element]);
}

/**
 * 📏 Mobile Viewport Hook - 响应式尺寸适配
 */
export function useMobileViewport() {
  const getViewportInfo = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile,
      isTablet,
      isDesktop,
      devicePixelRatio: window.devicePixelRatio || 1,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
  }, []);

  return getViewportInfo();
}