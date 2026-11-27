import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X } from "lucide-react";
import { useI18n } from "../i18n";
import { Button } from "./ui/Button";

/**
 * Camera capture for scan-to-translate. Asks the device for camera access,
 * shows the viewfinder and captures a still. Reading and translating the text
 * in the photo is the AI backend's part (the teammates); it plugs in where
 * scanBackend is shown.
 */
export function ScanCamera({ onClose }: { onClose: () => void }) {
  const { m } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const stopStream = () => streamRef.current?.getTracks().forEach((t) => t.stop());

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    startCamera();
    return stopStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    stopStream();
    setPhoto(canvas.toDataURL("image/jpeg", 0.9));
  };

  const retake = () => {
    setPhoto(null);
    setError(false);
    startCamera();
  };

  if (error) {
    return (
      <div className="mb-3 space-y-3">
        <p role="alert" className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
          {m.translator.scanDenied}
        </p>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" /> {m.common.cancel}
        </Button>
      </div>
    );
  }

  if (photo) {
    return (
      <div className="mb-3 space-y-3">
        <img src={photo} alt={m.translator.scan} className="w-full rounded-2xl" />
        <p className="text-sm text-muted-foreground">{m.translator.scanBackend}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={retake}>
            <RefreshCw className="h-4 w-4" /> {m.translator.scanRetake}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" /> {m.common.cancel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 space-y-3">
      <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-2xl bg-black" />
      <div className="flex gap-2">
        <Button size="sm" onClick={capture}>
          <Camera className="h-4 w-4" /> {m.translator.scanCapture}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" /> {m.common.cancel}
        </Button>
      </div>
    </div>
  );
}
