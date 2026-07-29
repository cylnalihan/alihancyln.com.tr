import type { DeepWiden } from "@/i18n/types";
import type { errors as trErrors } from "@/i18n/dictionaries/tr/errors";

export const errors = {
  notFound: {
    code: "404 / СТРАНИЦА НЕ НАЙДЕНА",
    title: "Эта страница недоступна.",
    description:
      "Адрес мог измениться или страница была удалена. Вернитесь на главную либо познакомьтесь с моими услугами.",
    home: "На главную",
    services: "Смотреть услуги",
  },
  runtime: {
    code: "СИСТЕМА / ОШИБКА",
    title: "Что-то пошло не по плану.",
    description: "Попробуйте ещё раз или безопасно вернитесь на главную.",
    retry: "Повторить",
    home: "На главную",
  },
} satisfies DeepWiden<typeof trErrors>;
