import { useState, useCallback } from "react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
}

export function useVoiceInput(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition() as SpeechRecognition;
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    setError(null);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onText(transcript);
    };

    recognition.onerror = (event: Event) => {
      setError("Error: " + (event as any).error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }, [onText]);

  return { listening, startListening, error };
}
