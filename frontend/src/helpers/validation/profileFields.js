import Joi from "joi";

export const nameField = Joi.string()
  .pattern(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґʼ'-]+$/u)
  .min(2)
  .max(30)
  .required()
  .messages({
    "string.empty": "Введіть, будь ласка, ваше ім'я",
    "string.min": "Ім'я повинно містити щонайменше 2 символи",
    "string.max": "Ім'я не може бути довше 30 символів",
    "string.pattern.base": "Ім'я містить недопустимі символи",
  });

export const emailField = Joi.string()
  .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.email": "Введіть, будь ласка, коректну електронну пошту.",
    "string.empty": "Email не може бути порожнім.",
    "string.pattern.base": "Не коректна електронна пошта.",
  });

export const passwordField = Joi.string()
  .pattern(/^[A-Za-z0-9!@#$%^&*()]+$/)
  .min(4)
  .max(20)
  .required()
  .messages({
    "string.empty": "Введіть, будь ласка, пароль.",
    "string.min": "Пароль має містити щонайменше 4 символи.",
    "string.max": "Пароль не може перевищувати 20 символів.",
    "string.pattern.base": "Пароль містить недопустимі символи.",
  });

export const loginSchema = Joi.object({
  email: emailField,
  password: passwordField,
});

export const registerSchema = Joi.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});
