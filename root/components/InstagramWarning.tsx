import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function InstagramWarningDialog() {
  const [isInstagramBrowser, setIsInstagramBrowser] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(isInstagramBrowser);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/Instagram/.test(userAgent)) {
      setIsInstagramBrowser(true);
    }
  }, []);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  if (!isInstagramBrowser) return null;

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>Notice</AlertDialogTitle>
        <AlertDialogDescription>
          For the best experience, please use a standard web browser to access
          the website.
        </AlertDialogDescription>
        <AlertDialogAction asChild>
          <Button onClick={handleCloseDialog}>I Understand</Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
