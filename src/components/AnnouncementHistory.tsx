
import { Clock, Play, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Announcement } from "@/types/announcement";
import { formatDistanceToNow } from "date-fns";

interface AnnouncementHistoryProps {
  announcements: Announcement[];
  onPlay: (id: string) => void;
}

const AnnouncementHistory = ({ announcements, onPlay }: AnnouncementHistoryProps) => {
  if (announcements.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-railway-blue">Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-500">
          <Volume2 className="mx-auto h-12 w-12 opacity-20 mb-2" />
          <p>No announcements yet</p>
          <p className="text-sm">Create an announcement to see it here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-railway-blue">Recent Announcements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge 
                  className={
                    announcement.type === "arrival" 
                      ? "bg-green-600" 
                      : announcement.type === "departure" 
                        ? "bg-blue-600" 
                        : "bg-amber-600"
                  }
                >
                  {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                </Badge>
                <h3 className="font-medium">
                  {announcement.trainInfo.trainNumber} - {announcement.trainInfo.trainName}
                </h3>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onPlay(announcement.id)}
                className="h-8 px-2"
                disabled={announcement.isPlaying}
              >
                {announcement.isPlaying ? (
                  <span className="text-railway-blue flex items-center">
                    <span className="animate-pulse-slow mr-1">Playing</span>
                    <Volume2 size={16} className="ml-1" />
                  </span>
                ) : (
                  <span className="text-railway-blue flex items-center">
                    <Play size={16} className="mr-1" /> Play Again
                  </span>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                {announcement.trainInfo.origin && announcement.trainInfo.destination 
                  ? `${announcement.trainInfo.origin} → ${announcement.trainInfo.destination}` 
                  : announcement.trainInfo.destination 
                    ? `To: ${announcement.trainInfo.destination}` 
                    : ''}
                {` • Platform ${announcement.trainInfo.platform}`}
              </p>
              {announcement.type === "delay" && (
                <p className="text-amber-700">
                  Delayed by {announcement.trainInfo.delayTime} 
                  • New arrival: {announcement.trainInfo.updatedArrival}
                </p>
              )}
              <div className="flex items-center mt-1 text-gray-500 text-xs">
                <Clock size={12} className="mr-1" />
                <span>{formatDistanceToNow(new Date(announcement.timestamp), { addSuffix: true })}</span>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AnnouncementHistory;
