import styles from "./ProjectFaq.module.css";

type FaqDictionary = {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly { question: string; answer: string }[];
};

export function ProjectFaq({ dictionary }: { dictionary: FaqDictionary }) {
  return (
    <section className={styles.faq} aria-labelledby="project-faq-title">
      <div className={styles.faqGlow} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.faqLayout}>
          <div className={styles.faqIntro}>
            <p className={styles.sectionIndex}>{dictionary.eyebrow}</p>
            <h2 id="project-faq-title">{dictionary.title}</h2>
            <p>{dictionary.description}</p>
          </div>
          <div className={styles.faqList}>
            {dictionary.items.map((item, index) => (
              <details className={styles.faqItem} key={item.question}>
                <summary>
                  <span className={styles.faqNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.faqQuestion}>{item.question}</span>
                  <span className={styles.faqIndicator} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
