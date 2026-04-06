import { Link } from "react-router-dom";
import studyProccess from "../assets/study-proccess.jpg";
import { ContentImage } from "../components/shared/ContentImage";
import { PageHero } from "../components/shared/PageHero";
import { siteContent } from "../content/siteContent";
import { useLeadModal } from "../context/LeadModalContext";
import { formatCurrency } from "../lib/format";

export function CoursesPage() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <PageHero eyebrow="Обучение" title={siteContent.course.name} text="Как проходит обучение?" />

      <section className="section">
        <div className="container course-layout">
          <div className="course-layout__main course-layout__main--full">
            <div className="feature-grid feature-grid--compact">
              <article className="feature-card">
                <h3>{siteContent.course.duration}</h3>
                <p>Сбалансированный темп, чтобы разобрать теорию и закрепить ее в практике.</p>
              </article>
              <article className="feature-card">
                <h3>{siteContent.course.format}</h3>
                <p>Живые занятия с разбором реальных рабочих сценариев и сервисных ситуаций.</p>
              </article>
              <article className="feature-card">
                <h3>{siteContent.course.nextStart}</h3>
                <p>Можно оставить заявку и заранее зафиксировать место в ближайшей группе.</p>
              </article>
            </div>

            <ContentImage src={studyProccess} alt="Фотографии учебного процесса" />

            <div className="course-modules">
              {siteContent.course.modules.map((item, index) => (
                <article className="course-module" key={item.title}>
                  <div className="course-module__number">{index + 1}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="checkout-card checkout-card--bottom">
              <span className="eyebrow">Стоимость курса</span>
              <h2>{formatCurrency(siteContent.course.priceRub)}</h2>
              <p>{siteContent.course.subtitle}</p>
              <div className="checkout-card__list">
                {siteContent.course.outcomes.map((item) => (
                  <div className="checkout-card__item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
              <Link className="button button--primary button--full" to="/oplata">
                Оплатить место
              </Link>
              <button
                className="button button--secondary button--full"
                type="button"
                onClick={openLeadModal}
              >
                Нужна консультация
              </button>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
