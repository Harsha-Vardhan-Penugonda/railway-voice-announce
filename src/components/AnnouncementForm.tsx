
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AnnouncementType, TrainInfo } from "@/types/announcement";
import { generateAnnouncementText } from "@/utils/announcementTemplates";
import { playMultilingualAnnouncement } from "@/utils/textToSpeech";

interface AnnouncementFormProps {
  onAnnouncementCreate: (
    type: AnnouncementType, 
    trainInfo: TrainInfo, 
    announcementTexts: { english: string; hindi: string; telugu: string }
  ) => void;
}

const AnnouncementForm = ({ onAnnouncementCreate }: AnnouncementFormProps) => {
  const [announcementType, setAnnouncementType] = useState<AnnouncementType>("arrival");
  const [trainInfo, setTrainInfo] = useState<TrainInfo>({
    trainNumber: "",
    trainName: "",
    origin: "",
    destination: "",
    platform: "",
    delayTime: "",
    updatedArrival: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrainInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (value: AnnouncementType) => {
    setAnnouncementType(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!trainInfo.trainNumber || !trainInfo.trainName || !trainInfo.platform) {
      toast.error("Please fill all required fields");
      return;
    }

    if (announcementType === "delay" && (!trainInfo.delayTime || !trainInfo.updatedArrival)) {
      toast.error("Delay time and updated arrival are required for delay announcements");
      return;
    }

    // Generate announcement texts
    const englishText = generateAnnouncementText(announcementType, trainInfo, "english");
    const hindiText = generateAnnouncementText(announcementType, trainInfo, "hindi");
    const teluguText = generateAnnouncementText(announcementType, trainInfo, "telugu");

    const announcementTexts = {
      english: englishText,
      hindi: hindiText,
      telugu: teluguText,
    };

    // Call the parent function to add the announcement
    onAnnouncementCreate(announcementType, trainInfo, announcementTexts);
    
    // Play the announcement
    playMultilingualAnnouncement(
      announcementTexts,
      () => toast.info("Playing announcement..."),
      () => toast.success("Announcement completed")
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-railway-blue">Create Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainNumber">Train Number*</Label>
              <Input
                id="trainNumber"
                name="trainNumber"
                placeholder="e.g. 12345"
                value={trainInfo.trainNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainName">Train Name*</Label>
              <Input
                id="trainName"
                name="trainName"
                placeholder="e.g. Rajdhani Express"
                value={trainInfo.trainName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origin Station</Label>
              <Input
                id="origin"
                name="origin"
                placeholder="e.g. Delhi"
                value={trainInfo.origin}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination Station</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="e.g. Mumbai"
                value={trainInfo.destination}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform Number*</Label>
              <Input
                id="platform"
                name="platform"
                placeholder="e.g. 3"
                value={trainInfo.platform}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementType">Announcement Type*</Label>
              <Select 
                onValueChange={(value) => handleTypeChange(value as AnnouncementType)} 
                defaultValue={announcementType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select announcement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arrival">Arrival</SelectItem>
                  <SelectItem value="departure">Departure</SelectItem>
                  <SelectItem value="delay">Delay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {announcementType === "delay" && (
            <div className="mt-4 space-y-4">
              <Separator className="my-2" />
              <h3 className="text-lg font-medium">Delay Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delayTime">Delay Time*</Label>
                  <Input
                    id="delayTime"
                    name="delayTime"
                    placeholder="e.g. 45 minutes"
                    value={trainInfo.delayTime}
                    onChange={handleChange}
                    required={announcementType === "delay"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updatedArrival">Updated Arrival Time*</Label>
                  <Input
                    id="updatedArrival"
                    name="updatedArrival"
                    placeholder="e.g. 14:30"
                    value={trainInfo.updatedArrival}
                    onChange={handleChange}
                    required={announcementType === "delay"}
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-railway-blue hover:bg-railway-lightBlue text-white"
          >
            Generate & Play Announcement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnnouncementForm;
