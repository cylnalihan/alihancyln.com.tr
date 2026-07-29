import type { DeepWiden } from "@/i18n/types";
import type { contact as trContact } from "@/i18n/dictionaries/tr/contact";

export const contact = {
  metadata: {
    title: "Контакты | Alihan Ceylan",
    description:
      "Свяжитесь с Alihan Ceylan по поводу нового сайта или развития существующего проекта.",
  },
  eyebrow: "КОНТАКТЫ",
  title: "Есть идея? Давайте придадим ей ясную форму.",
  description:
    "Вы можете обратиться ко мне за новым сайтом, развитием текущего проекта или просто для знакомства.",
  availability: "Открыт для новых проектов",
  location: "Турция · Удалённо",
  workInfoLabel: "Формат работы",
  optionsLabel: "Способы связи",
} satisfies DeepWiden<typeof trContact>;
