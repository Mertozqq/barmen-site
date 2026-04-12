import crypto from "node:crypto";

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function buildTbankToken(payload, secretKey) {
  const tokenSource = { Password: secretKey };

  for (const [key, value] of Object.entries(payload)) {
    if (key === "Token" || value == null || typeof value === "object") {
      continue;
    }

    tokenSource[key] = String(value);
  }

  const rawToken = Object.keys(tokenSource)
    .sort()
    .map((key) => tokenSource[key])
    .join("");

  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function buildTbankNotificationToken(body, secretKey) {
  const tokenSource = { Password: secretKey };

  for (const [key, value] of Object.entries(body ?? {})) {
    if (key === "Token" || value == null || typeof value === "object") {
      continue;
    }

    tokenSource[key] = String(value);
  }

  const rawToken = Object.keys(tokenSource)
    .sort()
    .map((key) => tokenSource[key])
    .join("");

  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function withOrderId(url, orderId) {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set("order_id", orderId);
  return parsedUrl.toString();
}

export function getTbankProviderMeta(env) {
  return {
    id: "tbank",
    name: "Т-Банк",
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
  const payload = {
    TerminalKey: env.tbankTerminalKey,
    Amount: order.amount,
    OrderId: order.order_id,
    Description: order.course_name,
    NotificationURL: env.tbankNotificationUrl,
    SuccessURL: withOrderId(env.tbankSuccessUrl, order.order_id),
    FailURL: withOrderId(env.tbankFailUrl, order.order_id),
  };

  if (!env.tbankUseMinimalInit) {
    payload.DATA = {
      email: order.email,
      phone: order.phone,
      promo: order.promo,
      payment_provider: order.payment_provider,
    };
  }

  if (env.tbankSendReceipt) {
    payload.Receipt = {
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
    };
  }

  return payload;
}

export function buildTbankIntegrationSnapshot(order, env) {
  return {
    gateway: "tbank",
    api_url: env.tbankApiUrl,
    notification_url: env.tbankNotificationUrl,
    success_url: env.tbankSuccessUrl,
    fail_url: env.tbankFailUrl,
    minimal_init: env.tbankUseMinimalInit,
    receipt_enabled: env.tbankSendReceipt,
    seller: getSellerRequisites(env),
    payload_preview: buildTbankInitPayload(order, env),
  };
}

export async function createTbankPayment(order, env) {
  const payload = buildTbankInitPayload(order, env);
  const token = buildTbankToken(payload, env.tbankSecretKey);
  const requestPayload = {
    ...payload,
    Token: token,
  };

  let response;

  try {
    response = await fetch(`${env.tbankApiUrl}/Init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });
  } catch (error) {
    const details =
      error instanceof Error
        ? [error.message, error.cause instanceof Error ? error.cause.message : ""]
            .filter(Boolean)
            .join(" | ")
        : "Неизвестная ошибка сети";

    throw new Error(`Не удалось отправить Init-запрос в Т-Банк: ${details}`);
  }

  let responsePayload;

  try {
    responsePayload = await response.json();
  } catch {
    throw new Error("Т-Банк вернул некорректный ответ на Init-запрос.");
  }

  if (!response.ok) {
    throw new Error(
      responsePayload?.Message ||
        responsePayload?.Details ||
        "Не удалось создать платеж в Т-Банке.",
    );
  }

  if (!responsePayload?.Success || !hasValue(responsePayload?.PaymentURL)) {
    throw new Error(
      responsePayload?.Message ||
        responsePayload?.Details ||
        "Т-Банк не вернул ссылку на оплату.",
    );
  }

  return {
    paymentId: String(responsePayload.PaymentId ?? "").trim(),
    paymentUrl: String(responsePayload.PaymentURL ?? "").trim(),
    status: String(responsePayload.Status ?? "").trim().toLowerCase(),
    raw: responsePayload,
    requestPayload,
  };
}

export function normalizeTbankWebhook(body) {
  return {
    payment_id: String(body.PaymentId ?? body.payment_id ?? "").trim(),
    order_id: String(body.OrderId ?? body.order_id ?? "").trim(),
    status: String(body.Status ?? body.status ?? "").trim().toLowerCase(),
    success: Boolean(body.Success ?? body.success ?? false),
    token: String(body.Token ?? body.token ?? "").trim(),
    raw: body,
  };
}

export function validateTbankWebhookToken(body, secretKey) {
  const providedToken = String(body?.Token ?? body?.token ?? "").trim().toLowerCase();

  if (!providedToken) {
    return false;
  }

  const expectedToken = buildTbankNotificationToken(body, secretKey);
  return expectedToken === providedToken;
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
