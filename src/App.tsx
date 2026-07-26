import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import MyWorks from "./pages/MyWorks";
import NotFound from "./pages/not-found";
import Cursor from "./components/Cursor";

function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <div className="app-content app-visible">
        <Routes>
          <Route path="/" element={<MainContainer />} />
          <Route path="/myworks" element={<MyWorks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
