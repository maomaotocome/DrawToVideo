import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Sparkles, Crown, Play, Upload, MousePointer } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { FadeIn } from "@/components/ui/fade-in";

interface AuthGateProps {
  onLogin: () => void;
}

export function AuthGate({ onLogin }: AuthGateProps) {
  const videoSamples = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop", 
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&h=400&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Video Demo */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]"></div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <FadeIn direction="down" delay={0}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  DRAW TO VIDEO
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Your sketch turns into a cinema in a second. No prompt needed.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>50,000+ creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>5-second generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Cinema quality</span>
                </div>
              </div>
            </div>
          </FadeIn>
          
          {/* Hero Video Preview */}
          <FadeIn direction="up" delay={0.2}>
            <div className="relative max-w-3xl mx-auto mb-12">
              <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-1">
                <div className="bg-black rounded-xl overflow-hidden">
                  <img
                    src={videoSamples[0]}
                    alt="Draw to Video Demo"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 hover:bg-white/20 transition-colors cursor-pointer">
                      <Play className="w-12 h-12 text-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MousePointer className="w-5 h-5 text-white" />
                        <span className="text-sm text-white">Draw camera movement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 text-black text-xs">
                          ✨ AI Generated
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          {/* CTA Section */}
          <FadeIn direction="up" delay={0.4}>
            <Card className="max-w-md mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  
                  {/* Primary CTA */}
                  <AnimatedButton
                    onClick={onLogin}
                    size="lg"
                    className="w-full bg-white text-black hover:bg-gray-100 font-bold text-lg py-6"
                    scaleOnHover={true}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Media
                  </AnimatedButton>
                  
                  {/* Secondary CTA */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-gray-600 bg-transparent text-gray-900 dark:text-white hover:bg-gray-800 hover:text-white"
                    onClick={onLogin}
                  >
                    <MousePointer className="w-5 h-5 mr-2" />
                    Create blank
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400">
                    Sign in with Google to start creating
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
          
          {/* Feature Grid */}
          <FadeIn direction="up" delay={0.6}>
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                  <MousePointer className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Choose motion</h3>
                <p className="text-gray-400">Select a Motion to define how your image will move</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Add image</h3>
                <p className="text-gray-400">Upload or generate an image to start your animation</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Get video</h3>
                <p className="text-gray-400">Click generate to create your final animated video!</p>
              </div>
              
            </div>
          </FadeIn>
          
          {/* Testimonials/Social Proof */}
          <FadeIn direction="up" delay={0.8}>
            <div className="mt-16 text-center">
              <p className="text-gray-400 mb-6">Trusted by content creators worldwide</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <span className="text-2xl font-bold">TikTok</span>
                <span className="text-2xl font-bold">Instagram</span>
                <span className="text-2xl font-bold">YouTube</span>
                <span className="text-2xl font-bold">Twitter</span>
              </div>
            </div>
          </FadeIn>
          
        </div>
      </div>
    </div>
  );
}