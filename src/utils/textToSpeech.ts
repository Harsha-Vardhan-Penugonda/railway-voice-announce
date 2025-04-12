
import { Language, VoicePreference, AnnouncementTiming } from "@/types/announcement";

// Mapping of languages to voice names for Web Speech API with Indian accent preference
const languageVoiceMap: Record<Language, { lang: string, voiceNameIncludes: string }> = {
  english: { lang: "en-IN", voiceNameIncludes: "female" },  // Indian English
  hindi: { lang: "hi-IN", voiceNameIncludes: "female" },    // Hindi
  telugu: { lang: "te-IN", voiceNameIncludes: "female" }    // Telugu
};

// Default timing configuration for more natural-sounding announcements
const defaultTiming: AnnouncementTiming = {
  pauseAfterComma: 300,      // 300ms pause after commas
  pauseAfterPeriod: 600,     // 600ms pause after periods
  pauseBetweenLanguages: 1000, // 1s pause between languages
  speechRate: 0.9            // slightly slower for clarity
};

// Helper to insert natural pauses in announcements
const insertNaturalPauses = (text: string, timing: AnnouncementTiming = defaultTiming): string => {
  // Clean the text to make sure there are proper spaces after punctuation
  let cleanedText = text
    .replace(/,(?!\s)/g, ', ')  // Ensure space after comma
    .replace(/\.(?!\s|$)/g, '. '); // Ensure space after period if not at end
  
  // Add pauses after punctuation for more natural speech rhythm
  return cleanedText
    .replace(/,\s/g, `, `)
    .replace(/\.\s/g, `. `)
    .replace(/(\d+)\.(\d+)/g, '$1 point $2') // Convert decimal points to "point" for better pronunciation
    .replace(/platform number/gi, 'platform number ')
    .replace(/train number/gi, 'train number ')
    .replace(/प्लेटफार्म क्रमांक/g, 'प्लेटफार्म क्रमांक ')
    .replace(/गाड़ी संख्या/g, 'गाड़ी संख्या ')
    .replace(/నంబర్/g, 'నంబర్ ');
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
  utterance.rate = defaultTiming.speechRate; // Slightly slower for clarity
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
                    setTimeout(() => onEnd(), defaultTiming.pauseBetweenLanguages); // Final pause before completion
                  }
                }
              );
            }, defaultTiming.pauseBetweenLanguages); // Longer pause between languages
          }
        );
      }, defaultTiming.pauseBetweenLanguages);
    }
  );
};
