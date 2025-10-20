
// src/types/google-maps.d.ts
import * as _google from 'google.maps';

declare global {
  const google: typeof _google;
  interface Window {
    google: typeof _google;
    showFullInfoPopup: (businessId: string) => void;
    gm_authFailure: () => void;
  }
}
