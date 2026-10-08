export interface CustomerFormData {
  orderNo: string;
  mainSku: string;
  subSku: string;
  size: string;
  customerName: string;
  description: string;
}

// Backend Response DTO matching .NET CustomerOrderResponseDto
export interface CustomerOrderResponseDto {
  id: number;
  orderNo: string;
  mainSku: string;
  subSku?: string | null;
  size?: string | null;
  customer: string; // 👈 Matches C# CustomerOrderResponseDto property 'Customer'
  description?: string | null;
  createdAt: string;
}

export interface Customer {
  id?: string | number;
  orderNo: string;
  mainSku: string;
  subSku?: string | null;
  size?: string | null;
  customer: string;
  customerName: string;
  description?: string | null;
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
