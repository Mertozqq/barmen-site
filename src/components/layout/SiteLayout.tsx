import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { siteContent } from "../../content/siteContent";
import { useLeadModal } from "../../context/LeadModalContext";

export function SiteLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { openLeadModal } = useLeadModal();
  const phoneHref = `tel:${siteContent.brand.phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" to="/">
            <span className="brand__mark">{siteContent.brand.mark}</span>
            <span>
              {siteContent.brand.shortName}
              <small>{siteContent.brand.tagline}</small>
            </span>
          </Link>

          <button
            className={`site-header__burger ${isMenuOpen ? "is-open" : ""}`}
            type="button"
            aria-label="Открыть меню"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`site-header__nav ${isMenuOpen ? "is-open" : ""}`}>
            {siteContent.navigation.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  `site-header__link ${isActive ? "is-active" : ""}`
                }
                to={item.to}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={`site-header__actions ${isMenuOpen ? "is-hidden" : ""}`}>
            <button className="button button--primary" type="button" onClick={openLeadModal}>
              Записаться
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div>
            <div className="brand brand--footer">
              <span className="brand__mark">{siteContent.brand.mark}</span>
              <span>
                {siteContent.brand.shortName}
                <small>{siteContent.brand.tagline}</small>
              </span>
            </div>
            <div className="site-footer__legal-meta">
              <span>{siteContent.brand.companyName}</span>
              <span>ИНН {siteContent.brand.inn}</span>
              <span>ОГРНИП {siteContent.brand.ogrnip}</span>
            </div>
          </div>

          <div>
            <h3 className="site-footer__title">Навигация</h3>
            <div className="site-footer__links">
              {siteContent.navigation.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="site-footer__title">Документы</h3>
            <div className="site-footer__links">
              <Link to="/privacy">Политика конфиденциальности</Link>
              <Link to="/consent">Согласие на обработку данных</Link>
              <Link to="/distribution-consent">Согласие на распространение данных</Link>
              <Link to="/offer">Оферта</Link>
            </div>
          </div>

          <div>
            <h3 className="site-footer__title">Контакты</h3>
            <div className="site-footer__links">
              <a href={siteContent.brand.telegram} rel="noopener noreferrer" target="_blank">
                {siteContent.brand.telegramLabel}
              </a>
              <a href={phoneHref}>{siteContent.brand.phone}</a>
              <a href={`mailto:${siteContent.brand.email}`}>{siteContent.brand.email}</a>
              <span>{siteContent.brand.schedule}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
