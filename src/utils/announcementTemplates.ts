
import { AnnouncementTemplate, AnnouncementType, TrainInfo } from "@/types/announcement";

export const getAnnouncementTemplate = (type: AnnouncementType): AnnouncementTemplate => {
  switch (type) {
    case 'arrival':
      return {
        english: "Attention please, train number [trainNumberFullstop] from [origin] to [destination], [trainName], is arriving shortly on platform number [platform].",
        hindi: "यात्रीगण कृपया ध्यान दें, गाड़ी संख्या [trainNumberFullstop], [origin] से [destination] जाने वाली [trainName], प्लेटफार्म क्रमांक [platform] पर थोड़ी देर में आएगी।",
        telugu: "దయచేసి వినండి, రైలు నంబర్ [trainNumberFullstop] [origin] నుండి [destination] వెళ్ళే [trainName] మరికొద్దిసేపట్లో నంబర్ [platform] ప్లాట్‌ఫామ్‌కు వచ్చును."
      };
    case 'departure':
      return {
        english: "Attention please, train number [trainNumberFullstop], [trainName], for [destination] is ready to depart from platform number [platform]. Passengers are requested to board the train.",
        hindi: "यात्रीगण कृपया ध्यान दें, गाड़ी संख्या [trainNumberFullstop], [trainName], [destination] के लिए प्लेटफार्म क्रमांक [platform] से प्रस्थान के लिए तैयार है। यात्रियों से अनुरोध है कि वे गाड़ी में सवार हो जाएं।",
        telugu: "దయచేసి వినండి, రైలు నంబరు [trainNumberFullstop], [trainName], [destination] కు వెళ్ళే రైలు ప్లాట్‌ఫారమ్ నంబర్ [platform] నుండి నిష్క్రమించడానికి సిద్ధంగా ఉంది. ప్రయాణికులు రైలు ఎక్కవలసిందిగా కోరడమైనది."
      };
    case 'delay':
      return {
        english: "We regret to inform that train number [trainNumberFullstop], [trainName], from [origin] to [destination] is delayed by [delayTime]. The expected arrival time is [updatedArrival]. Inconvenience caused is deeply regretted.",
        hindi: "हमें यह सूचित करते हुए खेद है कि गाड़ी संख्या [trainNumberFullstop], [trainName], [origin] से [destination] जाने वाली, [delayTime] देरी से चल रही है। अनुमानित आगमन समय [updatedArrival] है। असुविधा के लिए हमें खेद है।",
        telugu: "రైలు నంబర్ [trainNumberFullstop], [trainName], [origin] నుండి [destination] వెళ్ళే రైలు [delayTime] ఆలస్యంగా ఉన్నట్లు తెలియజేయడానికి చింతిస్తున్నాము. అంచనా రాక సమయం [updatedArrival]. కలిగిన అసౌకర్యానికి చింతిస్తున్నాము."
      };
    default:
      return {
        english: "",
        hindi: "",
        telugu: ""
      };
  }
};

const formatTrainNumberWithFullstops = (trainNumber: string): string => {
  return trainNumber.split('').join('.');
};

export const generateAnnouncementText = (
  type: AnnouncementType,
  trainInfo: TrainInfo,
  language: 'english' | 'hindi' | 'telugu'
): string => {
  const template = getAnnouncementTemplate(type)[language];
  
  // Format train number with fullstops (e.g., "12345" becomes "1.2.3.4.5")
  const trainNumberFullstop = formatTrainNumberWithFullstops(trainInfo.trainNumber);
  
  let text = template
    .replace('[trainNumberFullstop]', trainNumberFullstop)
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
