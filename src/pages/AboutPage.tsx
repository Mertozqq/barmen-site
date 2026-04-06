import certificate1 from "../assets/certificate-1.png";
import certificate2 from "../assets/certificate-2.png";
import { CallToAction } from "../components/shared/CallToAction";
import { ContentImage } from "../components/shared/ContentImage";
import { PageHero } from "../components/shared/PageHero";
import { siteContent } from "../content/siteContent";

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О школе"
        title={siteContent.about.introTitle}
        text={siteContent.about.introText}
      />

      <section className="section">
        <div className="container about-grid">
          <article className="about-card about-card--large">
            <span className="eyebrow">Подход</span>
            <h2>Практика, сервис и карьерная логика вместо декоративного обучения</h2>
            <p>
              Школа строит программу вокруг реальной барной смены: как работать с гостем,
              держать скорость, понимать командную роль и чувствовать себя уверенно в
              первом трудоустройстве.
            </p>
          </article>

          {siteContent.about.cards.map((item) => (
            <article className="about-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="container about-media">
          <ContentImage src={certificate1} alt="Сертификат школы 1" />
          <ContentImage src={certificate2} alt="Сертификат школы 2" />
        </div>
      </section>

      <CallToAction />
    </>
  );
}
