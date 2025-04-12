
export type AnnouncementType = 'arrival' | 'departure' | 'delay';

export type Language = 'english' | 'hindi' | 'telugu';

export interface TrainInfo {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  platform: string;
  delayTime?: string; // Only for delay announcements
  updatedArrival?: string; // Only for delay announcements
}

export interface Announcement {
  id: string;
  type: AnnouncementType;
  trainInfo: TrainInfo;
  timestamp: string;
  isPlaying: boolean;
}

export interface AnnouncementTemplate {
  english: string;
  hindi: string;
  telugu: string;
}

// Voice preferences
export interface VoicePreference {
  lang: string;
  gender?: 'female' | 'male';
  name?: string;
}

// Announcement timing configuration
export interface AnnouncementTiming {
  pauseAfterComma: number; // milliseconds
  pauseAfterPeriod: number; // milliseconds
  pauseBetweenLanguages: number; // milliseconds
  speechRate: number; // 0.1 to 10
}
