import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  assertTbankConfigured,
  buildTbankIntegrationSnapshot,
  createTbankPayment,
  getTbankProviderMeta,
  mapTbankStatus,
  normalizeTbankWebhook,
} from "./payments/tbank.mjs";
import {
  getFirstValidationError,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
  validatePromo,
} from "./validation.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.join(__dirname, "storage");
const clientDistDir = path.join(__dirname, "..", "dist");
const clientIndexFile = path.join(clientDistDir, "index.html");

const env = {
  port: Number(process.env.PORT ?? 8787),
  publicAppUrl: process.env.PUBLIC_APP_URL ?? "http://localhost:5173",
  courseName: process.env.COURSE_NAME ?? "Курс Бармен-Профессионал",
  coursePriceRub: Number(process.env.COURSE_PRICE_RUB ?? 39500),
  defaultProvider: process.env.DEFAULT_PAYMENT_PROVIDER ?? "tbank",
  sellerCompanyName:
    process.env.SELLER_COMPANY_NAME ?? "ИП Сидоров Игорь Олегович",
  sellerInn: process.env.SELLER_INN ?? "482305314617",
  sellerEmail: process.env.SELLER_EMAIL ?? "glass_and_ice@mail.ru",
  sellerCheckingAccount:
    process.env.SELLER_CHECKING_ACCOUNT ?? "40802810000007421339",
  sellerBankName: process.env.SELLER_BANK_NAME ?? "АО «ТБанк»",
  sellerBankBik: process.env.SELLER_BANK_BIK ?? "044525974",
  sellerCorrespondentAccount:
    process.env.SELLER_CORRESPONDENT_ACCOUNT ?? "30101810145250000974",
  tbankTerminalKey: process.env.TBANK_TERMINAL_KEY ?? "",
  tbankSecretKey: process.env.TBANK_SECRET_KEY ?? "",
  tbankApiUrl: process.env.TBANK_API_URL ?? "https://securepay.tinkoff.ru/v2",
  tbankNotificationUrl:
    process.env.TBANK_NOTIFICATION_URL ??
    "http://localhost:8787/api/payments/tbank/webhook",
  tbankSuccessUrl:
    process.env.TBANK_SUCCESS_URL ?? "http://localhost:5173/payment/success",
  tbankFailUrl:
    process.env.TBANK_FAIL_URL ?? "http://localhost:5173/payment/fail",
  tbankUseMinimalInit: process.env.TBANK_USE_MINIMAL_INIT !== "false",
  tbankSendReceipt: process.env.TBANK_SEND_RECEIPT === "true",
  tbankTaxation: process.env.TBANK_TAXATION ?? "usn_income",
  tbankVat: process.env.TBANK_VAT ?? "none",
  tbankPaymentMethod:
    process.env.TBANK_PAYMENT_METHOD ?? "full_prepayment",
  tbankPaymentObject: process.env.TBANK_PAYMENT_OBJECT ?? "service",
};

const app = express();
const orders = new Map();

app.use(cors());
app.use(express.json({ limit: "64kb" }));

const paymentProviders = [getTbankProviderMeta(env)];

function rublesToKopecks(value) {
  return Number(value) * 100;
}

async function appendRecord(fileName, record) {
  await fs.mkdir(storageDir, { recursive: true });
  await fs.appendFile(
    path.join(storageDir, fileName),
    `${JSON.stringify(record)}\n`,
    "utf8",
  );
}

function sanitizeLead(body) {
  return {
    name: String(body.name ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    email: String(body.email ?? "").trim(),
    message: String(body.message ?? "").trim(),
  };
}

function sanitizeOrder(body) {
  return {
    name: String(body.name ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    email: String(body.email ?? "").trim(),
    promo: String(body.promo ?? "").trim().toUpperCase(),
    course_name: String(body.course_name ?? env.courseName).trim(),
    amount: Number(body.amount ?? rublesToKopecks(env.coursePriceRub)),
    payment_provider: String(body.payment_provider ?? env.defaultProvider).trim(),
  };
}

function buildOrder(orderId, payload) {
  const amount = payload.amount || rublesToKopecks(env.coursePriceRub);

  return {
    order_id: orderId,
    status: "pending",
    created_at: new Date().toISOString(),
    course_name: payload.course_name,
    amount,
    email: payload.email,
    phone: payload.phone,
    payment_provider: payload.payment_provider,
    promo: payload.promo,
    payment_url: null,
    payment_id: null,
    payment_details: null,
  };
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/payments/config", (_request, response) => {
  response.json({
    price: rublesToKopecks(env.coursePriceRub),
    price_rub: env.coursePriceRub,
    course_name: env.courseName,
  });
});

app.get("/api/payments/providers", (_request, response) => {
  response.json({
    default_provider: env.defaultProvider,
    providers: paymentProviders,
  });
});

app.post("/api/leads", async (request, response) => {
  try {
    const lead = sanitizeLead(request.body);
    const leadValidationError = getFirstValidationError([
      validateName(lead.name),
      validatePhone(lead.phone),
      validateEmail(lead.email),
      validateMessage(lead.message),
    ]);

    if (leadValidationError) {
      response.status(400).json({
        error: leadValidationError,
      });
      return;
    }

    await appendRecord("leads.ndjson", {
      ...lead,
      created_at: new Date().toISOString(),
    });

    response.json({
      success: true,
      message: "Заявка получена. Мы свяжемся с вами и уточним детали обучения.",
    });
  } catch (error) {
    response.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Не удалось сохранить заявку.",
    });
  }
});

