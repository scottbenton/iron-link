import { setDoc } from "firebase/firestore";

import { ApiFunction } from "api-calls/createApiFunction";
import { getUserAccessibilitySettingsDoc } from "api-calls/user/settings/_getRef";
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
