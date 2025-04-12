
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