app.post("/api/payments/create", async (request, response) => {
  try {
    const payload = sanitizeOrder(request.body);
    const orderValidationError = getFirstValidationError([
      validateName(payload.name),
      validatePhone(payload.phone),
      validateEmail(payload.email),
      validatePromo(payload.promo),
    ]);

    if (orderValidationError) {
      response.status(400).json({
        error: orderValidationError,
      });
      return;
    }

    const supportedProvider = paymentProviders.find(
      (provider) => provider.id === payload.payment_provider,
    );

    if (!supportedProvider) {
      response.status(400).json({
        error: "Выбранный способ оплаты недоступен.",
      });
      return;
    }

    if (payload.payment_provider === "tbank") {
      assertTbankConfigured(env);
    }

    const orderId = crypto.randomUUID();
    const order = buildOrder(orderId, payload);

    if (payload.payment_provider === "tbank") {
      order.payment_details = buildTbankIntegrationSnapshot(order, env);
      const tbankPayment = await createTbankPayment(order, env);

      order.payment_id = tbankPayment.paymentId || null;
      order.payment_url = tbankPayment.paymentUrl;
      order.status = mapTbankStatus(tbankPayment.status, false);
      order.payment_details = {
        ...(order.payment_details ?? {}),
        init_request: tbankPayment.requestPayload,
        init_response: tbankPayment.raw,
      };
    }

    orders.set(orderId, order);
    await appendRecord("orders.ndjson", order);

    response.json({
      success: true,
      order_id: orderId,
      payment_url: order.payment_url ?? `${env.publicAppUrl}/payment/pending?order_id=${orderId}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось создать платеж.";

    const statusCode = message.includes("Т-Банк еще не настроен") ? 503 : 500;

    console.error("Payment creation failed:", error);

    response.status(statusCode).json({
      error: message,
    });
  }
});

app.post("/api/payments/tbank/webhook", async (request, response) => {
  try {
    const webhook = normalizeTbankWebhook(request.body);

    if (!webhook.order_id) {
      response.status(400).json({
        error: "В webhook Т-Банка не передан OrderId.",
      });
      return;
    }

    const order = orders.get(webhook.order_id);

    if (!order) {
      response.status(404).json({
        error: "Заказ для webhook Т-Банка не найден.",
      });
      return;
    }

    const updatedOrder = {
      ...order,
      status: mapTbankStatus(webhook.status, webhook.success),
      payment_id: webhook.payment_id || order.payment_id,
      webhook_received_at: new Date().toISOString(),
      payment_details: {
        ...(order.payment_details ?? {}),
        last_webhook: webhook.raw,
      },
    };

    orders.set(order.order_id, updatedOrder);
    await appendRecord("orders.ndjson", updatedOrder);

    response.json({ ok: true });
  } catch (error) {
    console.error("T-Bank webhook processing failed:", error);
    response.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Не удалось обработать webhook Т-Банка.",
    });
  }
});

app.get("/api/payments/status/:orderId", (request, response) => {
  const order = orders.get(request.params.orderId);

  if (!order) {
    response.json({
      order_id: request.params.orderId,
      status: "unknown",
      course_name: env.courseName,
      amount: rublesToKopecks(env.coursePriceRub),
      payment_provider: env.defaultProvider,
    });
    return;
  }

  response.json(order);
});

app.use(express.static(clientDistDir));

app.get(/^(?!\/api).*/, (_request, response) => {
  response.sendFile(clientIndexFile);
});

app.listen(env.port, () => {
  console.log(`API server listening on http://localhost:${env.port}`);
});
