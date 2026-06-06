import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import MyWorks from "./pages/MyWorks";
import Cursor from "./components/Cursor";

function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <div className="app-content app-visible">
        <Routes>
          <Route path="/" element={<MainContainer />} />
          <Route path="/myworks" element={<MyWorks />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
