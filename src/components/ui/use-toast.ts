
import { useToast, toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

// Re-export original hooks/functions
export { useToast };
export { toast };

// Also re-export Sonner's toast with its full API
export { sonnerToast };
