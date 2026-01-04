import { useState } from "react";
import { ArrowLeft, Download, RefreshCw, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Theme } from "@/data/themes";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
interface ResultScreenProps {
  theme: Theme;
  originalPhoto: string;
  transformedPhoto: string;
  onStartOver: () => void;
  onTryAnother: () => void;
}

type ViewMode = "transformed" | "comparison";

export function ResultScreen({
  theme,
  originalPhoto,
  transformedPhoto,
  onStartOver,
  onTryAnother,
}: ResultScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("transformed");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      // Extract base64 data and convert to blob
      const base64Data = transformedPhoto.split(',')[1];
      const mimeType = transformedPhoto.split(':')[1]?.split(';')[0] || 'image/png';
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `party-favor-${theme.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      // Convert base64 to blob for sharing
      const base64Data = transformedPhoto.split(',')[1];
      const mimeType = transformedPhoto.split(':')[1]?.split(';')[0] || 'image/png';
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], `party-favor-${theme.id}.png`, { type: mimeType });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My ${theme.name} Photo`,
          text: `Check out my ${theme.name} transformation!`,
          files: [file],
        });
      } else if (navigator.share) {
        // Fallback without file sharing
        await navigator.share({
          title: `My ${theme.name} Photo`,
          text: `Check out my ${theme.name} transformation!`,
        });
      } else {
        // Fallback: copy to clipboard notification
        toast({
          title: "Sharing not supported",
          description: "Download the image and share it manually.",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Share failed:", error);
        toast({
          title: "Share failed",
          description: "Please try downloading and sharing manually.",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onStartOver}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground">
              Your Transformation
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {theme.icon} {theme.name}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-6">
        <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
          {/* View Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-muted rounded-full p-1">
              <button
                onClick={() => setViewMode("transformed")}
                className={cn(
                  "px-4 py-2 rounded-full font-body text-sm transition-colors",
                  viewMode === "transformed"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Result
              </button>
              <button
                onClick={() => setViewMode("comparison")}
                className={cn(
                  "px-4 py-2 rounded-full font-body text-sm transition-colors",
                  viewMode === "comparison"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Before & After
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="flex-1 animate-scale-in">
            {viewMode === "transformed" ? (
              <div className="booth-card overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <img
                    src={transformedPhoto}
                    alt="Transformed photo"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="booth-card overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    <img
                      src={originalPhoto}
                      alt="Original photo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <span className="font-body text-xs text-muted-foreground">Before</span>
                  </div>
                </div>
                <div className="booth-card overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    <img
                      src={transformedPhoto}
                      alt="Transformed photo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <span className="font-body text-xs text-muted-foreground">After</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-display py-6"
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </>
                )}
              </Button>
              <Button
                onClick={handleShare}
                size="lg"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-display py-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onTryAnother}
                size="lg"
                variant="outline"
                className="flex-1 font-display py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Another Theme
              </Button>
              <Button
                onClick={onStartOver}
                size="lg"
                variant="ghost"
                className="flex-1 font-display py-6"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
