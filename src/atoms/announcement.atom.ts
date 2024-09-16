import { atom, useAtom, useSetAtom } from "jotai";

export const announcementAtom = atom<string | undefined>(undefined);

export function useAnnouncement() {
  return useAtom(announcementAtom);
}

export function useSetAnnouncement() {
  return useSetAtom(announcementAtom);
}
