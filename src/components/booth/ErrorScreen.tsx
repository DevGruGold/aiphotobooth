import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Theme } from "@/data/themes";

interface ErrorScreenProps {
  theme: Theme;
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export function ErrorScreen({ theme, error, onRetry, onBack }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="booth-card max-w-md w-full p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="font-body text-muted-foreground mb-6">
          {error}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={onBack}
            size="lg"
            variant="outline"
            className="font-display"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Choose Different Theme
          </Button>
        </div>
      </div>
    </div>
  );
}
