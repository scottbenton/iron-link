import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { atom, useAtomValue, useSetAtom } from "jotai";

import { getUserDoc } from "api-calls/user/getUserDoc";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

type UserDetailsAtom = Record<
  string,
  | {
      loading: boolean;
      user?: {
        name: string;
      };
    }
  | undefined
>;

export const userDetailsAtom = atom<UserDetailsAtom>({});

export function useLoadUserDetails(uid: string) {
  const userDetails = useAtomValue(
    useMemo(
      () => derivedAtomWithEquality(userDetailsAtom, (state) => state[uid]),
      [uid],
    ),
  );
  const setUserDetails = useSetAtom(userDetailsAtom);

  useEffect(() => {
    if (!userDetails || (!userDetails.user && !userDetails.loading)) {
      setUserDetails((prev) => ({ ...prev, [uid]: { loading: true } }));
      getUserDoc({ uid })
        .then((user) => {
          setUserDetails((prev) => ({
            ...prev,
            [uid]: { loading: false, user: { name: user.displayName } },
          }));
        })
        .catch(() => {});
    }
  }, [uid, userDetails, setUserDetails]);
}

export function useUserName(uid: string) {
  const { t } = useTranslation();
  const username = useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(
          userDetailsAtom,
          (state) => state[uid]?.user?.name ?? t("common.loading", "Loading"),
        ),
      [uid, t],
    ),
  );
  useLoadUserDetails(uid);

  return username;
}
