import { CallToAction } from "../components/shared/CallToAction";
import { ContentImage } from "../components/shared/ContentImage";
import { PageHero } from "../components/shared/PageHero";
import { siteContent } from "../content/siteContent";
import reviewGirl1 from "../assets/review-girl-1.png";
import reviewBoy2 from "../assets/review-boy-2.png";
import reviewGirl3 from "../assets/review-girl-3.png";

const reviewImages = [reviewGirl1, reviewBoy2, reviewGirl3] as const;

export function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Отзывы"
        title="Отзывы выпускников и студентов"
        text="Отдельная страница помогает спокойно изучить опыт тех, кто уже прошел обучение, и понять, как программа ощущается изнутри."
      />

      <section className="section">
        <div className="container review-grid review-grid--expanded">
          {siteContent.reviews.map((item, index) => (
            <article className="review-card review-card--full" key={item.name}>
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
      </section>

      <CallToAction />
    </>
  );
}
