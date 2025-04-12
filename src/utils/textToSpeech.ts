
import { Language, VoicePreference, AnnouncementTiming } from "@/types/announcement";

// Mapping of languages to voice names for Web Speech API with Indian accent preference
const languageVoiceMap: Record<Language, { lang: string, voiceNameIncludes: string }> = {
  english: { lang: "en-IN", voiceNameIncludes: "female" },  // Indian English
  hindi: { lang: "hi-IN", voiceNameIncludes: "female" },    // Hindi
  telugu: { lang: "te-IN", voiceNameIncludes: "female" }    // Telugu
};

// Fallback voices if specific language not available
const fallbackVoices: Record<Language, string[]> = {
  english: ["en-US", "en-GB", "en"],
  hindi: ["hi", "en-IN"],
  telugu: ["te", "en-IN"]
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
    .replace(/నంబర్/g, 'నంబర్ ')
    .replace(/ప్లాట్‌ఫామ్‌/g, 'ప్లాట్‌ఫామ్‌ ')
    .replace(/రైలు నంబర్/g, 'రైలు నంబర్ ');
};

// Find the best matching voice based on language and gender preference
const findBestVoice = (language: Language): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window)) return null;
  
  const voices = window.speechSynthesis.getVoices();
  const voiceConfig = languageVoiceMap[language];
  
  console.log(`Available voices for ${language}: `, voices.filter(v => 
    v.lang.includes(voiceConfig.lang) || 
    fallbackVoices[language].some(fb => v.lang.includes(fb))
  ));
  
  // First try to find preferred voice matching language and gender
  let voice = voices.find(v => 
    v.lang.includes(voiceConfig.lang) && 
    v.name.toLowerCase().includes(voiceConfig.voiceNameIncludes)
  );
  
  // Fallback to any voice with matching language
  if (!voice) {
    voice = voices.find(v => v.lang.includes(voiceConfig.lang));
  }
  
  // Further fallbacks for specific languages
  if (!voice) {
    for (const fallbackLang of fallbackVoices[language]) {
      voice = voices.find(v => v.lang.includes(fallbackLang));
      if (voice) break;
    }
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
  if (voice) {
    utterance.voice = voice;
    console.log(`Using voice for ${language}: ${voice.name} (${voice.lang})`);
  } else {
    console.warn(`No suitable voice found for ${language}, using default`);
  }
  
  // Set language even if specific voice not found
  utterance.lang = languageVoiceMap[language].lang;
  
  // Adjust speech parameters for more natural sound
  utterance.rate = defaultTiming.speechRate; // Slightly slower for clarity
  utterance.pitch = 1;
  
  // Set callbacks
  if (onStart) utterance.onstart = onStart;
  
  // Handle errors in speech synthesis
  utterance.onerror = (event) => {
    console.error(`Speech synthesis error for ${language}:`, event);
    if (onEnd) onEnd(); // Call onEnd to maintain flow even if there's an error
  };
  
  if (onEnd) utterance.onend = onEnd;
  
  // Speak
  window.speechSynthesis.speak(utterance);
  
  // Chrome has a bug where longer utterances might stop unexpectedly
  // This watchdog helps prevent that by periodically restarting if needed
  const maxSpeechTime = 10000; // 10 seconds max per speech segment
  const watchdog = setTimeout(() => {
    if (window.speechSynthesis.speaking) {
      console.log('Restarting speech synthesis for long text');
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, maxSpeechTime);
  
  utterance.onend = () => {
    clearTimeout(watchdog);
    if (onEnd) onEnd();
  };
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
  console.log("Playing multilingual announcement with texts:", texts);
  
  // Start with English
  let started = false;
  
  generateSpeech(
    texts.english, 
    'english',
    () => {
      if (!started && onStart) {
        onStart();
        started = true;
      }
      console.log("English announcement started");
    },
    () => {
      console.log("English announcement completed, starting Hindi");
      // Then Hindi with a pause
      setTimeout(() => {
        generateSpeech(
          texts.hindi, 
          'hindi',
          () => console.log("Hindi announcement started"),
          () => {
            console.log("Hindi announcement completed, starting Telugu");
            // Finally Telugu with a pause
            setTimeout(() => {
              generateSpeech(
                texts.telugu, 
                'telugu',
                () => console.log("Telugu announcement started"),
                () => {
                  console.log("Telugu announcement completed");
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
