import { middletownDEProfile } from "./middletownDE";
import { nationalHarborMDProfile } from "./nationalHarborMD";

export const defaultProfileId = "middletown-de";

export const locationProfiles = [middletownDEProfile, nationalHarborMDProfile];

export function getProfileById(profileId = defaultProfileId) {
  return locationProfiles.find((profile) => profile.id === profileId) ?? locationProfiles[0];
}

export function profileCenterArray(profile) {
  return [profile.center.lat, profile.center.lng];
}
