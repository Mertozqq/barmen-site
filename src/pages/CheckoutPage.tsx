import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import courseManImage from "../assets/instructor-to-buy.png";
import { PageHero } from "../components/shared/PageHero";
import { siteContent } from "../content/siteContent";
import { api, type PaymentConfig, type PaymentProviderMeta } from "../lib/api";
import { formatCurrency } from "../lib/format";
import {
  validateEmail,
  validateName,
  validatePhone,
  validatePromo,
} from "../lib/validation";

type PaymentFormState = {
  name: string;
  phone: string;
  email: string;
  promo: string;
  agreement: boolean;
  paymentProvider: string;
};

const defaultForm: PaymentFormState = {
  name: "",
  phone: "",
  email: "",
  promo: "",
  agreement: false,
  paymentProvider: "tbank",
};

const courseHighlights = [
  {
    title: "Практика за стойкой",
    tooltip:
      "Работаем не только с теорией: на курсе студенты учатся держать темп смены, собирать рабочее место и уверенно готовить базовую классику.",
  },
  {
    title: "Сервис и коммуникация",
    tooltip:
      "Отдельно разбираем контакт с гостем, подачу, спокойную работу под нагрузкой и то, как выглядит сильный сервис в реальной смене.",
  },
  {
    title: "Подготовка к старту",
    tooltip:
      "Финальные модули помогают собрать навыки в рабочую систему и подойти к первой работе без лишней растерянности.",
  },
];

export function CheckoutPage() {
  const [form, setForm] = useState(defaultForm);
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [providers, setProviders] = useState<PaymentProviderMeta[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([api.getPaymentConfig(), api.getPaymentProviders()])
      .then(([paymentConfig, paymentProviders]) => {
        if (!active) {
          return;
        }

        setConfig(paymentConfig);
        setProviders(paymentProviders.providers);
        setForm((current) => ({
          ...current,
          paymentProvider: paymentProviders.default_provider || current.paymentProvider,
        }));
      })
      .catch((requestError) => {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Не удалось загрузить параметры оплаты.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const priceRub = config?.price_rub ?? siteContent.course.priceRub;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const validationError =
      validateName(form.name) ||
      validatePhone(form.phone) ||
      validateEmail(form.email) ||
      validatePromo(form.promo);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.createPayment({
        name: form.name,
        phone: form.phone,
        email: form.email,
        promo: form.promo.trim(),
        course_name: config?.course_name ?? siteContent.course.name,
        amount: config?.price ?? siteContent.course.priceRub * 100,
        payment_provider: form.paymentProvider,
      });

      window.location.href = response.payment_url;
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Не удалось создать оплату.",
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Оплата"
        title="Оплата курса"
        text="Заполните данные, при необходимости добавьте промокод и выберите удобный способ оплаты."
      />

      <section className="section">
        <div className="container checkout-layout">
          <article className="checkout-card">
            <span className="eyebrow">Ваш заказ</span>

            <div className="checkout-course-card">
              <div className="checkout-course-card__header">
                <div className="checkout-course-card__image-wrap">
                  <img
                    className="checkout-course-card__image"
                    src={courseManImage}
                    alt="Курс обучения барменов"
                  />
                </div>

                <div className="checkout-course-card__title">
                  <span className="checkout-course-card__label">Курс</span>
                  <h2>{config?.course_name ?? siteContent.course.name}</h2>
                  <p>{siteContent.course.subtitle}</p>
                </div>
              </div>

              <div className="checkout-course-card__features">
                {courseHighlights.map((item) => (
                  <div className="checkout-course-card__feature" key={item.title}>
                    <span>{item.title}</span>
                    <span className="checkout-course-card__feature-icon" tabIndex={0}>
                      i
                      <span className="checkout-course-card__tooltip">{item.tooltip}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="checkout-card__list checkout-card__list--prices">
              <div className="checkout-card__item checkout-card__item--price is-total">
                <span>К оплате</span>
                <strong>{formatCurrency(priceRub)}</strong>
              </div>
            </div>

            <div className="checkout-referral">
              <strong>Скидка за друга</strong>
              <p>
                Если вас пригласил выпускник или знакомый, скидку можно уточнить у команды школы
                перед оплатой.
              </p>
            </div>
          </article>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <label className="field">
                <span>Имя</span>
                <input
                  required
                  minLength={2}
                  maxLength={60}
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Телефон</span>
                <input
                  required
                  maxLength={24}
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  required
                  maxLength={120}
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Промокод</span>
                <input
                  maxLength={32}
                  type="text"
                  value={form.promo}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      promo: event.target.value.toUpperCase(),
                    }))
                  }
                />
              </label>
            </div>

            <div className="provider-list">
              {providers.map((provider) => (
                <label
                  className={`provider-card ${!provider.available ? "is-disabled" : ""}`}
                  key={provider.id}
                >
                  <input
                    checked={form.paymentProvider === provider.id}
                    disabled={!provider.available}
                    name="payment-provider"
                    type="radio"
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        paymentProvider: provider.id,
                      }))
                    }
                  />
                  <div>
                    <strong>{provider.name}</strong>
                    <p>{provider.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <label className="checkbox-field">
              <input
                checked={form.agreement}
                required
                type="checkbox"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    agreement: event.target.checked,
                  }))
                }
              />
              <span>
                Я ознакомлен(а) с <Link to="/privacy">политикой конфиденциальности</Link>,{" "}
                <Link to="/consent">согласием на обработку персональных данных</Link> и{" "}
                <Link to="/offer">офертой</Link>.
              </span>
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Переходим к оплате..." : `Оплатить ${formatCurrency(priceRub)}`}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
