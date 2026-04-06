import { useState } from "react";
import { Link } from "react-router-dom";
import instructorImage from "../assets/instructor.png";
import mainSchoolImg from "../assets/main-school-img.webp";
import fotoSZanyatiy from "../assets/foto-s-zanyatiy.png";
import reviewGirl1 from "../assets/review-girl-1.png";
import reviewBoy2 from "../assets/review-boy-2.png";
import reviewGirl3 from "../assets/review-girl-3.png";
import { CallToAction } from "../components/shared/CallToAction";
import { ContentImage } from "../components/shared/ContentImage";
import { SectionHeading } from "../components/shared/SectionHeading";
import { siteContent } from "../content/siteContent";
import { useLeadModal } from "../context/LeadModalContext";
import { formatCurrency } from "../lib/format";

const reviewImages = [reviewGirl1, reviewBoy2, reviewGirl3] as const;

export function HomePage() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <section className="hero">
        <div className="hero__glow hero__glow--one" />
        <div className="hero__glow hero__glow--two" />
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">{siteContent.hero.eyebrow}</span>
            <h1 className="hero__title">{siteContent.hero.title}</h1>
            <p className="hero__text">{siteContent.hero.description}</p>
            <div className="hero__actions">
              <button className="button button--primary" type="button" onClick={openLeadModal}>
                Записаться на обучение
              </button>
              <Link className="button button--secondary" to="/courses">
                Смотреть программу
              </Link>
            </div>

            <div className="stat-row">
              {siteContent.hero.stats.map((item) => (
                <article className="stat-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <ContentImage
            className="content-image--hero"
            src={mainSchoolImg}
            alt="Главное изображение школы"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Почему Glass&Ice"
            title="Обучение, которое готовит к реальной смене, а не только к красивой теории"
            text="Программа собрана вокруг практики, сервисной культуры и уверенного входа в профессию. На сайте сразу доступны запись, консультация, промокод и оплата."
          />

          <div className="feature-grid">
            {siteContent.valueCards.map((item) => (
              <article className="feature-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container career-choice">
          <div className="career-choice__intro">
            <span className="eyebrow">{siteContent.careerChoice.eyebrow}</span>
            <h2>{siteContent.careerChoice.title}</h2>
            <p>{siteContent.careerChoice.text}</p>
          </div>

          <div className="career-choice__grid">
            {siteContent.careerChoice.items.map((item, index) => (
              <article className="career-choice__card" key={item.title}>
                <div className="career-choice__card-header">
                  <span className="career-choice__index">0{index + 1}</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container program-preview">
          <div>
            <SectionHeading
              eyebrow="Программа курса"
              title="Пять модулей от погружения в профессию до подготовки к первой работе"
              text="Каждый блок последовательно усиливает технику, сервис и понимание барной индустрии, чтобы к финалу курса у студента складывалась рабочая система."
            />
            <div className="program-preview__outcomes">
              {siteContent.course.outcomes.map((item) => (
                <div className="outcome-pill" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="module-stack">
            <ContentImage src={fotoSZanyatiy} alt="Фото с занятий" />
            {siteContent.course.modules.map((item, index) => (
              <article className="module-card" key={item.title}>
                <span className="module-card__index">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectoin-team">
        <div className="container">
          <div className="teacher-card">
            <div className="teacher-card__copy">
              <span className="eyebrow">Преподаватель</span>
              <div className="teacher-card__header">
                <div>
                  <h2>{siteContent.instructor.name}</h2>
                  <p className="teacher-card__role">{siteContent.instructor.role}</p>
                  <ContentImage
                    className="teacher-card__image teacher-card__image--mobile"
                    src={instructorImage}
                    alt={`Преподаватель ${siteContent.instructor.name}`}
                  />
                </div>
                <div className="teacher-card__experience">
                  <strong>{siteContent.instructor.experience}</strong>
                  <span>опыт работы в барной сфере</span>
                </div>
              </div>

              <p className="teacher-card__summary">{siteContent.instructor.summary}</p>

              <div className="teacher-card__achievements">
                {siteContent.instructor.achievements.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="teacher-card__media">
              <blockquote className="teacher-card__quote">{siteContent.instructor.quote}</blockquote>
              <ContentImage
                className="teacher-card__image teacher-card__image--desktop"
                src={instructorImage}
                alt={`Преподаватель ${siteContent.instructor.name}`}
              />
            </div>
          </div>

          <div className="mentor-card mentor-card--timeline">
            <div className="mentor-card__copy">
              <span className="eyebrow">Как проходит путь до старта</span>
              <h2>От заявки до первых занятий без лишней неопределенности</h2>
              <p className="mentor-card__role">
                Показываем, как устроен старт: от первого сообщения и консультации до подтверждения
                места и организационных деталей.
              </p>
            </div>

            <div className="mentor-card__panel">
              <div className="timeline">
                {siteContent.timeline.map((item) => (
                  <article className="timeline__item" key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container">
          <SectionHeading
            eyebrow="Отзывы"
            title="Истории студентов и выпускников без шаблонного рекламного шума"
            text="Отзывы помогают заранее понять, как проходит обучение, что дает программа на практике и что меняется после старта в индустрии."
          />

          <div className="review-grid">
            {siteContent.reviews.map((item, index) => (
              <article className="review-card" key={item.name}>
                <ContentImage
                  className="content-image--review"
                  src={reviewImages[index]}
                  alt={`Отзыв студента ${item.name}`}
                />
                <p>{item.text}</p>
                <div className="review-card__author">
                  <strong>{item.name} — </strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-card">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>Частые вопросы по обучению, оплате и скидкам</h2>
          </div>

          <div className="faq-list">
            {siteContent.faq.map((item, index) => (
              <FaqItem
                answer={item.answer}
                isDefaultOpen={index === 0}
                key={item.question}
                question={item.question}
              />
            ))}
          </div>
        </div>
      </section>

      <CallToAction />

      <section className="section">
        <div className="container hero-card hero-card--bottom">
          <span className="hero-card__label">{siteContent.course.label}</span>
          <h2>{siteContent.course.name}</h2>
          <p>{siteContent.course.subtitle}</p>

          <div className="hero-card__meta">
            <div>
              <span>Длительность: </span>
              <strong>{siteContent.course.duration}</strong>
            </div>
            <div>
              <span>Формат: </span>
              <strong>{siteContent.course.format}</strong>
            </div>
            <div>
              <span>Набор: </span>
              <strong>{siteContent.course.nextStart}</strong>
            </div>
          </div>

          <div className="hero-card__price">
            <span>Стоимость: </span>
            <strong>{formatCurrency(siteContent.course.priceRub)}</strong>
          </div>

          <Link className="button button--dark checkout-button" to="/oplata">
            Перейти к оплате
          </Link>
        </div>
      </section>
    </>
  );
}

type FaqItemProps = {
  question: string;
  answer: string;
  isDefaultOpen?: boolean;
};

function FaqItem({ question, answer, isDefaultOpen = false }: FaqItemProps) {
  const [isOpen, setOpen] = useState(isDefaultOpen);

  return (
    <div className={`faq-item ${isOpen ? "is-open" : ""}`}>
      <button
        aria-expanded={isOpen}
        className="faq-item__trigger"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{question}</span>
        <span className="faq-item__icon">{isOpen ? "−" : "+"}</span>
      </button>
      <div className="faq-item__content" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
