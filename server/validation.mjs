const NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s'-]+$/;
const PHONE_ALLOWED_REGEX = /^[\d+\s()-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROMO_REGEX = /^[A-ZА-ЯЁ0-9_-]+$/;

export function validateName(value) {
  const name = String(value ?? "").trim();

  if (name.length < 2) {
    return "Введите имя не короче 2 символов.";
  }

  if (name.length > 60) {
    return "Имя не должно быть длиннее 60 символов.";
  }

  if (!NAME_REGEX.test(name)) {
    return "Имя может содержать только буквы, пробелы, дефис и апостроф.";
  }

  return "";
}

export function validatePhone(value) {
  const phone = String(value ?? "").trim();
  const digits = phone.replace(/\D/g, "");

  if (!phone) {
    return "Введите номер телефона.";
  }

  if (!PHONE_ALLOWED_REGEX.test(phone)) {
    return "Телефон содержит недопустимые символы.";
  }

  if (digits.length < 10 || digits.length > 15) {
    return "Введите корректный номер телефона.";
  }

  return "";
}

export function validateEmail(value) {
  const email = String(value ?? "").trim();

  if (!email) {
    return "Введите email.";
  }

  if (email.length > 120) {
    return "Email не должен быть длиннее 120 символов.";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Введите корректный email.";
  }

  return "";
}

export function validatePromo(value) {
  const promo = String(value ?? "").trim().toUpperCase();

  if (!promo) {
    return "";
  }

  if (promo.length > 32) {
    return "Промокод не должен быть длиннее 32 символов.";
  }

  if (!PROMO_REGEX.test(promo)) {
    return "Промокод может содержать только буквы, цифры, дефис и нижнее подчеркивание.";
  }

  return "";
}

export function validateMessage(value) {
  const message = String(value ?? "").trim();

  if (!message) {
    return "";
  }

  if (message.length > 1000) {
    return "Комментарий не должен быть длиннее 1000 символов.";
  }

  return "";
}

export function getFirstValidationError(validations) {
  return validations.find(Boolean) ?? "";
}
