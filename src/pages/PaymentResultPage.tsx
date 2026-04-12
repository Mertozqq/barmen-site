import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import successfulPaymentImage from "../assets/successful-payment.svg";
import { ImagePlaceholder } from "../components/shared/ImagePlaceholder";
import { api, type PaymentStatus } from "../lib/api";
import { formatCurrency } from "../lib/format";

type PaymentResultPageProps = {
  success: boolean;
};

export function PaymentResultPage({ success }: PaymentResultPageProps) {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return;
    }

    api.getPaymentStatus(orderId).then(setStatus).catch(() => {
      setStatus(null);
    });
  }, [searchParams]);

  const isPending = status?.status === "pending";
  const eyebrow = success
    ? "Оплата прошла успешно"
    : isPending
      ? "Платеж подготовлен"
      : "Оплата не завершена";
  const title = success
    ? "Спасибо за оплату курса"
    : isPending
      ? "Интеграция с Т-Банком подготовлена"
      : "Платеж не был завершен";
  const description = success
    ? "Мы получили подтверждение и свяжемся с вами, чтобы отправить организационную информацию по старту обучения."
    : isPending
      ? "Проект уже создает заказ, хранит данные для Init-запроса Т-Банка и принимает webhook. Для боевого запуска осталось добавить ключи терминала и отправку реального запроса в API банка."
      : "Если оплата сорвалась, вы можете вернуться на страницу оплаты, попробовать снова или написать нам в Telegram.";

  return (
    <section className="result-page">
      <div className={`result-card ${success ? "is-success" : "is-fail"}`}>
        {success ? (
          <img
            className="result-card__status-image"
            src={successfulPaymentImage}
            alt="Успешная оплата"
          />
        ) : (
          <ImagePlaceholder label="Иконка статуса" />
        )}
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>

        {status ? (
          <div className="result-card__meta">
            <div>
              <span>Номер заказа: </span>
              <strong>{status.order_id}</strong>
            </div>
            <div>
              <span>Курс: </span>
              <strong>{status.course_name}</strong>
            </div>
            <div>
              <span>Сумма: </span>
              <strong>{formatCurrency(status.amount / 100)}</strong>
            </div>
          </div>
        ) : null}

        <div className="result-card__actions">
          <Link className="button button--primary" to="/">
            Вернуться на главную
          </Link>
          {!success && !isPending ? (
            <Link className="button button--secondary" to="/oplata">
              Повторить оплату
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
