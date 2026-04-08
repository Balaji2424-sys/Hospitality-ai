import { useState } from "react";

export default function VoiceInput({ onTranscript, language }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = { en: "en-US", hi: "hi-IN", ta: "ta-IN" }[language] || "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };
    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`rounded-full px-4 py-2 text-white ${listening ? "bg-amber-500" : "bg-brand-500"}`}
    >
      {listening ? "Listening..." : "Voice Input"}
    </button>
  );
}
