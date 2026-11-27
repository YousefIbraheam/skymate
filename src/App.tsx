import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { AuthPage } from "./pages/AuthPage";
import { CommunityPage } from "./pages/CommunityPage";
import { DestinationPage } from "./pages/DestinationPage";
import { ExplorePage } from "./pages/ExplorePage";
import { FoodPage } from "./pages/FoodPage";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PlacePage } from "./pages/PlacePage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegionsPage } from "./pages/RegionsPage";
import { TranslatorPage } from "./pages/TranslatorPage";
import { TravelsPage } from "./pages/TravelsPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { TripNewPage } from "./pages/TripNewPage";
import { TripsPage } from "./pages/TripsPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/states" element={<RegionsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/destination/:id" element={<DestinationPage />} />
        <Route path="/place/:id" element={<PlacePage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/new" element={<TripNewPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/travels" element={<TravelsPage />} />
        <Route path="/translator" element={<TranslatorPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
