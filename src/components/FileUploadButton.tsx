import { useRef } from "react";
import { Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface FileUploadButtonProps {
  conversationId: string;
  onUploaded: (fileUrl: string, fileName: string, fileType: string) => void;
  disabled?: boolean;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUploadButton({ conversationId, onUploaded, disabled }: FileUploadButtonProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > MAX_SIZE) {
      toast({ title: "File too large", description: "Max 10MB", variant: "destructive" });
      return;
    }

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${conversationId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("chat-attachments")
      .upload(path, file);

    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
      return;
    }

    const { data: urlData } = supabase.storage
      .from("chat-attachments")
      .getPublicUrl(path);

    onUploaded(urlData.publicUrl, file.name, file.type);

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf,.doc,.docx,.txt,.zip"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="p-2.5 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-all duration-200 disabled:opacity-40"
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </>
  );
}
