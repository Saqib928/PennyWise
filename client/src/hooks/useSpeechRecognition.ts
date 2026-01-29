import { useState, useEffect, useRef, useCallback } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimer = useRef<any>(null);

  useEffect(() => {
    // Browser Support Check
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Browser not supported. Please use Chrome.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true; // Keep listening even after pauses
    recognition.interimResults = true; // Show words as they are spoken
    recognition.lang = "en-IN"; // Indian English

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      
      // Reset silence timer whenever speech is detected
      resetSilenceTimer();

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          // You can handle interim results if you want visual feedback of words forming
          // But for stability, we mostly care about the final stream in this loop
          finalTranscript += event.results[i][0].transcript; 
        }
      }
      
      // Update transcript state
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        setError("Microphone blocked. Allow permission.");
        setIsListening(false);
      }
      if (event.error === 'no-speech') {
        // Ignore no-speech errors, just keep waiting
        return; 
      }
    };

    recognition.onend = () => {
      // If it stops but we didn't intend to stop (e.g. network blip), restart it
      // unless logic handles it elsewhere. For now, we update state.
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    // Wait for 5 seconds of absolute silence before stopping
    silenceTimer.current = setTimeout(() => {
      stopListening();
    }, 5000); 
  };

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
        setTranscript(""); // Clear previous text
        setError(null);
        recognitionRef.current.start();
        resetSilenceTimer();
    } catch (err) {
        // If already started, just reset timer
        resetSilenceTimer();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    setIsListening(false);
  }, []);

  const resetTranscript = () => setTranscript("");

  return { 
    isListening, 
    transcript, 
    error, 
    startListening, 
    stopListening,
    resetTranscript 
  };
}