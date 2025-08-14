import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { PhotoCanvas } from "@/components/PhotoCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { UploadResult } from "@uppy/core";
import { Play, Video, ArrowRight, Target, Type, Smartphone, FileVideo, Clock } from "lucide-react";

export default function Home() {
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const { toast } = useToast();

  const createProjectMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await apiRequest("POST", "/api/projects", {
        originalImageUrl: imageUrl,
        annotations: {},
      });
      return response.json();
    },
    onSuccess: (project) => {
      setCurrentProject(project.id);
      setShowCanvas(true);
      toast({
        title: "Project created!",
        description: "You can now start drawing on your photo.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/images/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const imageUrl = uploadedFile.uploadURL;
      createProjectMutation.mutate(imageUrl);
    }
  };

  const handleStartOver = () => {
    setCurrentProject(null);
    setShowCanvas(false);
  };

  if (showCanvas && currentProject) {
    return <PhotoCanvas projectId={currentProject} onStartOver={handleStartOver} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">DrawToVideo</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#features" className="text-slate-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors">How it Works</a>
              <a href="#examples" className="text-slate-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Examples</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-text mb-6">
            Draw to Video: Turn Your <span className="text-primary">Photos</span> into <span className="text-secondary">Animated Videos</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Upload any photo, draw arrows for movement, add text instructions, and watch your image come to life. No complex prompting needed - just draw what you want to happen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={10485760}
              onGetUploadParameters={handleGetUploadParameters}
              onComplete={handleUploadComplete}
              buttonClassName="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <Play className="w-5 h-5 mr-2" />
              Try It Now - Free
            </ObjectUploader>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              <Video className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Demo Visual */}
          <div className="relative max-w-4xl mx-auto">
            <Card className="shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800" 
                    alt="Professional woman in business attire" 
                    className="w-full h-auto" 
                  />
                  
                  {/* Annotation Examples */}
                  <div className="absolute inset-0">
                    <svg className="absolute top-1/3 left-1/4 w-32 h-16" viewBox="0 0 128 64">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#F59E0B" />
                        </marker>
                      </defs>
                      <line x1="10" y1="32" x2="110" y2="20" stroke="#F59E0B" strokeWidth="4" markerEnd="url(#arrowhead)" />
                    </svg>
                    
                    <div className="absolute top-1/4 right-1/4 bg-accent text-white px-3 py-2 rounded-lg font-semibold text-sm">
                      "walks forward confidently"
                    </div>
                    
                    <div className="absolute bottom-1/3 left-1/3 w-20 h-20 border-4 border-secondary rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-text mb-4">
              How It Works - <span className="text-primary">Simple as 1-2-3</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform any photo into an animated video in three easy steps. No video editing experience required.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-text mb-4">Upload Your Photo</h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop any photo or image. Works with portraits, products, scenes - anything you want to animate.
              </p>
              <Card className="border-2 border-dashed border-muted">
                <CardContent className="pt-6">
                  <div className="text-4xl text-muted-foreground mb-4">📁</div>
                  <p className="text-muted-foreground">Drop your image here</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-text mb-4">Draw Your Instructions</h3>
              <p className="text-muted-foreground mb-6">
                Draw arrows for movement, circle objects to animate, add text for specific actions. It's like being a director!
              </p>
              <Card>
                <CardContent className="pt-6 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200" 
                    alt="Creative workspace" 
                    className="rounded-lg w-full h-32 object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      "zoom in"
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-text mb-4">Generate & Download</h3>
              <p className="text-muted-foreground mb-6">
                Click generate and watch your photo come to life! Download your video instantly in HD quality.
              </p>
              <Card className="bg-secondary/5">
                <CardContent className="pt-6">
                  <Button className="bg-secondary text-white hover:bg-secondary/90">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">MP4 • HD Quality • 10 seconds</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-text mb-4">
              Powerful Features for <span className="text-primary">Creative Control</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to bring your photos to life with professional-quality animations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-primary/5 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="text-primary mb-4">
                  <ArrowRight className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-text mb-3">Motion Control</h3>
                <p className="text-muted-foreground">Draw arrows to define exactly how objects should move. Control speed, direction, and path with simple gestures.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/5 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="text-secondary mb-4">
                  <Target className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-text mb-3">Object Targeting</h3>
                <p className="text-muted-foreground">Circle or highlight specific objects to animate them precisely. Perfect for product showcases and character animations.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-accent/5 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="text-accent mb-4">
                  <Type className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-text mb-3">Text Instructions</h3>
                <p className="text-muted-foreground">Add context with text annotations. Describe emotions, actions, or camera movements directly on the image.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="text-primary mb-4">
                  <Smartphone className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-text mb-3">Mobile Optimized</h3>
                <p className="text-muted-foreground">Works perfectly on smartphones and tablets with touch-friendly drawing controls. Create anywhere, anytime.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/5 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="text-secondary mb-4">
                  <FileVideo className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-text mb-3">HD Quality Output</h3>
                <p className="text-muted-foreground">Generate videos in crisp 1080p HD quality. Professional results ready for social media or presentations.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-accent/5 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="text-accent mb-4">
                  <Clock className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-text mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">Get your animated video in seconds, not minutes. Our optimized AI processes your instructions instantly.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section id="examples" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-text mb-4">
              See What's <span className="text-primary">Possible</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real examples created with our draw-to-video tool
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="Person running in park" 
                className="w-full h-48 object-cover" 
              />
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-slate-text mb-2">Running Animation</h3>
                <p className="text-muted-foreground text-sm mb-4">Added arrow for forward motion + "energetic pace" text</p>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Motion Control</span>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="Coffee cup on table" 
                className="w-full h-48 object-cover" 
              />
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-slate-text mb-2">Product Showcase</h3>
                <p className="text-muted-foreground text-sm mb-4">Circled cup + "steam rises" + zoom in arrow</p>
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Object Focus</span>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="Business presentation" 
                className="w-full h-48 object-cover" 
              />
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-slate-text mb-2">Presentation Video</h3>
                <p className="text-muted-foreground text-sm mb-4">Hand gesture animation + "confident explanation"</p>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">Text Cues</span>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={10485760}
              onGetUploadParameters={handleGetUploadParameters}
              onComplete={handleUploadComplete}
              buttonClassName="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Create Your Own Video
            </ObjectUploader>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Bring Your Photos to Life?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join thousands of creators using DrawToVideo to make stunning animated content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={10485760}
              onGetUploadParameters={handleGetUploadParameters}
              onComplete={handleUploadComplete}
              buttonClassName="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Creating - Free
            </ObjectUploader>
            <p className="text-white/80">No signup required • Instant results</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-text text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">DrawToVideo</h3>
              <p className="text-gray-300 mb-4">
                Transform any photo into an animated video with simple drawing instructions. 
                No complex prompts, no video editing skills required.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 DrawToVideo. All rights reserved. • Made for creators who dream in motion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
