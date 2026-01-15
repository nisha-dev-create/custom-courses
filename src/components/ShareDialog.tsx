import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Copy, Mail, Link2, Lock, Globe } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  courseId: string;
  isShared: boolean;
  onShareSettingChange: (isPublic: boolean) => void;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  courseTitle,
  courseId,
  isShared,
  onShareSettingChange,
}: ShareDialogProps) => {
  const { toast } = useToast();
  const [accessLevel, setAccessLevel] = useState<"restricted" | "anyone">(
    isShared ? "anyone" : "restricted"
  );
  const [email, setEmail] = useState("");

  const shareLink = `${window.location.origin}/course/${courseId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copied!",
        description: "The course link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleShareViaEmail = () => {
    if (!email.trim()) {
      toast({
        title: "Enter an email",
        description: "Please enter an email address to share with.",
        variant: "destructive",
      });
      return;
    }

    const subject = encodeURIComponent(`Check out this course: ${courseTitle}`);
    const body = encodeURIComponent(
      `I wanted to share this course with you!\n\n${courseTitle}\n\nView it here: ${shareLink}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    
    toast({
      title: "Opening email client",
      description: "Your email client should open shortly.",
    });
    setEmail("");
  };

  const handleAccessChange = (value: "restricted" | "anyone") => {
    setAccessLevel(value);
    onShareSettingChange(value === "anyone");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Share "{courseTitle}"
          </DialogTitle>
          <DialogDescription>
            Choose who can access this course and share the link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Access Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">General access</Label>
            <RadioGroup
              value={accessLevel}
              onValueChange={(value) => handleAccessChange(value as "restricted" | "anyone")}
              className="space-y-2"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="restricted" id="restricted" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="restricted" className="font-medium cursor-pointer">
                      Restricted
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Only you can access this course
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="anyone" id="anyone" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="anyone" className="font-medium cursor-pointer">
                      Anyone with the link
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Anyone with the link can view this course
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Copy link</Label>
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1 bg-muted/50 text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share via Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Share via email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleShareViaEmail();
                  }
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleShareViaEmail}
                className="shrink-0"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
