export interface SpecialTrack {
  value: number;
  spentExperience?: { [index: number]: boolean };
  isLegacy?: boolean;
}

export enum ColorScheme {
  Default = "default",
  Cinder = "cinder",
  Eidolon = "eidolon",
  Hinterlands = "hinterlands",
  Myriad = "myriad",
  Mystic = "mystic",
}
