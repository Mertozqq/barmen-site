import { Link } from "react-router-dom";
import { ImagePlaceholder } from "../components/shared/ImagePlaceholder";

export function NotFoundPage() {
  return (
    <section className="result-page">
      <div className="result-card">
        <ImagePlaceholder label="Иллюстрация 404" />
        <span className="eyebrow">404</span>
        <h1>Страница не найдена</h1>
        <p>Похоже, такого маршрута нет. Вернитесь на главную или откройте нужный раздел из меню.</p>
        <Link className="button button--primary" to="/">
          На главную
        </Link>
      </div>
    </section>
  );
}
