import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type LeadFormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const defaultLeadForm: LeadFormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [form, setForm] = useState(defaultLeadForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setForm(defaultLeadForm);
      setStatus("");
      setError("");
      setSubmitting(false);
    }
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    setError("");

    try {
      const response = await api.submitLead(form);
      setStatus(response.message);
      setForm(defaultLeadForm);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Не удалось отправить заявку.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-card__close" type="button" onClick={onClose}>
          Закрыть
        </button>
        <span className="eyebrow">Запись на обучение</span>
        <h2>Оставьте контакты, и мы подскажем по программе, расписанию и оплате</h2>

        <form className="lead-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Имя</span>
            <input
              required
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
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span>Комментарий</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({ ...current, message: event.target.value }))
              }
            />
          </label>

          {status ? <p className="form-success">{status}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}

          <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Отправляем..." : "Отправить заявку"}
          </button>
          <p className="checkbox-field checkbox-field--note">
            Нажимая кнопку, вы подтверждаете согласие с{" "}
            <Link to="/privacy">политикой конфиденциальности</Link> и{" "}
            <Link to="/consent">согласием на обработку персональных данных</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
