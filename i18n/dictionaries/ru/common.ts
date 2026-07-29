import type { DeepWiden } from "@/i18n/types";
import type { common as trCommon } from "@/i18n/dictionaries/tr/common";

export const common = {
  navigation: {
    ariaLabel: "Основная навигация",
    mobileAriaLabel: "Мобильная навигация",
    home: "Главная",
    services: "Мои услуги",
    contact: "Контакты",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    brandHome: "Alihan Ceylan — Главная",
  },
  languageSwitcher: { ariaLabel: "Выбор языка" },
  footer: {
    ariaLabel: "Навигация в подвале",
    copyright: "Все права защищены.",
  },
  digitalWorld: {
    buttonLabel: "Показать информацию об удалённой работе",
    eyebrow: "ФОРМАТ / AC",
    message: "Я веду проекты удалённо, в удобном онлайн-формате.",
    location: "Турция · Удалённая работа",
  },
  matrix: { buttonLabel: "Запустить цифровую анимацию" },
  contactLinks: {
    emailLabel: "Отправить письмо Alihan Ceylan",
    emailTitle: "Отправить письмо",
    emailText: "Email",
    whatsappLabel: "Связаться с Alihan Ceylan в WhatsApp",
    whatsappTitle: "Написать в WhatsApp",
    whatsappText: "WhatsApp",
  },
} satisfies DeepWiden<typeof trCommon>;
