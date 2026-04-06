import { ImagePlaceholder } from "../components/shared/ImagePlaceholder";
import { PageHero } from "../components/shared/PageHero";
import { siteContent } from "../content/siteContent";

export type LegalKind = "privacy" | "offer" | "consent";

type LegalPageProps = {
  kind: LegalKind;
};

export function LegalPage({ kind }: LegalPageProps) {
  const title =
    kind === "privacy"
      ? "Политика конфиденциальности"
      : kind === "consent"
        ? "Согласие на обработку персональных данных"
        : "Публичная оферта";

  const content =
    kind === "privacy"
      ? siteContent.legal.privacy
      : kind === "consent"
        ? siteContent.legal.consent
        : siteContent.legal.offer;

  return (
    <>
      <PageHero
        eyebrow="Документы"
        title={title}
        text="Юридические документы вынесены на отдельные страницы, чтобы можно было заранее ознакомиться с условиями обработки данных и оплаты."
      />

      <section className="section">
        <div className="container legal-card">
          <ImagePlaceholder label="Иллюстрация документа" />
          {content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </>
  );
}
