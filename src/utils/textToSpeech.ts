
import { Language } from "@/types/announcement";

// Mapping of languages to voice names for Web Speech API with Indian accent preference
const languageVoiceMap: Record<Language, { lang: string, voiceNameIncludes: string }> = {
  english: { lang: "en-IN", voiceNameIncludes: "female" },  // Indian English
  hindi: { lang: "hi-IN", voiceNameIncludes: "female" },    // Hindi
  telugu: { lang: "te-IN", voiceNameIncludes: "female" }    // Telugu
};

// Helper to insert natural pauses in announcements
const insertNaturalPauses = (text: string): string => {
  // Add slight pauses after commas, periods, and specific separators
  return text
    .replace(/,/g, ', <break time="0.3s"/>')
    .replace(/\./g, '. <break time="0.5s"/>')
    .replace(/platform number/g, '<break time="0.2s"/> platform number')
    .replace(/train number/g, '<break time="0.2s"/> train number');
};

// Find the best matching voice based on language and gender preference
const findBestVoice = (language: Language): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window)) return null;
  
  const voices = window.speechSynthesis.getVoices();
  const voiceConfig = languageVoiceMap[language];
  
  // First try to find female Indian voice
  let voice = voices.find(v => 
    v.lang.includes(voiceConfig.lang) && 
    v.name.toLowerCase().includes(voiceConfig.voiceNameIncludes)
  );
  
  // Fallback to any voice with matching language
  if (!voice) {
    voice = voices.find(v => v.lang.includes(voiceConfig.lang));
  }
  
  // Final fallback to any voice
  return voice || voices[0] || null;
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
    
    // Load voices if needed
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        executeSpeech(text, language, onStart, onEnd);
      };
    } else {
      executeSpeech(text, language, onStart, onEnd);
    }
  } else {
    console.error("Web Speech API is not supported in this browser");
    if (onEnd) onEnd(); // Still call onEnd to maintain flow
  }
};

const executeSpeech = (
  text: string,
  language: Language,
  onStart?: () => void,
  onEnd?: () => void
): void => {
  const processedText = insertNaturalPauses(text);
  const utterance = new SpeechSynthesisUtterance(processedText);
  
  // Get the best available voice
  const voice = findBestVoice(language);
  if (voice) utterance.voice = voice;
  
  // Set language even if specific voice not found
  utterance.lang = languageVoiceMap[language].lang;
  
  // Adjust speech parameters for more natural sound
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;
  
  // Set callbacks
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  
  // Speak
  window.speechSynthesis.speak(utterance);
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
  // Play all three languages in sequence with proper gaps between them
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
      // Then Hindi with a pause
      setTimeout(() => {
        generateSpeech(
          texts.hindi, 
          'hindi',
          undefined,
          () => {
            // Finally Telugu with a pause
            setTimeout(() => {
              generateSpeech(
                texts.telugu, 
                'telugu',
                undefined,
                () => {
                  if (onEnd) {
                    setTimeout(() => onEnd(), 500); // Final pause before completion
                  }
                }
              );
            }, 800); // Longer pause between languages
          }
        );
      }, 800);
    }
  );
};
