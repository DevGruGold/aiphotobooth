import { useState } from "react";
import { Theme } from "@/data/themes";
import { transformPhoto } from "@/services/photoService";
import { WelcomeScreen } from "./WelcomeScreen";
import { ThemeSelection } from "./ThemeSelection";
import { PhotoCapture } from "./PhotoCapture";
import { ProcessingScreen } from "./ProcessingScreen";
import { ResultScreen } from "./ResultScreen";
import { ErrorScreen } from "./ErrorScreen";
import { GalleryScreen } from "./GalleryScreen";
import { useToast } from "@/hooks/use-toast";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";

type BoothStep = "welcome" | "theme" | "capture" | "processing" | "result" | "error" | "gallery";

interface BoothState {
  step: BoothStep;
  selectedTheme: Theme | null;
  capturedPhoto: string | null;
  transformedPhoto: string | null;
  error: string | null;
}

const initialState: BoothState = {
  step: "welcome",
  selectedTheme: null,
  capturedPhoto: null,
  transformedPhoto: null,
  error: null,
};

export function PhotoBooth() {
  const [state, setState] = useState<BoothState>(initialState);
  const { toast } = useToast();
  const gallery = usePhotoGallery();

  const handleStart = () => {
    setState((prev) => ({ ...prev, step: "theme" }));
  };

  const handleOpenGallery = () => {
    setState((prev) => ({ ...prev, step: "gallery" }));
  };

  const handleSelectTheme = (theme: Theme) => {
    setState((prev) => ({ ...prev, selectedTheme: theme, step: "capture" }));
  };

  const handleCapture = async (imageBase64: string) => {
    if (!state.selectedTheme) return;

    setState((prev) => ({ ...prev, capturedPhoto: imageBase64, step: "processing" }));

    try {
      const result = await transformPhoto(imageBase64, state.selectedTheme);
      
      setState((prev) => ({
        ...prev,
        transformedPhoto: result.transformedImage,
        step: "result",
      }));

      toast({
        title: "Transformation Complete! ✨",
        description: result.message,
      });
    } catch (error) {
      console.error("Transformation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to transform photo";
      
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        step: "error",
      }));
    }
  };

  const handleSaveToGallery = async () => {
    if (!state.selectedTheme || !state.capturedPhoto || !state.transformedPhoto) return;
    
    try {
      await gallery.savePhoto({
        originalPhoto: state.capturedPhoto,
        transformedPhoto: state.transformedPhoto,
        themeId: state.selectedTheme.id,
        themeName: state.selectedTheme.name,
        themeIcon: state.selectedTheme.icon,
      });
      toast({ title: "Photo saved to gallery!" });
    } catch {
      toast({ title: "Failed to save photo", variant: "destructive" });
    }
  };

  const handleRetry = () => {
    if (state.capturedPhoto && state.selectedTheme) {
      handleCapture(state.capturedPhoto);
    }
  };

  const handleBackToThemes = () => {
    setState((prev) => ({
      ...prev,
      step: "theme",
      capturedPhoto: null,
      transformedPhoto: null,
      error: null,
    }));
  };

  const handleStartOver = () => {
    setState(initialState);
  };

  const handleTryAnother = () => {
    setState((prev) => ({
      ...prev,
      step: "theme",
      capturedPhoto: null,
      transformedPhoto: null,
      error: null,
    }));
  };

  // Render based on current step
  switch (state.step) {
    case "welcome":
      return <WelcomeScreen onStart={handleStart} onOpenGallery={handleOpenGallery} photoCount={gallery.photos.length} />;

    case "gallery":
      return (
        <GalleryScreen
          photos={gallery.photos}
          isLoading={gallery.isLoading}
          onBack={handleStartOver}
          onDeletePhoto={gallery.deletePhoto}
          onClearAll={gallery.clearAllPhotos}
        />
      );

    case "theme":
      return (
        <ThemeSelection
          onSelect={handleSelectTheme}
          onBack={handleStartOver}
        />
      );

    case "capture":
      if (!state.selectedTheme) return null;
      return (
        <PhotoCapture
          theme={state.selectedTheme}
          onCapture={handleCapture}
          onBack={handleBackToThemes}
        />
      );

    case "processing":
      if (!state.selectedTheme) return null;
      return <ProcessingScreen theme={state.selectedTheme} />;

    case "result":
      if (!state.selectedTheme || !state.capturedPhoto || !state.transformedPhoto) return null;
      return (
        <ResultScreen
          theme={state.selectedTheme}
          originalPhoto={state.capturedPhoto}
          transformedPhoto={state.transformedPhoto}
          onStartOver={handleStartOver}
          onTryAnother={handleTryAnother}
          onSaveToGallery={handleSaveToGallery}
        />
      );

    case "error":
      if (!state.selectedTheme) return null;
      return (
        <ErrorScreen
          theme={state.selectedTheme}
          error={state.error || "An unexpected error occurred"}
          onRetry={handleRetry}
          onBack={handleBackToThemes}
        />
      );

    default:
      return null;
  }
}
