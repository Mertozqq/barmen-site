import { siteContent } from "../../content/siteContent";
import { useLeadModal } from "../../context/LeadModalContext";

export function CallToAction() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="section">
      <div className="container cta-band">
        <div className="cta-band__copy">
          <span className="eyebrow">{siteContent.cta.eyebrow}</span>
          <h2>{siteContent.cta.title}</h2>
          <p>{siteContent.cta.text}</p>
        </div>
        <div className="cta-band__actions">
          <button className="button button--primary" type="button" onClick={openLeadModal}>
            {siteContent.cta.primaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
