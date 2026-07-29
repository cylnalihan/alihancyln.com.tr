import type { DeepWiden } from "@/i18n/types";
import type { errors as trErrors } from "@/i18n/dictionaries/tr/errors";

export const errors = {
  notFound: {
    code: "404 / PAGE NOT FOUND",
    title: "The page you’re looking for is unavailable.",
    description:
      "The address may have changed or the page may have been removed. Return home or explore the web solutions I offer.",
    home: "Back to Home",
    services: "View Services",
  },
  runtime: {
    code: "SYSTEM / UNEXPECTED ERROR",
    title: "Something didn’t go as planned.",
    description: "Try again or return safely to the home page.",
    retry: "Try Again",
    home: "Back to Home",
  },
} satisfies DeepWiden<typeof trErrors>;
