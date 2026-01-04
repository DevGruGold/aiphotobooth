import { useState, useEffect, useCallback } from "react";

export interface GalleryPhoto {
  id: string;
  originalPhoto: string;
  transformedPhoto: string;
  themeId: string;
  themeName: string;
  themeIcon: string;
  createdAt: number;
}

const DB_NAME = "party-favor-gallery";
const DB_VERSION = 1;
const STORE_NAME = "photos";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPhotos = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const sortedPhotos = (request.result as GalleryPhoto[]).sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setPhotos(sortedPhotos);
        setIsLoading(false);
      };
      
      request.onerror = () => {
        console.error("Failed to load photos:", request.error);
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Failed to open database:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const savePhoto = useCallback(async (photo: Omit<GalleryPhoto, "id" | "createdAt">) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      const newPhoto: GalleryPhoto = {
        ...photo,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      
      store.add(newPhoto);
      
      transaction.oncomplete = () => {
        setPhotos((prev) => [newPhoto, ...prev]);
      };
      
      return newPhoto;
    } catch (error) {
      console.error("Failed to save photo:", error);
      throw error;
    }
  }, []);

  const deletePhoto = useCallback(async (id: string) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      store.delete(id);
      
      transaction.oncomplete = () => {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      };
    } catch (error) {
      console.error("Failed to delete photo:", error);
      throw error;
    }
  }, []);

  const clearAllPhotos = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      store.clear();
      
      transaction.oncomplete = () => {
        setPhotos([]);
      };
    } catch (error) {
      console.error("Failed to clear photos:", error);
      throw error;
    }
  }, []);

  return {
    photos,
    isLoading,
    savePhoto,
    deletePhoto,
    clearAllPhotos,
    refreshPhotos: loadPhotos,
  };
}
