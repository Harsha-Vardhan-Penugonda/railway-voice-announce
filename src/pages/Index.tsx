
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import AnnouncementForm from "@/components/AnnouncementForm";
import AnnouncementHistory from "@/components/AnnouncementHistory";
import AnnouncementPlayer from "@/components/AnnouncementPlayer";
import { AnnouncementType, TrainInfo, Announcement } from "@/types/announcement";
import { v4 as uuidv4 } from "uuid";
import { playMultilingualAnnouncement } from "@/utils/textToSpeech";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<{
    id: string;
    type: AnnouncementType;
    isPlaying: boolean;
  } | null>(null);

  const handleAnnouncementCreate = useCallback((
    type: AnnouncementType,
    trainInfo: TrainInfo,
    announcementTexts: { english: string; hindi: string; telugu: string }
  ) => {
    const id = uuidv4();
    const newAnnouncement: Announcement = {
      id,
      type,
      trainInfo,
      timestamp: new Date().toISOString(),
      isPlaying: true,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setCurrentAnnouncement({ id, type, isPlaying: true });

    playMultilingualAnnouncement(
      announcementTexts,
      undefined,
      () => {
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isPlaying: false } : a))
        );
        setCurrentAnnouncement((prev) => 
          prev?.id === id ? { ...prev, isPlaying: false } : prev
        );
      }
    );
  }, []);

  const handlePlayAnnouncement = useCallback((id: string) => {
    const announcement = announcements.find((a) => a.id === id);
    if (!announcement) return;

    // Update playing state
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPlaying: true } : a))
    );
    setCurrentAnnouncement({ 
      id, 
      type: announcement.type, 
      isPlaying: true 
    });

    // Generate texts
    const { type, trainInfo } = announcement;
    const announcementTexts = {
      english: type === 'arrival' 
        ? `Train ${trainInfo.trainNumber} ${trainInfo.trainName} from ${trainInfo.origin} to ${trainInfo.destination} is arriving on Platform ${trainInfo.platform}.`
        : type === 'departure'
        ? `Train ${trainInfo.trainNumber} ${trainInfo.trainName} to ${trainInfo.destination} will depart from Platform ${trainInfo.platform} shortly.`
        : `Attention please, Train ${trainInfo.trainNumber} ${trainInfo.trainName} is delayed by ${trainInfo.delayTime}. The updated arrival time is ${trainInfo.updatedArrival}.`,
      hindi: type === 'arrival'
        ? `ट्रेन ${trainInfo.trainNumber} ${trainInfo.trainName} ${trainInfo.origin} से ${trainInfo.destination} तक प्लेटफ़ॉर्म ${trainInfo.platform} पर पहुंच रही है।`
        : type === 'departure'
        ? `ट्रेन ${trainInfo.trainNumber} ${trainInfo.trainName} ${trainInfo.destination} के लिए प्लेटफ़ॉर्म ${trainInfo.platform} से कुछ ही समय में प्रस्थान करेगी।`
        : `कृपया ध्यान दें, ट्रेन ${trainInfo.trainNumber} ${trainInfo.trainName} ${trainInfo.delayTime} से देरी हो रही है। अद्यतन आगमन समय ${trainInfo.updatedArrival} है।`,
      telugu: type === 'arrival'
        ? `రైలు ${trainInfo.trainNumber} ${trainInfo.trainName} ${trainInfo.origin} నుండి ${trainInfo.destination} వరకు ప్లాట్‌ఫారం ${trainInfo.platform} పై రాబోతోంది.`
        : type === 'departure'
        ? `రైలు ${trainInfo.trainNumber} ${trainInfo.trainName} ${trainInfo.destination} కి ప్లాట్‌ఫారం ${trainInfo.platform} నుండి త్వరలో బయలుదేరబోతుంది.`
        : `దయచేసి శ్రద్ధ వహించండి, రైలు ${trainInfo.trainNumber} ${trainInfo.trainName} ${trainInfo.delayTime} ఆలస్యంగా ఉంది. నవీకరించబడిన రాక సమయం ${trainInfo.updatedArrival}.`,
    };

    toast.info("Playing announcement...");

    // Play the announcement
    playMultilingualAnnouncement(
      announcementTexts,
      undefined,
      () => {
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isPlaying: false } : a))
        );
        setCurrentAnnouncement((prev) => 
          prev?.id === id ? { ...prev, isPlaying: false } : prev
        );
        toast.success("Announcement playback complete");
      }
    );
  }, [announcements]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="create">Create Announcement</TabsTrigger>
            <TabsTrigger value="history">Recent Announcements ({announcements.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <AnnouncementForm onAnnouncementCreate={handleAnnouncementCreate} />
          </TabsContent>
          <TabsContent value="history">
            <AnnouncementHistory 
              announcements={announcements} 
              onPlay={handlePlayAnnouncement} 
            />
          </TabsContent>
        </Tabs>
      </main>
      {currentAnnouncement && (
        <AnnouncementPlayer 
          isPlaying={currentAnnouncement.isPlaying} 
          announcementType={currentAnnouncement.type} 
        />
      )}
    </div>
  );
};

export default Index;
