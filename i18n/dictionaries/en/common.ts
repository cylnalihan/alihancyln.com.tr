import type { DeepWiden } from "@/i18n/types";
import type { common as trCommon } from "@/i18n/dictionaries/tr/common";

export const common = {
  navigation: {
    ariaLabel: "Main navigation",
    mobileAriaLabel: "Mobile navigation",
    home: "Home",
    services: "What Can I Do?",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    brandHome: "Alihan Ceylan — Home",
  },
  languageSwitcher: { ariaLabel: "Language selection" },
  footer: {
    ariaLabel: "Footer navigation",
    copyright: "All rights reserved.",
  },
  digitalWorld: {
    buttonLabel: "Show remote working information",
    eyebrow: "WORKFLOW / AC",
    message: "I manage projects through a remote, online workflow.",
    location: "Based in Türkiye · Remote work",
  },
  matrix: { buttonLabel: "Play digital animation" },
  contactLinks: {
    emailLabel: "Send Alihan Ceylan an email",
    emailTitle: "Send an email",
    emailText: "Email",
    whatsappLabel: "Contact Alihan Ceylan on WhatsApp",
    whatsappTitle: "Message on WhatsApp",
    whatsappText: "WhatsApp",
  },
} satisfies DeepWiden<typeof trCommon>;
