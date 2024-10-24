import { onSnapshot } from "firebase/firestore";

import { getUserAccessibilitySettingsDoc } from "api-calls/user/settings/_getRef";
import { AccessibilitySettingsDocument } from "api-calls/user/settings/_settings.type";

export const listenToAccessibilitySettings = (
  uid: string,
  onSettings: (settings: AccessibilitySettingsDocument) => void,
) => {
  return onSnapshot(getUserAccessibilitySettingsDoc(uid), (snapshot) => {
    onSettings(snapshot.data() ?? {});
  });
};
