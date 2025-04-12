
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, VolumeX, Radio } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnnouncementPlayerProps {
  isPlaying: boolean;
  announcementType: string;
}

const AnnouncementPlayer = ({ isPlaying, announcementType }: AnnouncementPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'hindi' | 'telugu'>('english');

  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true);
      setProgress(0);
      
      // Simulate progress update and language transitions
      const totalTime = 30000; // 30 seconds for the full announcement
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (totalTime / 100));
          
          // Simulate language transitions
          if (newProgress > 33 && newProgress <= 66 && currentLanguage !== 'hindi') {
            setCurrentLanguage('hindi');
          } else if (newProgress > 66 && currentLanguage !== 'telugu') {
            setCurrentLanguage('telugu');
          }
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => {
        clearInterval(interval);
      };
    } else if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setCurrentLanguage('english'); // Reset for next time
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isPlaying, progress, currentLanguage]);

  if (!isVisible) {
    return null;
  }

  let bgColor = "bg-green-600";
  if (announcementType === "departure") bgColor = "bg-blue-600";
  if (announcementType === "delay") bgColor = "bg-amber-600";

  return (
    <Card className={cn(
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md shadow-lg transition-all duration-300",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {isPlaying ? (
              <Radio className="animate-pulse text-railway-blue" size={20} />
            ) : (
              <VolumeX className="text-gray-400" size={20} />
            )}
            <span className="ml-2 font-medium">
              {isPlaying ? (
                <span className="text-railway-blue">Playing Announcement</span>
              ) : (
                <span className="text-gray-500">Announcement Complete</span>
              )}
            </span>
          </div>
          <Badge className={bgColor}>
            {announcementType.charAt(0).toUpperCase() + announcementType.slice(1)}
          </Badge>
        </div>
        
        <div className="relative">
          <Progress value={progress} className="h-2" />
          <div className="absolute top-0 left-0 w-full flex justify-between mt-3">
            <LanguageMarker 
              lang="EN" 
              position="left" 
              isActive={currentLanguage === 'english'}
            />
            <LanguageMarker 
              lang="हिन्दी" 
              position="center" 
              isActive={currentLanguage === 'hindi'}
            />
            <LanguageMarker 
              lang="తెలుగు" 
              position="right" 
              isActive={currentLanguage === 'telugu'}
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6 text-xs text-gray-500">
          <span>
            {currentLanguage === 'english' && "Now playing: English"}
            {currentLanguage === 'hindi' && "Now playing: हिन्दी"}
            {currentLanguage === 'telugu' && "Now playing: తెలుగు"}
          </span>
          <span>{progress.toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

const LanguageMarker = ({ 
  lang, 
  position,
  isActive 
}: { 
  lang: string; 
  position: 'left' | 'center' | 'right';
  isActive: boolean;
}) => {
  return (
    <div className={cn(
      "text-xs font-medium transition-colors duration-300",
      position === 'left' ? "-translate-x-1/2" : "",
      position === 'right' ? "translate-x-1/2" : "",
      isActive ? "text-railway-blue" : "text-gray-400"
    )}>
      {lang}
    </div>
  );
};

const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={cn("text-xs px-2 py-0.5 rounded-full text-white", className)}>
      {children}
    </div>
  );
};

export default AnnouncementPlayer;
