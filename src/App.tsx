import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import MainContainer from "./components/MainContainer";
import MyWorks from "./pages/MyWorks";
import Cursor from "./components/Cursor";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <Cursor />
      {loading && <Loading />}
      <div className={`app-content ${loading ? "app-hidden" : "app-visible"}`}>
        <Routes>
          <Route path="/" element={<MainContainer />} />
          <Route path="/myworks" element={<MyWorks />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
