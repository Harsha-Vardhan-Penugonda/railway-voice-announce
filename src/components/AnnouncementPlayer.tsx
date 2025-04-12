
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, VolumeX } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnnouncementPlayerProps {
  isPlaying: boolean;
  announcementType: string;
}

const AnnouncementPlayer = ({ isPlaying, announcementType }: AnnouncementPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true);
      setProgress(0);
      
      // Simulate progress update
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 150); // Adjust timing based on average announcement length
      
      return () => {
        clearInterval(interval);
      };
    } else if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isPlaying, progress]);

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
            <Volume2 className={isPlaying ? "animate-pulse text-railway-blue" : "text-gray-400"} size={20} />
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
        <Progress value={progress} className="h-1.5" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>EN → हिन्दी → తెలుగు</span>
          <span>{progress}%</span>
        </div>
      </CardContent>
    </Card>
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
