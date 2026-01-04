import { useState } from "react";
import { ArrowLeft, Download, Images, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryPhoto } from "@/hooks/usePhotoGallery";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GalleryScreenProps {
  photos: GalleryPhoto[];
  isLoading: boolean;
  onBack: () => void;
  onDeletePhoto: (id: string) => Promise<void>;
  onClearAll: () => Promise<void>;
}

export function GalleryScreen({
  photos,
  isLoading,
  onBack,
  onDeletePhoto,
  onClearAll,
}: GalleryScreenProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = (photo: GalleryPhoto) => {
    try {
      const base64Data = photo.transformedPhoto.split(',')[1];
      const mimeType = photo.transformedPhoto.split(':')[1]?.split(';')[0] || 'image/png';
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `party-favor-${photo.themeId}-${photo.createdAt}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  const handleShare = async (photo: GalleryPhoto) => {
    try {
      const base64Data = photo.transformedPhoto.split(',')[1];
      const mimeType = photo.transformedPhoto.split(':')[1]?.split(';')[0] || 'image/png';
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], `party-favor-${photo.themeId}.png`, { type: mimeType });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My ${photo.themeName} Photo`,
          text: `Check out my ${photo.themeName} transformation!`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `My ${photo.themeName} Photo`,
          text: `Check out my ${photo.themeName} transformation!`,
        });
      } else {
        toast({
          title: "Sharing not supported",
          description: "Download the image and share it manually.",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Share failed:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await onDeletePhoto(id);
      setSelectedPhoto(null);
      toast({ title: "Photo deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground">
              My Gallery
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {photos.length} photo{photos.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {photos.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all photos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {photos.length} photos from your gallery. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Images className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                No photos yet
              </h2>
              <p className="text-muted-foreground font-body max-w-sm">
                Transform a photo and save it to see it here!
              </p>
              <Button onClick={onBack} className="mt-6">
                Create Your First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={photo.transformedPhoto}
                    alt={`${photo.themeName} transformation`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-display text-sm font-semibold">
                      {photo.themeIcon} {photo.themeName}
                    </p>
                    <p className="text-white/70 text-xs font-body">
                      {formatDate(photo.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <header className="flex items-center justify-between p-4">
            <div>
              <p className="text-white font-display font-semibold">
                {selectedPhoto.themeIcon} {selectedPhoto.themeName}
              </p>
              <p className="text-white/60 text-sm font-body">
                {formatDate(selectedPhoto.createdAt)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedPhoto(null)}
              className="text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
          </header>

          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={selectedPhoto.transformedPhoto}
              alt={`${selectedPhoto.themeName} transformation`}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>

          <div className="p-4 flex gap-3 justify-center">
            <Button
              onClick={() => handleDownload(selectedPhoto)}
              className="bg-primary text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={() => handleShare(selectedPhoto)}
              variant="secondary"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the photo from your gallery.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(selectedPhoto.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}
