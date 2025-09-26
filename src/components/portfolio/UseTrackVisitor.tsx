import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

function UseTrackVisitor() {
  useEffect(() => {
    const track = async () => {
      try {
        await supabase.from("Visitors").insert({
          ip_address: window.location.hostname, 
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        console.error("Error logging visitor:", error);
      }
    };
    track();
  }, []);
}

export default UseTrackVisitor;
