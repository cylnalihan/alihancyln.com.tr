import type { DeepWiden } from "@/i18n/types";
import type { contact as trContact } from "@/i18n/dictionaries/tr/contact";

export const contact = {
  metadata: {
    title: "Contact | Alihan Ceylan",
    description:
      "Contact Alihan Ceylan about a new website or improvements to an existing project.",
  },
  eyebrow: "CONTACT",
  title: "Have an idea? Let’s make it clear.",
  description:
    "You can contact me about a new website, improving an existing project, or simply to introduce yourself.",
  availability: "Available for new projects",
  location: "Türkiye · Remote",
  workInfoLabel: "Working information",
  optionsLabel: "Contact options",
} satisfies DeepWiden<typeof trContact>;
