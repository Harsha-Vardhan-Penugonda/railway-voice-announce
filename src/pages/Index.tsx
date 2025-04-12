
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import AnnouncementForm from "@/components/AnnouncementForm";
import AnnouncementHistory from "@/components/AnnouncementHistory";
import AnnouncementPlayer from "@/components/AnnouncementPlayer";
import { AnnouncementType, TrainInfo, Announcement } from "@/types/announcement";
import { v4 as uuidv4 } from "uuid";
import { playMultilingualAnnouncement } from "@/utils/textToSpeech";
import { generateAnnouncementText } from "@/utils/announcementTemplates";
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
    trainInfo: TrainInfo
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

    // Generate announcement texts using templates
    const announcementTexts = {
      english: generateAnnouncementText(type, trainInfo, 'english'),
      hindi: generateAnnouncementText(type, trainInfo, 'hindi'),
      telugu: generateAnnouncementText(type, trainInfo, 'telugu'),
    };

    toast.info("Now playing announcement...", {
      duration: 3000
    });

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
        toast.success("Announcement completed");
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

    // Generate texts from templates
    const { type, trainInfo } = announcement;
    const announcementTexts = {
      english: generateAnnouncementText(type, trainInfo, 'english'),
      hindi: generateAnnouncementText(type, trainInfo, 'hindi'),
      telugu: generateAnnouncementText(type, trainInfo, 'telugu'),
    };

    toast.info("Replaying announcement...", {
      duration: 3000
    });

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-8 px-4">
        <div className="mb-6">
          <h2 className="text-lg text-center text-gray-600 font-medium">
            Indian Railways Platform Announcement System
          </h2>
          <div className="w-40 h-1 bg-railway-yellow mx-auto mt-2 rounded-full"></div>
        </div>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-6 bg-blue-100 p-1">
            <TabsTrigger value="create" className="data-[state=active]:bg-railway-blue data-[state=active]:text-white">
              Create Announcement
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-railway-blue data-[state=active]:text-white">
              Recent Announcements ({announcements.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <AnnouncementForm onAnnouncementCreate={handleAnnouncementCreate} />
          </TabsContent>
          <TabsContent value="history" className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
