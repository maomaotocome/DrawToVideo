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
  Infinity,
  ChevronDown,
  MousePointer2,
  Palette,
  Camera,
  Wand2
} from "lucide-react";

export default function PremiumLanding() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-black/30 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    DrawToVideo
                  </h1>
                  <p className="text-xs text-purple-400 font-medium">AI-Powered Studio</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">Features</a>
              <a href="#examples" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">Gallery</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">Pricing</a>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 border border-white/10">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25">
                Start Creating
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced Design */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin [animation-duration:60s]"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-white font-medium">Featured on Product Hunt #1</span>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                Live
              </Badge>
            </div>

            {/* Main Headline - Premium Typography */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tight">
              Draw to{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Video
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10"></div>
              </span>
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl text-gray-100 font-light">
                in <span className="text-green-400 font-bold">5 Seconds</span>
              </span>
            </h1>

            {/* Premium Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              The world's first <span className="text-white font-semibold">zero-prompt AI video generator</span>.
              <br />Create viral animations with professional camera movements by simply drawing paths.
            </p>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-20">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">250K+</div>
                <div className="text-sm text-gray-400 font-medium">Videos Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-1">2.8s</div>
                <div className="text-sm text-gray-400 font-medium">Average Generation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-1">98%</div>
                <div className="text-sm text-gray-400 font-medium">Viral Success Rate</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-2xl font-bold text-white ml-2">4.9</span>
                </div>
                <div className="text-sm text-gray-400 font-medium">User Rating</div>
              </div>
            </div>

            {/* Premium Upload Area */}
            <div className="max-w-3xl mx-auto mb-20">
              <div
                className={`
                  relative border-2 border-dashed rounded-3xl p-16 transition-all duration-500 cursor-pointer group
                  bg-gradient-to-br from-white/[0.03] via-white/[0.08] to-white/[0.03] backdrop-blur-xl
                  ${dragActive 
                    ? 'border-purple-400 bg-purple-500/10 shadow-2xl shadow-purple-500/25' 
                    : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Drop Your Image Here</h3>
                  <p className="text-gray-400 mb-8 text-lg">or click to browse • No registration required</p>
                  
                  {/* Enhanced Feature Pills */}
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {[
                      { icon: <Timer className="w-4 h-4" />, text: "5s Generation", color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300" },
                      { icon: <Shield className="w-4 h-4" />, text: "100% Private", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300" },
                      { icon: <Zap className="w-4 h-4" />, text: "No Prompts", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300" },
                      { icon: <Heart className="w-4 h-4" />, text: "Free Forever", color: "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-300" }
                    ].map((pill, index) => (
                      <div key={index} className={`inline-flex items-center space-x-2 bg-gradient-to-r ${pill.color} backdrop-blur-sm rounded-full px-4 py-2 border`}>
                        {pill.icon}
                        <span className="text-sm font-medium">{pill.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Supports: PNG, JPG, WebP up to 10MB • Optimized for viral content
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

            {/* Enhanced CTA Section */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-10 py-6 text-xl h-auto font-bold shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 group"
                onClick={() => window.location.href = '/create'}
              >
                <Rocket className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
                Start Creating Magic
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-10 py-6 text-xl h-auto font-semibold backdrop-blur-sm"
              >
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-medium">Trending #1 on TikTok</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="font-medium">50K+ creators daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Winner AI Tool 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <Badge className="mb-6 bg-purple-500/10 text-purple-300 border-purple-500/30 px-4 py-2">
              How It Works
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Three Clicks to{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Viral Fame
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary AI technology that understands your creative vision instantly
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 mb-24">
            {[
              {
                step: "01",
                title: "Upload & Inspire",
                description: "Drop any image - our AI instantly understands your vision and prepares the canvas",
                icon: <Upload className="w-10 h-10" />,
                gradient: "from-blue-500 to-cyan-500",
                features: ["Smart format detection", "Auto-optimization", "Instant preview"]
              },
              {
                step: "02",
                title: "Draw Your Vision",
                description: "Simply draw paths on your image - our AI translates your strokes into cinematic camera movements",
                icon: <MousePointer2 className="w-10 h-10" />,
                gradient: "from-purple-500 to-pink-500",
                features: ["50+ camera styles", "Real-time preview", "Path intelligence"]
              },
              {
                step: "03",
                title: "Generate & Share",
                description: "Watch your drawing transform into a professional video with Hollywood-grade camera work",
                icon: <Sparkles className="w-10 h-10" />,
                gradient: "from-green-500 to-emerald-500",
                features: ["5-second generation", "HD quality export", "One-click sharing"]
              }
            ].map((step, index) => (
              <Card key={index} className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-white/10 backdrop-blur-xl overflow-hidden group hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{background: `linear-gradient(135deg, ${step.gradient.split(' ')[1]}, ${step.gradient.split(' ')[3]})`}}></div>
                <CardContent className="p-10 text-center relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-white/20 to-white/10 bg-clip-text text-transparent mb-6">{step.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{step.description}</p>
                  <div className="space-y-2">
                    {step.features.map((feature, i) => (
                      <div key={i} className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Zero Learning Curve",
                description: "No tutorials, no manuals - pure intuition",
                icon: <Target className="w-8 h-8" />,
                color: "text-blue-400",
                bg: "from-blue-500/10 to-cyan-500/10"
              },
              {
                title: "Lightning Fast",
                description: "AI processing in under 5 seconds",
                icon: <Zap className="w-8 h-8" />,
                color: "text-green-400",
                bg: "from-green-500/10 to-emerald-500/10"
              },
              {
                title: "Cinema Quality",
                description: "Professional camera movements & effects",
                icon: <Camera className="w-8 h-8" />,
                color: "text-purple-400",
                bg: "from-purple-500/10 to-pink-500/10"
              },
              {
                title: "Viral Optimized",
                description: "Perfect for TikTok, Instagram, YouTube",
                icon: <TrendingUp className="w-8 h-8" />,
                color: "text-pink-400",
                bg: "from-pink-500/10 to-red-500/10"
              }
            ].map((feature, index) => (
              <Card key={index} className={`bg-gradient-to-br ${feature.bg} border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-white mb-3 text-lg">{feature.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powering the Next Generation of{" "}
              <span className="text-purple-400">Creators</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of creators who've already gone viral with DrawToVideo
            </p>
          </div>

          {/* Enhanced Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {[
              {
                metric: "10M+",
                label: "Video Views Generated",
                description: "Total views from user-created content",
                icon: <Eye className="w-6 h-6 text-blue-400" />
              },
              {
                metric: "94%",
                label: "Go Viral",
                description: "Videos that achieve viral status",
                icon: <TrendingUp className="w-6 h-6 text-green-400" />
              },
              {
                metric: "2.8s",
                label: "Average Generation",
                description: "Fastest AI video creation",
                icon: <Timer className="w-6 h-6 text-purple-400" />
              },
              {
                metric: "4.9★",
                label: "Creator Rating",
                description: "Based on 12,000+ reviews",
                icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />
              }
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.08] border border-white/10 backdrop-blur-sm">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.metric}</div>
                <div className="text-lg font-semibold text-gray-300 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Premium Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "This is absolutely revolutionary. I went from 10K to 1M followers in just 3 weeks using DrawToVideo. My engagement rates are through the roof!",
                author: "Sarah Chen",
                role: "TikTok Creator • 2.4M followers",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b67c?w=64&h=64&fit=crop&crop=face",
                verified: true
              },
              {
                text: "As a marketing agency, this tool has transformed our video production. We're delivering cinematic quality content in minutes, not days.",
                author: "Marcus Rodriguez",
                role: "Creative Director • AdVibe Agency",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
                verified: true
              },
              {
                text: "The results speak for themselves - 250% increase in video engagement since switching to DrawToVideo. This is the future of content creation.",
                author: "Emma Thompson",
                role: "Brand Manager • TechFlow",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
                verified: true
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border-white/10 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-semibold text-white">{testimonial.author}</div>
                        {testimonial.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-green-500/10 text-green-300 border-green-500/30 px-4 py-2">
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Free, Scale as You{" "}
              <span className="text-green-400">Grow</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your creative journey
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                period: "Forever Free",
                description: "Perfect for trying out the magic",
                features: [
                  "3 videos per day",
                  "720p HD quality",
                  "10 camera effects",
                  "Community support",
                  "Basic templates"
                ],
                popular: false,
                buttonText: "Start Free",
                buttonStyle: "bg-white/10 hover:bg-white/20 text-white border border-white/20"
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
                buttonStyle: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-purple-500/25"
              },
              {
                name: "Studio",
                price: "$99",
                period: "per month",
                description: "For agencies and teams",
                features: [
                  "Everything in Creator",
                  "Team collaboration",
                  "API access",
                  "Custom branding",
                  "Dedicated support",
                  "SLA guarantee",
                  "Custom effects",
                  "White-label option"
                ],
                popular: false,
                buttonText: "Contact Sales",
                buttonStyle: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border-purple-500/30 scale-105' : 'bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-white/10'} backdrop-blur-xl overflow-hidden`}>
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                )}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 font-bold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-10 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-8">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full h-12 font-semibold ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Money-back guarantee */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-3 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Create Your Next{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Viral Hit?
            </span>
          </h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join 250,000+ creators who are already making magic with DrawToVideo
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-2xl h-auto font-bold shadow-2xl hover:scale-105 transition-all duration-300 group"
              onClick={() => window.location.href = '/create'}
            >
              <Wand2 className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
              Start Creating Now
              <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-12 py-6 text-2xl h-auto font-bold backdrop-blur-sm"
            >
              <Play className="w-7 h-7 mr-4" />
              Watch Magic Happen
            </Button>
          </div>
          <div className="mt-12 text-blue-200">
            <p className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>No credit card required</span>
              <span className="mx-2">•</span>
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Start creating in 30 seconds</span>
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-20 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">DrawToVideo</h3>
                  <p className="text-sm text-purple-400 font-medium">AI-Powered Video Magic</p>
                </div>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                The world's most advanced AI video generation platform. 
                Transform your creativity into viral content with zero learning curve.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'Discord', 'YouTube', 'TikTok'].map((social) => (
                  <Button key={social} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    {social}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 DrawToVideo. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}