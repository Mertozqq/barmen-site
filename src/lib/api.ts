export type PaymentConfig = {
  price: number;
  price_rub: number;
  course_name: string;
};

export type PaymentProviderMeta = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  configured?: boolean;
};

export type PaymentProvidersResponse = {
  default_provider: string;
  providers: PaymentProviderMeta[];
};

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type CreatePaymentPayload = {
  name: string;
  phone: string;
  email: string;
  promo: string;
  course_name: string;
  amount: number;
  payment_provider: string;
};

export type CreatePaymentResponse = {
  success: boolean;
  order_id: string;
  payment_url: string;
};

export type PaymentStatus = {
  order_id: string;
  status: string;
  course_name: string;
  amount: number;
  email?: string;
  payment_provider?: string;
  payment_id?: string | null;
  payment_url?: string | null;
};

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Не удалось выполнить запрос.");
  }

  return payload as T;
}

export const api = {
  getPaymentConfig: () => request<PaymentConfig>("/api/payments/config"),
  getPaymentProviders: () =>
    request<PaymentProvidersResponse>("/api/payments/providers"),
  getPaymentStatus: (orderId: string) =>
    request<PaymentStatus>(`/api/payments/status/${orderId}`),
  submitLead: (payload: LeadPayload) =>
    request<{ success: boolean; message: string }>("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  createPayment: (payload: CreatePaymentPayload) =>
    request<CreatePaymentResponse>("/api/payments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
};
