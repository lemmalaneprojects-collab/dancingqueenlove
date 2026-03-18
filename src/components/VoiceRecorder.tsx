import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  conversationId: string;
  onRecorded: (fileUrl: string, fileName: string, fileType: string) => void;
}

export default function VoiceRecorder({ conversationId, onRecorded }: VoiceRecorderProps) {
  const { user } = useAuth();
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        await uploadVoice(blob);
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast({ title: "Microphone access denied", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const uploadVoice = async (blob: Blob) => {
    if (!user) return;
    setUploading(true);
    const fileName = `voice_${Date.now()}.webm`;
    const path = `${user.id}/${conversationId}/${fileName}`;

    const { error } = await supabase.storage
      .from("chat-attachments")
      .upload(path, blob, { contentType: "audio/webm" });

    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("chat-attachments")
      .getPublicUrl(path);

    onRecorded(urlData.publicUrl, fileName, "audio/webm");
    setUploading(false);
    setDuration(0);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (uploading) {
    return (
      <div className="p-2.5 rounded-2xl bg-muted text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (recording) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-destructive/10 text-destructive">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs font-mono font-semibold">{formatTime(duration)}</span>
        </div>
        <button
          onClick={stopRecording}
          className="p-2.5 rounded-2xl bg-destructive text-destructive-foreground hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      className="p-2.5 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-all duration-200"
    >
      <Mic className="w-5 h-5" />
    </button>
  );
}
