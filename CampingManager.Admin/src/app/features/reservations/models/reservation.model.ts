export type ReservationStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | 'NoShow';

export interface Reservation {
  id: number;
  reservationCode: string;
  customerId: number;
  customerFullName: string;
  customerEmail: string;
  pitchId: number;
  pitchNumber: string;
  pitchName: string;
  checkInDate: string;
  checkOutDate: string;
  adultsCount: number;
  childrenCount: number;
  petsCount: number;
  campingEquipmentTypeId: number;
  campingEquipmentTypeCode: string;
  campingEquipmentTypeName: string;
  vehiclePlate: string | null;
  status: ReservationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveReservationRequest {
  reservationCode: string;
  customerId: number;
  pitchId: number;
  checkInDate: string;
  checkOutDate: string;
  adultsCount: number;
  childrenCount: number;
  petsCount: number;
  campingEquipmentTypeId: number;
  vehiclePlate: string | null;
  status: ReservationStatus;
  notes: string | null;
}

export interface PitchAvailability {
  pitchId: number;
  pitchNumber: string;
  pitchName: string;
  isAvailable: boolean;
  blockingReservationCodes: string[];
}
