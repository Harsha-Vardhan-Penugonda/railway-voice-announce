
import { Language } from "@/types/announcement";

// Mapping of languages to voice names for Web Speech API
const languageVoiceMap: Record<Language, string> = {
  english: "en-US",
  hindi: "hi-IN",
  telugu: "te-IN" 
};

export const generateSpeech = (
  text: string,
  language: Language,
  onStart?: () => void,
  onEnd?: () => void
): void => {
  // Use Web Speech API for the MVP
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageVoiceMap[language];
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    
    // Set callbacks
    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    
    // Speak
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Web Speech API is not supported in this browser");
    // Could fallback to audio files or alternative TTS services for production
  }
};

export const stopSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const playMultilingualAnnouncement = (
  texts: { english: string; hindi: string; telugu: string },
  onStart?: () => void,
  onEnd?: () => void
): void => {
  // Play all three languages in sequence
  let started = false;
  
  // Start with English
  generateSpeech(
    texts.english, 
    'english',
    () => {
      if (!started && onStart) {
        onStart();
        started = true;
      }
    },
    () => {
      // Then Hindi
      setTimeout(() => {
        generateSpeech(
          texts.hindi, 
          'hindi',
          undefined,
          () => {
            // Finally Telugu
            setTimeout(() => {
              generateSpeech(
                texts.telugu, 
                'telugu',
                undefined,
                () => {
                  if (onEnd) onEnd();
                }
              );
            }, 500);
          }
        );
      }, 500);
    }
  );
};
