import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, Video, Sparkles } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "generation" | "exit" | "limit" | "feature";
  onUpgrade?: (plan: string) => void;
}

const plans = {
  pro: {
    name: "Pro",
    price: 17.4,
    originalPrice: 29,
    credits: 600,
    concurrent: 3,
    features: [
      "600 credits/month",
      "3 concurrent generations",
      "All camera effects",
      "HD video quality",
      "Priority processing",
      "Commercial license"
    ]
  },
  ultimate: {
    name: "Ultimate", 
    price: 29.4,
    originalPrice: 49,
    credits: 1200,
    concurrent: 4,
    features: [
      "1200 credits/month",
      "4 concurrent generations",
      "All premium effects",
      "4K video quality",
      "Instant processing",
      "Advanced editing tools",
      "API access",
      "White-label options"
    ]
  }
};

export function SubscriptionModal({ isOpen, onClose, trigger = "generation", onUpgrade }: SubscriptionModalProps) {
  // 强制允许用户关闭模态框
  const handleClose = () => {
    console.log('User closing subscription modal');
    onClose();
  };
  const getTriggerContent = () => {
    switch (trigger) {
      case "generation":
        return {
          title: "UPGRADE REQUIRED",
          subtitle: "Unlock Professional Video Generation",
          description: "Create unlimited cinema-quality videos with advanced AI effects. Join 50,000+ creators making viral content.",
          videoSample: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        };
      case "exit":
        return {
          title: "WAIT! DON'T MISS OUT",
          subtitle: "Special Limited Offer - 40% OFF",
          description: "Get unlimited video generations before this deal expires. Transform your content creation forever.",
          videoSample: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop"
        };
      case "limit":
        return {
          title: "MONTHLY LIMIT REACHED",
          subtitle: "Continue Creating Without Limits",
          description: "You've reached your free monthly limit. Upgrade to keep creating professional videos.",
          videoSample: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop"
        };
      default:
        return {
          title: "UNLOCK PRO FEATURES",
          subtitle: "Advanced AI Video Generation",
          description: "Access professional tools used by content creators worldwide.",
          videoSample: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
        };
    }
  };

  const content = getTriggerContent();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 bg-black text-white border-gray-800">
        <DialogHeader className="sr-only">
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/20 rounded-full p-2 backdrop-blur-sm"
          aria-label="Close subscription modal"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Video Demo */}
          <div className="lg:w-1/2 p-8 bg-gradient-to-br from-purple-900 to-pink-900">
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge className="bg-pink-500 text-white px-3 py-1">
                  UNLIMITED
                </Badge>
                <h2 className="text-3xl font-bold">{content.subtitle}</h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  {content.description}
                </p>
              </div>
              
              {/* Video Sample */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-1">
                <div className="bg-black rounded-xl overflow-hidden">
                  <img
                    src={content.videoSample}
                    alt="Video Sample"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">8+ Professional Camera Effects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">4K Export Quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Commercial License Included</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Pricing Plans */}
          <div className="lg:w-1/2 p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{content.title}</h3>
                <p className="text-gray-400">Choose your plan and start creating</p>
                
                {/* Annual/Monthly Toggle */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="text-sm">Monthly</span>
                  <div className="relative">
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Annual</span>
                    <Badge className="bg-green-500 text-xs">SAVE 40%</Badge>
                  </div>
                </div>
              </div>
              
              {/* Pricing Cards */}
              <div className="space-y-4">
                {/* Pro Plan */}
                <div className="relative border border-green-500 rounded-lg p-6 bg-gradient-to-r from-green-900/20 to-green-800/20">
                  <Badge className="absolute -top-2 left-6 bg-green-500 text-black font-bold">
                    TOP CHOICE
                  </Badge>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-green-400">Pro</h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-pink-400 text-lg line-through">${plans.pro.originalPrice}</span>
                        <span className="text-3xl font-bold">${plans.pro.price}/mo</span>
                      </div>
                      <p className="text-gray-400 text-sm">Billed annually</p>
                    </div>
                    
                    <AnimatedButton
                      onClick={() => onUpgrade?.('pro')}
                      className="w-full bg-green-500 hover:bg-green-400 text-black font-bold"
                      size="lg"
                    >
                      Select Plan
                    </AnimatedButton>
                    
                    <div className="space-y-2">
                      {plans.pro.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Ultimate Plan */}
                <div className="border border-gray-600 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold">Ultimate</h4>
                        <Crown className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-pink-400 text-lg line-through">${plans.ultimate.originalPrice}</span>
                        <span className="text-3xl font-bold">${plans.ultimate.price}/mo</span>
                      </div>
                      <p className="text-gray-400 text-sm">Billed annually</p>
                    </div>
                    
                    <Button
                      onClick={() => onUpgrade?.('ultimate')}
                      variant="outline"
                      className="w-full border-gray-600 hover:bg-gray-800"
                      size="lg"
                    >
                      Select Plan
                    </Button>
                    
                    <div className="space-y-2">
                      {plans.ultimate.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="text-center text-sm text-gray-400">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span>🔒 Secure Payment</span>
                  <span>💳 Cancel Anytime</span>
                  <span>⚡ Instant Access</span>
                </div>
                <p>Join 50,000+ creators making viral content with AI</p>
              </div>
            </div>
            
            {/* 用户可以选择不升级的按钮 */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white text-sm transition-colors underline"
              >
                Continue with Free Plan
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}