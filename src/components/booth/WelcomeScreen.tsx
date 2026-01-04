import { Images, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenGallery: () => void;
  photoCount: number;
}

export function WelcomeScreen({ onStart, onOpenGallery, photoCount }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 booth-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-32 right-16 w-12 h-12 bg-white/15 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto animate-fade-in">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-2xl mb-6 booth-glow">
            <span className="text-5xl">📸</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Party Favor Photo
          </h1>
          <p className="font-body text-white/90 text-lg">
            AI Photo Booth
          </p>
        </div>

        {/* Description */}
        <p className="font-body text-white/80 text-lg mb-10 leading-relaxed">
          Transform your photos with AI magic! ✨
          <br />
          Choose from themed styles and watch
          <br />
          your photo come to life.
        </p>

        {/* Start Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="bg-white text-primary hover:bg-white/90 font-display text-xl px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 pulse-glow"
        >
          <Sparkles className="w-6 h-6 mr-2" />
          Get Started
        </Button>

        {/* Gallery Button */}
        {photoCount > 0 && (
          <Button
            onClick={onOpenGallery}
            variant="ghost"
            size="lg"
            className="mt-4 text-white/90 hover:text-white hover:bg-white/10 font-display"
          >
            <Images className="w-5 h-5 mr-2" />
            My Gallery ({photoCount})
          </Button>
        )}
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-6 text-center text-white/60 font-body text-sm">
        Powered by AI ✨
      </div>
    </div>
  );
}
