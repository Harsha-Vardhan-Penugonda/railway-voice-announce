
import { AnnouncementTemplate, AnnouncementType, TrainInfo } from "@/types/announcement";

export const getAnnouncementTemplate = (type: AnnouncementType): AnnouncementTemplate => {
  switch (type) {
    case 'arrival':
      return {
        english: "Train [trainNumber] [trainName] from [origin] to [destination] is arriving on Platform [platform].",
        hindi: "ट्रेन [trainNumber] [trainName] [origin] से [destination] तक प्लेटफ़ॉर्म [platform] पर पहुंच रही है।",
        telugu: "రైలు [trainNumber] [trainName] [origin] నుండి [destination] వరకు ప్లాట్‌ఫారం [platform] పై రాబోతోంది."
      };
    case 'departure':
      return {
        english: "Train [trainNumber] [trainName] to [destination] will depart from Platform [platform] shortly.",
        hindi: "ट्रेन [trainNumber] [trainName] [destination] के लिए प्लेटफ़ॉर्म [platform] से कुछ ही समय में प्रस्थान करेगी।",
        telugu: "రైలు [trainNumber] [trainName] [destination] కి ప్లాట్‌ఫారం [platform] నుండి త్వరలో బయలుదేరబోతుంది."
      };
    case 'delay':
      return {
        english: "Attention please, Train [trainNumber] [trainName] is delayed by [delayTime]. The updated arrival time is [updatedArrival].",
        hindi: "कृपया ध्यान दें, ट्रेन [trainNumber] [trainName] [delayTime] से देरी हो रही है। अद्यतन आगमन समय [updatedArrival] है।",
        telugu: "దయచేసి శ్రద్ధ వహించండి, రైలు [trainNumber] [trainName] [delayTime] ఆలస్యంగా ఉంది. నవీకరించబడిన రాక సమయం [updatedArrival]."
      };
    default:
      return {
        english: "",
        hindi: "",
        telugu: ""
      };
  }
};

export const generateAnnouncementText = (
  type: AnnouncementType,
  trainInfo: TrainInfo,
  language: 'english' | 'hindi' | 'telugu'
): string => {
  const template = getAnnouncementTemplate(type)[language];
  
  let text = template
    .replace('[trainNumber]', trainInfo.trainNumber)
    .replace('[trainName]', trainInfo.trainName)
    .replace('[origin]', trainInfo.origin)
    .replace('[destination]', trainInfo.destination)
    .replace('[platform]', trainInfo.platform);
    
  if (type === 'delay' && trainInfo.delayTime && trainInfo.updatedArrival) {
    text = text
      .replace('[delayTime]', trainInfo.delayTime)
      .replace('[updatedArrival]', trainInfo.updatedArrival);
  }
  
  return text;
};
