export interface EquipmentType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaveEquipmentTypeRequest {
  code: string;
  name: string;
  isActive: boolean;
}
