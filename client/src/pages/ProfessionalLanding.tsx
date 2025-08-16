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
  Globe,
  Sparkles,
  Video,
  MousePointer,
  Timer,
  Download,
  Award,
  Target,
  BarChart3,
  Shield,
  Rocket,
  Eye,
  Heart,
  Infinity,
  ChevronDown
} from "lucide-react";

export default function ProfessionalLanding() {
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

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Navigate to canvas with image
        window.location.href = `/create?image=${encodeURIComponent(e.target?.result as string)}`;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">DrawToVideo</h1>
                  <p className="text-xs text-gray-400">AI-Powered</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm">Features</a>
              <a href="#examples" className="text-gray-300 hover:text-white transition-colors text-sm">Examples</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">Pricing</a>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 mb-8">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">世界首款零提示词视频生成工具</span>
              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                New
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Draw to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Video
              </span>
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl text-gray-300">
                Transform Sketches into Viral Videos
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create professional camera movements and cinematic effects with just a few strokes. 
              No prompts, no learning curve—just <span className="text-blue-400 font-semibold">draw and generate</span>.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Videos Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5 sec</div>
                <div className="text-sm text-gray-400">Generation Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Camera Effects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-sm text-gray-400">User Rating</div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="max-w-2xl mx-auto mb-16">
              <div
                className={`
                  relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer
                  bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm
                  ${dragActive 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Upload Your Image</h3>
                  <p className="text-gray-400 mb-6 text-lg">Drop an image here or click to browse</p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
                    <span className="bg-gray-800/50 px-3 py-1 rounded-full">PNG, JPG up to 10MB</span>
                    <span className="bg-gray-800/50 px-3 py-1 rounded-full">Instant processing</span>
                    <span className="bg-gray-800/50 px-3 py-1 rounded-full">No signup required</span>
                  </div>
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

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg h-auto"
                onClick={() => window.location.href = '/create'}
              >
                <Play className="w-5 h-5 mr-2" />
                Try Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg h-auto"
              >
                <Video className="w-5 h-5 mr-2" />
                View Examples
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>Featured on Product Hunt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Loved by 10K+ creators</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trending on TikTok</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              从画线到<span className="text-blue-400">病毒视频</span>，仅需3步
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              无需复杂的提示词或视频编辑技能。只要会画线，就能创作专业级视频。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                step: "01",
                title: "Upload Image",
                description: "上传您的图片或选择我们的高质量模板",
                icon: <Upload className="w-8 h-8" />,
                color: "from-blue-400 to-cyan-400"
              },
              {
                step: "02",
                title: "Draw Path",
                description: "在画布上绘制运动路径，定义相机运动轨迹",
                icon: <MousePointer className="w-8 h-8" />,
                color: "from-purple-400 to-pink-400"
              },
              {
                step: "03",
                title: "Generate Video",
                description: "AI自动生成电影级运镜效果，5秒内完成",
                icon: <Sparkles className="w-8 h-8" />,
                color: "from-green-400 to-emerald-400"
              }
            ].map((step, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white`}>
                    {step.icon}
                  </div>
                  <div className="text-6xl font-bold text-blue-400 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "零提示词",
                description: "纯视觉操作，无需文字描述",
                icon: <Target className="w-6 h-6" />,
                color: "text-blue-400"
              },
              {
                title: "5秒生成",
                description: "闪电般的AI处理速度",
                icon: <Timer className="w-6 h-6" />,
                color: "text-green-400"
              },
              {
                title: "50+ 运镜",
                description: "专业电影级相机效果",
                icon: <Video className="w-6 h-6" />,
                color: "text-purple-400"
              },
              {
                title: "一键下载",
                description: "高清MP4格式，即时分享",
                icon: <Download className="w-6 h-6" />,
                color: "text-pink-400"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              全球创作者的首选工具
            </h2>
            <p className="text-lg text-gray-300">
              已有数万名TikTok、Instagram创作者使用我们的工具创作病毒视频
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                metric: "1M+",
                label: "视频播放量",
                description: "用户创作的视频总播放量"
              },
              {
                metric: "85%",
                label: "病毒传播率",
                description: "用户视频获得病毒式传播的比例"
              },
              {
                metric: "4.9/5",
                label: "用户评分",
                description: "基于5000+真实用户评价"
              }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{stat.metric}</div>
                <div className="text-xl font-semibold text-blue-400 mb-2">{stat.label}</div>
                <div className="text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                text: "这工具太神奇了！我画一条线就能生成电影级的运镜效果，我的TikTok视频播放量增长了500%！",
                author: "小红",
                role: "TikTok创作者",
                avatar: "👩"
              },
              {
                text: "作为营销人员，这个工具帮我们节省了大量的视频制作时间。客户看到效果后都惊呆了。",
                author: "David Chen",
                role: "数字营销专家",
                avatar: "👨"
              },
              {
                text: "比Higgsfield更简单易用，而且还免费！现在我的产品展示视频都用这个工具制作。",
                author: "Lisa Wang",
                role: "电商店主",
                avatar: "👩‍💼"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              选择适合您的方案
            </h2>
            <p className="text-lg text-gray-300">
              从免费开始，随时升级解锁更多专业功能
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "免费版",
                price: "$0",
                period: "永久免费",
                features: [
                  "每天3个视频",
                  "720p分辨率",
                  "基础运镜效果",
                  "社区支持"
                ],
                popular: false,
                buttonText: "免费开始"
              },
              {
                name: "专业版",
                price: "$9.99",
                period: "每月",
                features: [
                  "无限视频生成",
                  "4K超高清分辨率",
                  "50+专业运镜效果",
                  "无水印导出",
                  "优先处理队列",
                  "邮件支持"
                ],
                popular: true,
                buttonText: "立即升级"
              },
              {
                name: "企业版",
                price: "$49.99",
                period: "每月",
                features: [
                  "专业版全部功能",
                  "团队协作",
                  "API接入",
                  "自定义品牌",
                  "专属客户经理",
                  "SLA保障"
                ],
                popular: false,
                buttonText: "联系销售"
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50' : 'bg-white/5 border-white/10'} backdrop-blur-sm`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                      最受欢迎
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-white/10 hover:bg-white/20'} text-white`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备好创造病毒视频了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            加入全球数万名创作者，开始您的AI视频创作之旅
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg h-auto font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              免费开始创作
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg h-auto"
            >
              观看演示视频
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">DrawToVideo</h3>
                  <p className="text-xs text-gray-400">AI-Powered Video Creator</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                全球首款零提示词AI视频生成工具，让每个人都能轻松创作专业级视频内容。
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Discord
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  YouTube
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">功能特性</a></li>
                <li><a href="#" className="hover:text-white transition-colors">价格方案</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors">更新日志</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">支持</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">教程指南</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">状态页面</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 DrawToVideo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">隐私政策</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">服务条款</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}