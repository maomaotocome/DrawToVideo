import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ClearSessionButton() {
  const handleClearSession = () => {
    // Clear all sessionStorage and localStorage
    sessionStorage.clear();
    localStorage.clear();
    
    // Force reload the page
    window.location.reload();
  };

  return (
    <Button
      onClick={handleClearSession}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <RefreshCw className="w-4 h-4" />
      Clear & Reload
    </Button>
  );
}