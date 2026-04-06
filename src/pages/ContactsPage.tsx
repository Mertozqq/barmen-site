import { PageHero } from "../components/shared/PageHero";
import { YandexMap } from "../components/shared/YandexMap";
import { siteContent } from "../content/siteContent";
import { useLeadModal } from "../context/LeadModalContext";
import insideClubImage from "../assets/inside-club.webp";

export function ContactsPage() {
  const { openLeadModal } = useLeadModal();
  const phoneHref = `tel:${siteContent.brand.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Свяжитесь с нами для записи на обучение"
        text="На сайте оставлены самые удобные каналы связи: Telegram, телефон, электронная почта и форма заявки."
      />

      <section className="section">
        <div className="container contacts-media">
          <YandexMap address={siteContent.contacts.address} />
          <div className="contact-media-card">
            <img className="contact-media-image" src={insideClubImage} alt="Интерьер клуба" loading="lazy" />
          </div>
        </div>

        <div className="container contact-grid">
          <article className="contact-card">
            <h3>Telegram</h3>
            <a href={siteContent.brand.telegram} rel="noopener noreferrer" target="_blank">
              {siteContent.brand.telegramLabel}
            </a>
          </article>

          <article className="contact-card">
            <h3>Телефон</h3>
            <a href={phoneHref}>{siteContent.brand.phone}</a>
          </article>

          <article className="contact-card">
            <h3>Email</h3>
            <a href={`mailto:${siteContent.brand.email}`}>{siteContent.brand.email}</a>
          </article>

          <article className="contact-card">
            <h3>Адрес</h3>
            <p>{siteContent.contacts.address}</p>
          </article>
        </div>

        <div className="contact-banner">
          <div>
            <span className="eyebrow">Запись на курс</span>
            <h2>Если хотите сначала поговорить с командой, оставьте заявку</h2>
          </div>
          <button className="button button--primary" type="button" onClick={openLeadModal}>
            Отправить заявку
          </button>
        </div>
      </section>
    </>
  );
}
