export function WhatsAppLink({
  dictionary,
}: {
  dictionary: {
    whatsappLabel: string;
    whatsappTitle: string;
    whatsappText: string;
  };
}) {
  return (
    <a
      className="email-link"
      href="https://wa.me/905424029871"
      aria-label={dictionary.whatsappLabel}
      title={dictionary.whatsappTitle}
    >
      <svg
        className="email-link-icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20.25 11.6a8.25 8.25 0 0 1-12.18 7.24L3.5 20.25l1.48-4.41A8.25 8.25 0 1 1 20.25 11.6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.35 7.7c.18-.35.37-.36.64-.36h.54c.17 0 .34.05.43.3l.72 1.76c.08.2.04.38-.08.54l-.56.7c-.12.15-.13.29-.03.47.45.8 1.08 1.5 1.84 2.04.22.15.39.25.58.02l.73-.86c.15-.18.34-.22.54-.14l1.72.81c.22.1.37.23.4.4.04.27-.08 1.12-.57 1.59-.48.47-1.18.71-1.92.7-1.13-.02-2.62-.65-4.08-1.95-1.75-1.55-2.72-3.53-2.75-4.72-.02-.5.14-.91.35-1.3Z"
          fill="currentColor"
        />
      </svg>
      <span>{dictionary.whatsappText}</span>
    </a>
  );
}
