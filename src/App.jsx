import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CTEPage from "./pages/CTEPage.jsx";
import DirectoryPage from "./pages/DirectoryPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import FundingDirectoryPage from "./pages/FundingDirectoryPage.jsx";
import FundingHomePage from "./pages/FundingHomePage.jsx";
import GrantFinderPage from "./pages/GrantFinderPage.jsx";
import GrantToolkitPage from "./pages/GrantToolkitPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LearningResourcesPage from "./pages/LearningResourcesPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import OpportunityFinderPage from "./pages/OpportunityFinderPage.jsx";
import SpotlightsPage from "./pages/SpotlightsPage.jsx";
import ClubsOpportunitiesPage from "./pages/ClubsOpportunitiesPage.jsx";
import StudentsFamiliesPage from "./pages/StudentsFamiliesPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import SuggestGrantPage from "./pages/SuggestGrantPage.jsx";
import SuggestResourcePage from "./pages/SuggestResourcePage.jsx";
import TSAPage from "./pages/TSAPage.jsx";
import VolunteerPage from "./pages/VolunteerPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/resources" element={<DirectoryPage />} />
        <Route path="/learning" element={<LearningResourcesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/clubs" element={<ClubsOpportunitiesPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/finder" element={<OpportunityFinderPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/students-families" element={<StudentsFamiliesPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/spotlights" element={<SpotlightsPage />} />
        <Route path="/suggest" element={<SuggestResourcePage />} />
        <Route path="/funding" element={<FundingHomePage />} />
        <Route path="/funding/directory" element={<FundingDirectoryPage />} />
        <Route path="/funding/finder" element={<GrantFinderPage />} />
        <Route path="/funding/toolkit" element={<GrantToolkitPage />} />
        <Route path="/funding/suggest" element={<SuggestGrantPage />} />
        <Route path="/tsa" element={<TSAPage />} />
        <Route path="/cte" element={<CTEPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
