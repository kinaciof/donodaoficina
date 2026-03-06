"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

interface CameraUploaderProps {
  tenantId: string;
  osId: string;
  onUploadSuccess: (url: string) => void;
}

export function CameraUploader({ tenantId, osId, onUploadSuccess }: CameraUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create a reference to 'tenant_id/os_id/filename'
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${tenantId}/${osId}/${fileName}`);

      // Upload the file
      const uploadTask = await uploadBytesResumable(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      onUploadSuccess(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-card hover:bg-card/80 transition-colors">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" // Hints mobile devices to open the back camera
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center gap-2 text-primary">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-sm font-medium">Enviando foto...</span>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center gap-3 cursor-pointer"
          onClick={triggerInput}
        >
          <div className="flex gap-4">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <Camera size={28} />
            </div>
            <div className="p-4 bg-primary/10 rounded-full text-primary hidden md:block">
              <Upload size={28} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              Tirar Foto ou Anexar Imagem
            </p>
            <p className="text-xs text-foreground/60 mt-1 max-w-[200px]">
              No celular, isso abrirá sua câmera. No PC, abrirá seus arquivos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}