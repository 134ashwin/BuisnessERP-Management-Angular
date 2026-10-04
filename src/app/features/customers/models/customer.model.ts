export interface CustomerFormData {
  orderNo: string;
  mainSku: string;
  subSku: string;
  size: string;
  customerName: string;
  description: string;
}

export interface Customer extends CustomerFormData {
  id?: string | number;
  createdAt?: string;
  status?: string;
}

// For Backend API POST Payload
export interface CreateCustomerRequestDto {
  orderNo: string;
  mainSku: string;
  subSku: string | null;
  size: string | null;
  customer: string; // 👈 Matches C# CreateCustomerOrderDto
  description: string | null;
}
