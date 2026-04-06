import { CallToAction } from "../components/shared/CallToAction";
import { PageHero } from "../components/shared/PageHero";
import { siteContent } from "../content/siteContent";
import whiteRabbitImage from "../assets/white-rabbit.jpg";
import delicatessenImage from "../assets/delicatessen.webp";
import noorElectroImage from "../assets/Noor-electro.jpg";

const partnerImages: Record<string, string> = {
  "White Rabbit": whiteRabbitImage,
  Delicatessen: delicatessenImage,
  "Noor Electro": noorElectroImage,
};

export function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Партнеры"
        title="Партнеры и индустриальная среда"
        text="Школа встроена в контекст гостеприимства и барной индустрии, поэтому на сайте можно отдельно показать работодателей, бренды и площадки, с которыми вы работаете."
      />

      <section className="section">
        <div className="container feature-grid">
          {siteContent.partners.map((item) => (
            <article className="feature-card" key={item.title}>
              <img
                className="image-placeholder image-placeholder--partner"
                src={partnerImages[item.title]}
                alt={item.title}
                loading="lazy"
              />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <CallToAction />
    </>
  );
}
