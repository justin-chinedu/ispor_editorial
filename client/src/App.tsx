import { BottomSheetProvider } from "./components/bottom_sheet/bottom_sheet"
import { Home } from "./pages/home/home"
import "./index.css";
import { Route, Routes, useLocation } from "react-router";
import { HashRouter } from "react-router-dom";
import { AnonConsultantsPage } from "./pages/anon_consultants/anon_consultants";
import { useEffect } from "react";

function App() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, key]);

  return (
    <BottomSheetProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anonymous" element={<AnonConsultantsPage />} />
      </Routes>
    </BottomSheetProvider>
  )
}

export default App
