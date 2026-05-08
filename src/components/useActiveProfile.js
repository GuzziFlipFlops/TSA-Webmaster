import { useEffect, useState } from "react";
import { getActiveProfile } from "../services/resourceProvider";

export default function useActiveProfile() {
  const [profile, setProfile] = useState(() => getActiveProfile());

  useEffect(() => {
    function handleProfileChange(event) {
      setProfile(event.detail ?? getActiveProfile());
    }

    function handleStorage(event) {
      if (event.key === "cc-active-location-profile") setProfile(getActiveProfile());
    }

    window.addEventListener("cc-profile-change", handleProfileChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("cc-profile-change", handleProfileChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return profile;
}
