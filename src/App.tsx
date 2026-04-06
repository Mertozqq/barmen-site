import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { LeadModalProvider } from "./context/LeadModalContext";
import { AboutPage } from "./pages/AboutPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ConsentPage } from "./pages/ConsentPage";
import { ContactsPage } from "./pages/ContactsPage";
import { CoursesPage } from "./pages/CoursesPage";
import { DistributionConsentPage } from "./pages/DistributionConsentPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OfferPage } from "./pages/OfferPage";
import { PartnersPage } from "./pages/PartnersPage";
import { PaymentResultPage } from "./pages/PaymentResultPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ReviewsPage } from "./pages/ReviewsPage";

function App() {
  return (
    <LeadModalProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactsPage />} />
          <Route path="/contacts" element={<Navigate replace to="/contact" />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/consent" element={<ConsentPage />} />
          <Route path="/distribution-consent" element={<DistributionConsentPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/oplata" element={<CheckoutPage />} />
          <Route path="/checkout" element={<Navigate replace to="/oplata" />} />
          <Route path="/payment/success" element={<PaymentResultPage success />} />
          <Route path="/payment/fail" element={<PaymentResultPage success={false} />} />
          <Route path="/payment/pending" element={<PaymentResultPage success={false} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </LeadModalProvider>
  );
}

export default App;
