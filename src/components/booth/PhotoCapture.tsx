import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, Camera, Upload, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Theme } from "@/data/themes";
import { useCamera } from "@/hooks/useCamera";
import { cn } from "@/lib/utils";

interface PhotoCaptureProps {
  theme: Theme;
  onCapture: (imageBase64: string) => void;
  onBack: () => void;
}

type CaptureMode = "select" | "camera" | "preview";

export function PhotoCapture({ theme, onCapture, onBack }: PhotoCaptureProps) {
  const [mode, setMode] = useState<CaptureMode>("select");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { videoRef, isStreaming, error, startCamera, stopCamera, capturePhoto } = useCamera();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleStartCamera = async () => {
    setMode("camera");
    await startCamera();
  };

  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      setCapturedPhoto(photo);
      setMode("preview");
      stopCamera();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCapturedPhoto(result);
      setMode("preview");
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setMode("select");
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
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
            onClick={() => {
              stopCamera();
              onBack();
            }}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Take Your Photo
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {theme.icon} {theme.name}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Mode: Select */}
          {mode === "select" && (
            <div className="animate-fade-in space-y-6">
              <div className="booth-card p-8 text-center">
                <div className="text-6xl mb-4">{theme.icon}</div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Ready for {theme.name}?
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  Take a photo or upload one to transform
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleStartCamera}
                    size="lg"
                    className="flex-1 sm:flex-initial bg-primary text-primary-foreground hover:bg-primary/90 font-display py-6"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Use Camera
                  </Button>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    variant="outline"
                    className="flex-1 sm:flex-initial font-display py-6"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Mode: Camera */}
          {mode === "camera" && (
            <div className="animate-fade-in space-y-6">
              <div className="booth-card overflow-hidden">
                <div className="relative aspect-[3/4] bg-secondary">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover",
                      isStreaming ? "opacity-100" : "opacity-0"
                    )}
                    style={{ transform: "scaleX(-1)" }}
                  />
                  
                  {!isStreaming && !error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="font-body text-muted-foreground">Starting camera...</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📷</div>
                        <p className="font-body text-destructive mb-4">{error}</p>
                        <Button onClick={() => setMode("select")} variant="outline">
                          Go Back
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isStreaming && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleCapture}
                    size="lg"
                    className="w-20 h-20 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl"
                  >
                    <Camera className="w-8 h-8" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Mode: Preview */}
          {mode === "preview" && capturedPhoto && (
            <div className="animate-fade-in space-y-6">
              <div className="booth-card overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <img
                    src={capturedPhoto}
                    alt="Captured photo"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleRetake}
                  size="lg"
                  variant="outline"
                  className="font-display py-6 px-8"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>

                <Button
                  onClick={handleConfirm}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-display py-6 px-8"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Use This Photo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
