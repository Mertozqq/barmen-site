function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function getTbankProviderMeta(env) {
  return {
    id: "tbank",
    name: "ТБанк",
    description: "Оплата через Т-Банк.",
    available: true,
    configured: isTbankConfigured(env),
  };
}

export function isTbankConfigured(env) {
  return hasValue(env.tbankTerminalKey) && hasValue(env.tbankSecretKey);
}

export function assertTbankConfigured(env) {
  if (isTbankConfigured(env)) {
    return;
  }

  throw new Error(
    "Т-Банк еще не настроен: заполните TBANK_TERMINAL_KEY и TBANK_SECRET_KEY в окружении сервера.",
  );
}

export function getSellerRequisites(env) {
  return {
    company_name: env.sellerCompanyName,
    inn: env.sellerInn,
    checking_account: env.sellerCheckingAccount,
    bank_name: env.sellerBankName,
    bank_bik: env.sellerBankBik,
    correspondent_account: env.sellerCorrespondentAccount,
  };
}

export function buildTbankInitPayload(order, env) {
  return {
    TerminalKey: env.tbankTerminalKey,
    Amount: order.amount,
    OrderId: order.order_id,
    Description: order.course_name,
    NotificationURL: env.tbankNotificationUrl,
    SuccessURL: env.tbankSuccessUrl,
    FailURL: env.tbankFailUrl,
    DATA: {
      email: order.email,
      phone: order.phone,
      promo: order.promo,
      payment_provider: order.payment_provider,
    },
    Receipt: {
      Email: order.email || env.sellerEmail,
      Taxation: env.tbankTaxation,
      Items: [
        {
          Name: order.course_name,
          Price: order.amount,
          Quantity: 1,
          Amount: order.amount,
          Tax: env.tbankVat,
          PaymentMethod: env.tbankPaymentMethod,
          PaymentObject: env.tbankPaymentObject,
        },
      ],
    },
  };
}

export function buildTbankIntegrationSnapshot(order, env) {
  return {
    gateway: "tbank",
    api_url: env.tbankApiUrl,
    notification_url: env.tbankNotificationUrl,
    success_url: env.tbankSuccessUrl,
    fail_url: env.tbankFailUrl,
    seller: getSellerRequisites(env),
    payload_preview: buildTbankInitPayload(order, env),
    note: "Интеграция еще не завершена: реальный запрос Init в API Т-Банка пока не отправляется.",
  };
}

export function normalizeTbankWebhook(body) {
  return {
    payment_id: String(body.PaymentId ?? body.payment_id ?? "").trim(),
    order_id: String(body.OrderId ?? body.order_id ?? "").trim(),
    status: String(body.Status ?? body.status ?? "").trim().toLowerCase(),
    success: Boolean(body.Success ?? body.success ?? false),
    raw: body,
  };
}

export function mapTbankStatus(status, success) {
  if (success && status === "confirmed") {
    return "succeeded";
  }

  if (status === "rejected" || status === "canceled" || status === "deadline_expired") {
    return "failed";
  }

  return "pending";
}
