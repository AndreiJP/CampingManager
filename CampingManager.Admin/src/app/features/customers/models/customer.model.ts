export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}
