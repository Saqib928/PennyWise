import { useVoiceInput } from "../hooks/useVoiceInput";

export function VoiceInput({ onResult }: { onResult: (text: string) => void }) {
  const { listening, startListening, error } = useVoiceInput(onResult);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={startListening}
        disabled={listening}
        className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
      >
        {listening ? "🎤 Listening..." : "🎤 Add by Voice"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
