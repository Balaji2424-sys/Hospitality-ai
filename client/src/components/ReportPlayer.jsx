import { useEffect } from "react";

export default function ReportPlayer({ text, language, playTrigger }) {
  useEffect(() => {
    if (!text || !window.speechSynthesis || !playTrigger) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = { en: "en-US", hi: "hi-IN", ta: "ta-IN" }[language] || "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [text, language, playTrigger]);

  return null;
}
