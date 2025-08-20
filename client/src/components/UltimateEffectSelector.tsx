import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, RotateCcw, ArrowUp, Sparkles, Eye, Target, Rocket, Waves } from "lucide-react";

// 🎬 电影级效果选择器 - 超越Higgsfield
const ULTIMATE_EFFECTS = [
  {
    id: 'zoom_in',
    name: 'Zoom In',
    description: 'Camera pushes forward - perfect for product reveals',
    icon: Target,
    difficulty: 'Beginner',
    socialPlatform: 'Universal',
    color: 'bg-blue-500',
    quality: 'Cinema Grade'
  },
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'Smooth 360° rotation around subject',
    icon: RotateCcw,
    difficulty: 'Beginner', 
    socialPlatform: 'Instagram',
    color: 'bg-green-500',
    quality: 'Professional'
  },
  {
    id: 'pull_back',
    name: 'Pull Back',
    description: 'Dramatic reveal of the bigger picture',
    icon: ArrowUp,
    difficulty: 'Intermediate',
    socialPlatform: 'YouTube',
    color: 'bg-purple-500',
    quality: 'Cinematic'
  },
  {
    id: 'dramatic_spiral',
    name: 'Dramatic Spiral',
    description: 'Viral spiral zoom with speed effects',
    icon: Sparkles,
    difficulty: 'Advanced',
    socialPlatform: 'TikTok',
    color: 'bg-pink-500',
    quality: 'Viral Optimized',
    isNew: true
  },
  {
    id: 'vertigo_effect',
    name: 'Vertigo (Hitchcock)',
    description: 'Push in while zoom out - mind-bending effect',
    icon: Eye,
    difficulty: 'Master',
    socialPlatform: 'Cinematic',
    color: 'bg-red-500',
    quality: 'Master Class',
    isPremium: true
  },
  {
    id: 'bullet_time',
    name: 'Bullet Time',
    description: 'Matrix-style 360° freeze effect',
    icon: Zap,
    difficulty: 'Expert',
    socialPlatform: 'Action',
    color: 'bg-yellow-500',
    quality: 'Blockbuster',
    isPremium: true
  },
  {
    id: 'crash_zoom',
    name: 'Crash Zoom',
    description: 'Rapid aggressive zoom for impact moments',
    icon: Rocket,
    difficulty: 'Intermediate',
    socialPlatform: 'TikTok',
    color: 'bg-orange-500',
    quality: 'Action Movie'
  },
  {
    id: 'floating_follow',
    name: 'Floating Follow',
    description: 'Dreamy organic camera movement',
    icon: Waves,
    difficulty: 'Advanced',
    socialPlatform: 'Instagram',
    color: 'bg-teal-500',
    quality: 'Ethereal'
  }
];

interface UltimateEffectSelectorProps {
  selectedEffect: string;
  onEffectChange: (effect: string) => void;
  userPlan?: 'free' | 'pro' | 'master';
}

export function UltimateEffectSelector({ 
  selectedEffect, 
  onEffectChange, 
  userPlan = 'free' 
}: UltimateEffectSelectorProps) {
  
  const canUseEffect = (effect: any) => {
    if (!effect.isPremium) return true;
    return userPlan === 'pro' || userPlan === 'master';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          🎬 Cinema-Grade Effects
        </h2>
        <p className="text-muted-foreground">
          Professional camera movements that exceed Higgsfield quality
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {ULTIMATE_EFFECTS.map((effect) => {
          const IconComponent = effect.icon;
          const isSelected = selectedEffect === effect.id;
          const isDisabled = !canUseEffect(effect);
          
          return (
            <Card 
              key={effect.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 touch-manipulation ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              } ${isDisabled ? 'opacity-50' : ''}`}
              onClick={() => !isDisabled && onEffectChange(effect.id)}
            >
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className={`${effect.color} p-1.5 sm:p-2 rounded-lg`}>
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex gap-1">
                    {effect.isNew && (
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-400 to-blue-500">
                        NEW
                      </Badge>
                    )}
                    {effect.isPremium && (
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500">
                        PRO
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-base sm:text-lg">{effect.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">
                  {effect.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        effect.difficulty === 'Beginner' ? 'border-green-400 text-green-600' :
                        effect.difficulty === 'Intermediate' ? 'border-yellow-400 text-yellow-600' :
                        effect.difficulty === 'Advanced' ? 'border-orange-400 text-orange-600' :
                        'border-red-400 text-red-600'
                      }`}
                    >
                      {effect.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="font-medium">{effect.socialPlatform}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Quality:</span>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {effect.quality}
                    </span>
                  </div>
                </div>

                {isDisabled && (
                  <div className="mt-2 sm:mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none hover:from-yellow-500 hover:to-orange-600 touch-manipulation"
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedEffect && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium">
              Selected: <span className="text-primary">{ULTIMATE_EFFECTS.find(e => e.id === selectedEffect)?.name}</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-6">
            Draw your path to create professional {ULTIMATE_EFFECTS.find(e => e.id === selectedEffect)?.quality.toLowerCase()} camera movement
          </p>
        </div>
      )}
    </div>
  );
}