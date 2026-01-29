import { useRef, useState } from "react";

export function useVoiceRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm"
      });

      chunksRef.current = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm"
        });
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);

    } catch {
      alert("Mic permission required");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  function reset() {
    setAudioBlob(null);
  }

  return {
    recording,
    audioBlob,
    startRecording,
    stopRecording,
    reset
  };
}
