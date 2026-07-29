export function EmailLink({
  dictionary,
}: {
  dictionary: { emailLabel: string; emailTitle: string; emailText: string };
}) {
  return (
    <a
      className="email-link"
      href="mailto:cylnalihan@gmail.com"
      aria-label={dictionary.emailLabel}
      title={dictionary.emailTitle}
    >
      <svg
        className="email-link-icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4.75 6.75h14.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H4.75a1.5 1.5 0 0 1-1.5-1.5v-9.5a1.5 1.5 0 0 1 1.5-1.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m4 8 6.82 5.05a2 2 0 0 0 2.36 0L20 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{dictionary.emailText}</span>
    </a>
  );
}
