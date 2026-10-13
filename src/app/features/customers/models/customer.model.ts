export interface CustomerFormData {
  customerName: string;
  mobileNumber: string;
  address: string; // Required
  email?: string;
  gstNumber?: string;
  description?: string; // Optional
}

// Backend Request DTO matching .NET CustomerCreateDto
export interface CustomerCreateDto {
  name: string;
  mobileNumber: string;
  address: string; // Required
  email?: string | null;
  gstNumber?: string | null;
  description?: string | null; // Optional
}

// Backend Response DTO matching .NET CustomerResponseDto
export interface CustomerResponseDto {
  id: number;
  name: string;
  mobileNumber: string;
  address: string; // Required
  email?: string | null;
  gstNumber: string; // Displays "No GST Number" when null on backend
  description?: string | null;
  isB2B: boolean;
}

export interface Customer {
  id: number;
  name: string;
  customerName?: string; // Compatibility alias
  mobileNumber: string;
  address: string; // Required
  email?: string | null;
  gstNumber: string;
  description?: string | null;
  isB2B: boolean;
}