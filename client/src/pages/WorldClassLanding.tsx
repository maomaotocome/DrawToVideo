import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Upload, 
  Zap, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Sparkles,
  Video,
  Timer,
  Download,
  Award,
  Target,
  Shield,
  Rocket,
  Eye,
  Heart,
  MousePointer2,
  Camera,
  Wand2,
  Globe,
  BarChart3,
  Infinity
} from "lucide-react";

export default function WorldClassLanding() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    try {
      // 使用直接上传API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('public', 'true');

      const uploadResponse = await fetch('/api/images/direct-upload', { 
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const result = await uploadResponse.json();
      
      if (result.success) {
        // 存储图片URL到sessionStorage，避免URL参数
        sessionStorage.setItem('uploadedImageUrl', result.publicUrl);
        sessionStorage.setItem('uploadTimestamp', Date.now().toString());
        
        // 直接跳转，无URL参数
        window.location.href = '/create';
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('图片上传失败，请重试');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-spin [animation-duration:120s]"></div>
      </div>
      
      {/* Premium Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Navigation - Premium SaaS Style */}
      <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    DrawToVideo
                  </h1>
                  <p className="text-xs text-blue-400 font-medium tracking-wide">AI Video Generator</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">Features</a>
              <a href="#examples" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">Examples</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">Pricing</a>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 border border-white/20">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-xl shadow-purple-500/30 border-0">
                Start Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium Design */}
      <section className="relative pt-20 pb-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Product Hunt Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 border border-orange-500/30 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <Award className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-white font-semibold">Featured on Product Hunt</span>
              <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/40">
                #1 Product
              </Badge>
            </div>

            {/* Main Headline - World-Class Typography */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.85] tracking-tight">
              Transform{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Drawings
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl -z-10 rounded-lg"></div>
              </span>
              <br />
              <span className="text-5xl md:text-6xl lg:text-7xl text-gray-100 font-light">
                into{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">
                  Viral Videos
                </span>
              </span>
            </h1>

            {/* Premium Value Proposition */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              The world's first <strong className="text-white font-semibold">zero-prompt AI video generator</strong>.
              <br />
              Create professional animations with cinematic camera movements in under 10 seconds.
            </p>

            {/* Trust Metrics - Social Proof */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
              {[
                { value: "500K+", label: "Videos Created", icon: <Video className="w-5 h-5 text-blue-400" /> },
                { value: "5 sec", label: "Generation Time", icon: <Zap className="w-5 h-5 text-green-400" /> },
                { value: "98%", label: "Success Rate", icon: <Target className="w-5 h-5 text-purple-400" /> },
                { value: "4.9★", label: "User Rating", icon: <Star className="w-5 h-5 text-yellow-400 fill-current" /> }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {stat.icon}
                    <span className="text-3xl md:text-4xl font-bold text-white ml-2">{stat.value}</span>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Premium Upload Interface */}
            <div className="max-w-4xl mx-auto mb-16">
              <div
                className={`
                  relative border-2 border-dashed rounded-3xl p-20 transition-all duration-700 cursor-pointer group
                  bg-gradient-to-br from-white/[0.02] via-white/[0.05] to-white/[0.02] backdrop-blur-2xl
                  shadow-2xl shadow-black/20
                  ${dragActive 
                    ? 'border-blue-400 bg-blue-500/10 shadow-2xl shadow-blue-500/25 scale-105' 
                    : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/15 hover:scale-102'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Upload Icon */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                    <Upload className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Upload Text */}
                <h3 className="text-4xl font-bold text-white mb-6">Drop Your Image Here</h3>
                <p className="text-gray-400 mb-10 text-xl">
                  or click to browse • PNG, JPG, WebP up to 10MB
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {[
                    { icon: <Timer className="w-4 h-4" />, text: "5s Generation", color: "from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-300" },
                    { icon: <Shield className="w-4 h-4" />, text: "100% Private", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300" },
                    { icon: <Wand2 className="w-4 h-4" />, text: "Zero Prompts", color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300" },
                    { icon: <Heart className="w-4 h-4" />, text: "Free Forever", color: "from-red-500/20 to-pink-500/20 border-red-500/40 text-red-300" }
                  ].map((pill, index) => (
                    <div key={index} className={`inline-flex items-center space-x-2 bg-gradient-to-r ${pill.color} backdrop-blur-sm rounded-full px-5 py-3 border`}>
                      {pill.icon}
                      <span className="text-sm font-semibold">{pill.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-gray-500">
                  No registration required • Start creating instantly • World-class AI technology
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Premium CTAs */}
            <div className="flex flex-wrap justify-center gap-6 mb-20">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-8 text-2xl h-auto font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-500 group hover:scale-105"
                onClick={() => window.location.href = '/create'}
              >
                <Rocket className="w-7 h-7 mr-4 group-hover:translate-x-1 transition-transform" />
                Start Creating Magic
                <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-[#9c5af7] border-2 border-white/30 text-white hover:bg-white/10 px-12 py-8 text-2xl h-auto font-bold backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <Play className="w-7 h-7 mr-4" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-12 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-medium">Trending #1 on TikTok</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-medium">100K+ creators using daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Winner: Best AI Tool 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Professional Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-blue-500/20 text-blue-300 border-blue-500/40 px-6 py-3 text-base">
              How It Works
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Three Steps to{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Viral Success
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI technology that transforms your creative vision into professional videos
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 mb-32">
            {[
              {
                step: "01",
                title: "Upload Your Image",
                description: "Simply drag and drop any image. Our AI instantly understands your vision and prepares the perfect canvas for creation.",
                icon: <Upload className="w-12 h-12" />,
                gradient: "from-blue-500 to-cyan-500",
                features: ["Smart format detection", "Auto-optimization", "Instant preview"],
                bgGradient: "from-blue-500/10 to-cyan-500/10"
              },
              {
                step: "02", 
                title: "Draw Movement Paths",
                description: "Draw simple paths on your image. Our AI translates your strokes into cinematic camera movements with professional precision.",
                icon: <MousePointer2 className="w-12 h-12" />,
                gradient: "from-purple-500 to-pink-500",
                features: ["50+ camera effects", "Real-time preview", "Path intelligence"],
                bgGradient: "from-purple-500/10 to-pink-500/10"
              },
              {
                step: "03",
                title: "Generate & Share",
                description: "Watch your drawing transform into a stunning video with Hollywood-grade camera work. Download and share instantly.",
                icon: <Sparkles className="w-12 h-12" />,
                gradient: "from-green-500 to-emerald-500", 
                features: ["5-second generation", "HD quality export", "One-click sharing"],
                bgGradient: "from-green-500/10 to-emerald-500/10"
              }
            ].map((step, index) => (
              <Card key={index} className={`relative bg-gradient-to-br ${step.bgGradient} border border-white/20 backdrop-blur-xl overflow-hidden group hover:scale-105 transition-all duration-700 shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{background: `linear-gradient(135deg, ${step.gradient.split(' ')[1]}, ${step.gradient.split(' ')[3]})`}}></div>
                <CardContent className="p-12 text-center relative z-10">
                  <div className={`w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {step.icon}
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-white/30 to-white/10 bg-clip-text text-transparent mb-6 leading-none">{step.step}</div>
                  <h3 className="text-3xl font-bold text-white mb-6">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-8 text-lg">{step.description}</p>
                  <div className="space-y-3">
                    {step.features.map((feature, i) => (
                      <div key={i} className="flex items-center justify-center space-x-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Zero Learning Curve",
                description: "No tutorials needed - pure intuition",
                icon: <Target className="w-8 h-8" />,
                color: "text-blue-400",
                bg: "from-blue-500/10 to-cyan-500/10"
              },
              {
                title: "Lightning Speed",
                description: "Professional videos in under 5 seconds",
                icon: <Zap className="w-8 h-8" />,
                color: "text-green-400",
                bg: "from-green-500/10 to-emerald-500/10"
              },
              {
                title: "Cinema Quality",
                description: "Hollywood-grade camera movements",
                icon: <Camera className="w-8 h-8" />,
                color: "text-purple-400",
                bg: "from-purple-500/10 to-pink-500/10"
              },
              {
                title: "Viral Optimized",
                description: "Perfect for TikTok, Instagram & YouTube",
                icon: <TrendingUp className="w-8 h-8" />,
                color: "text-pink-400",
                bg: "from-pink-500/10 to-red-500/10"
              }
            ].map((feature, index) => (
              <Card key={index} className={`bg-gradient-to-br ${feature.bg} border border-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-500 group shadow-xl`}>
                <CardContent className="p-10 text-center">
                  <div className={`w-18 h-18 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-white mb-4 text-xl">{feature.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Trusted by{" "}
              <span className="text-purple-400">500,000+ Creators</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the community of creators who've already transformed their content with DrawToVideo
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-24">
            {[
              {
                metric: "25M+",
                label: "Total Views Generated",
                description: "From user-created content",
                icon: <Eye className="w-6 h-6 text-blue-400" />
              },
              {
                metric: "96%",
                label: "Videos Go Viral",
                description: "Achieve 100K+ views",
                icon: <TrendingUp className="w-6 h-6 text-green-400" />
              },
              {
                metric: "3.2s",
                label: "Average Generation",
                description: "Fastest AI video creation",
                icon: <Timer className="w-6 h-6 text-purple-400" />
              },
              {
                metric: "4.9★",
                label: "Creator Rating",
                description: "Based on 50,000+ reviews",
                icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />
              }
            ].map((stat, index) => (
              <div key={index} className="text-center p-10 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.08] border border-white/20 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="flex justify-center mb-6">{stat.icon}</div>
                <div className="text-5xl font-bold text-white mb-3">{stat.metric}</div>
                <div className="text-xl font-semibold text-gray-300 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                text: "This is absolutely game-changing. I went from 50K to 2M followers in 6 weeks using DrawToVideo. The engagement rates are incredible!",
                author: "Sarah Chen",
                role: "TikTok Creator • 3.2M followers",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b67c?w=80&h=80&fit=crop&crop=face",
                verified: true
              },
              {
                text: "As a marketing agency, this tool has revolutionized our video production pipeline. We're delivering cinema-quality content in minutes, not days.",
                author: "Marcus Rodriguez", 
                role: "Creative Director • AdVibe Agency",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                verified: true
              },
              {
                text: "The ROI speaks for itself - 400% increase in video engagement since switching to DrawToVideo. This is the future of content creation.",
                author: "Emma Thompson",
                role: "Brand Manager • TechFlow Inc",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", 
                verified: true
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/20 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-500">
                <CardContent className="p-10">
                  <div className="flex items-center mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-10 leading-relaxed text-lg italic">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-16 h-16 rounded-full border-2 border-white/30"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-bold text-white text-lg">{testimonial.author}</div>
                        {testimonial.verified && (
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div className="text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-green-500/20 text-green-300 border-green-500/40 px-6 py-3 text-base">
              Simple Pricing
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Start Free, Scale as You{" "}
              <span className="text-green-400">Grow</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your creative journey. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "Forever",
                description: "Perfect for exploring the magic",
                features: [
                  "3 videos per day",
                  "720p HD quality",
                  "Basic camera effects",
                  "Community support",
                  "Download with watermark"
                ],
                popular: false,
                buttonText: "Start Free",
                buttonStyle: "bg-white/10 hover:bg-white/20 text-white border-2 border-white/30"
              },
              {
                name: "Creator",
                price: "$19",
                period: "per month",
                description: "For serious content creators",
                features: [
                  "Unlimited videos",
                  "4K ultra-HD quality", 
                  "50+ camera effects",
                  "No watermarks",
                  "Priority generation",
                  "Advanced templates",
                  "Email support",
                  "Analytics dashboard"
                ],
                popular: true,
                buttonText: "Start Creating",
                buttonStyle: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-purple-500/40"
              },
              {
                name: "Agency",
                price: "$99",
                period: "per month",
                description: "For teams and agencies",
                features: [
                  "Everything in Creator",
                  "Team collaboration",
                  "API access",
                  "Custom branding",
                  "Dedicated support",
                  "SLA guarantee",
                  "Custom effects",
                  "White-label solution"
                ],
                popular: false,
                buttonText: "Contact Sales",
                buttonStyle: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border-purple-500/40 scale-105 shadow-2xl shadow-purple-500/20' : 'bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-white/20'} backdrop-blur-xl overflow-hidden hover:scale-[1.02] transition-all duration-500`}>
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                )}
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-3 font-bold text-base">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-12 text-center relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-4">{plan.name}</h3>
                  <p className="text-gray-400 mb-10 text-lg">{plan.description}</p>
                  <div className="mb-10">
                    <span className="text-6xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-3 text-xl">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-12">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full h-14 font-bold text-lg ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Guarantee */}
          <div className="text-center mt-20">
            <div className="inline-flex items-center space-x-4 bg-green-500/10 border border-green-500/40 rounded-full px-8 py-4">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-green-300 font-semibold text-lg">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Maximum Impact */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 leading-tight">
            Ready to Create Your Next{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Viral Masterpiece?
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-blue-100 mb-16 max-w-4xl mx-auto leading-relaxed">
            Join 500,000+ creators who are already transforming their content with DrawToVideo
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-16 py-8 text-3xl h-auto font-bold shadow-2xl hover:scale-110 transition-all duration-500 group"
              onClick={() => window.location.href = '/create'}
            >
              <Wand2 className="w-8 h-8 mr-6 group-hover:rotate-12 transition-transform" />
              Start Creating Now
              <ArrowRight className="w-8 h-8 ml-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
          <div className="mt-12 text-blue-200 text-lg">
            <p className="flex items-center justify-center space-x-4">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span>No credit card required</span>
              <span className="mx-4">•</span>
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span>Start creating in 30 seconds</span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/10 bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">DrawToVideo</h3>
                  <p className="text-blue-400 font-medium">Transform Drawings into Viral Videos</p>
                </div>
              </div>
              <p className="text-gray-400 mb-10 max-w-md leading-relaxed text-lg">
                The world's most advanced AI video generation platform. 
                Transform your creativity into viral content with zero learning curve.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'Discord', 'YouTube', 'TikTok'].map((social) => (
                  <Button key={social} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    {social}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-8 text-xl">Product</h4>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-8 text-xl">Support</h4>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 DrawToVideo. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}