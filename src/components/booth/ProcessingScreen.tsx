import { Theme } from "@/data/themes";
import { useEffect, useState } from "react";

interface ProcessingScreenProps {
  theme: Theme;
}

const funMessages = [
  "Sprinkling some magic dust...",
  "Applying transformations...",
  "Adding the finishing touches...",
  "Almost there...",
  "Creating your masterpiece...",
];

export function ProcessingScreen({ theme }: ProcessingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen booth-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/15 rounded-full animate-float" style={{ animationDelay: "0.7s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: "1.4s" }} />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto animate-fade-in">
        {/* Theme icon */}
        <div className="text-8xl mb-8 animate-bounce-in">
          {theme.icon}
        </div>

        {/* Loading spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin" />
        </div>

        {/* Messages */}
        <h2 className="font-display text-2xl font-bold text-white mb-4 drop-shadow-lg">
          Creating Your {theme.name}
        </h2>
        
        <p className="font-body text-white/80 text-lg animate-fade-in" key={messageIndex}>
          {funMessages[messageIndex]} ✨
        </p>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-6 text-center text-white/60 font-body text-sm">
        Party Favor Photo
      </div>
    </div>
  );
}
