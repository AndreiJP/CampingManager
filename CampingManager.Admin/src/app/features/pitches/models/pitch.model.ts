export interface Pitch {
  id: number;
  pitchNumber: string;
  pitchName: string;
  isActive: boolean;
}

export interface SavePitchRequest {
  pitchNumber: string;
  pitchName: string;
  isActive: boolean;
}
