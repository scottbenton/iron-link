import { setDoc } from "firebase/firestore";

import { getUserAccessibilitySettingsDoc } from "./_getRef";
import { ApiFunction } from "api-calls/createApiFunction";
import { AccessibilitySettingsDocument } from "api-calls/user/settings/_settings.type";

export const updateAccessibilitySettings: ApiFunction<
  { uid: string; settings: Partial<AccessibilitySettingsDocument> },
  void
> = (params) => {
  const { uid, settings } = params;
  return setDoc(getUserAccessibilitySettingsDoc(uid), settings, {
    merge: true,
  });
};
