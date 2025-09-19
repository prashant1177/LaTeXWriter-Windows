import "./App.css";
import React, { useState } from "react";
import Landing from "./Pages/Landing/Landing";
import Navbar from "./components/Navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Pages/UserAuth/Login";
import Register from "./Pages/UserAuth/Register";
import Sidebar from "./components/Sidebar";
import { setAuthToken, setPremiumExpiredHandler } from "./api";
import UserEdit from "./Pages/UserView/UserEdit";
import CreateProject from "./Pages/Projects/CreateProject";
import EditorIndex from "./Pages/LatexEditor/EditorIndex";
import TemplatesIndex from "./Pages/Templates/TemplatesIndex";
import LatexDocumentationIndex from "./Pages/Documentation/LatexDocumentationIndex";
import MyProfileIndex from "./Pages/Projects/MyProjectsList/MyProfileIndex";
import LatexWriterDocumentationIndex from "./Pages/Documentation/LatexWriterDocumentationIndex";
import LatexWriterDocumentationPageView from "./Pages/Documentation/LatexWriterDocumentationPageView";
import Connect from "./Pages/Projects/Connect";
import PremiumUpgradePage from "./Pages/Premium/PremiumUpgradePage";
function App() {
  const [isActive, setIsActive] = useState(false);
  const [sidebarHide, setSidebarHide] = useState("w-16");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  setAuthToken(token);
  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/");
  };

  // function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthToken(null);
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsActive((prev) => !prev); // toggle class
    if (isActive) {
      setSidebarHide("w-16");
    } else {
      setSidebarHide("w-64");
    }
  };
    setPremiumExpiredHandler(() => {
    navigate("/premiumexpired");
  });
  return (
      <div>
        {token ? (
          <Sidebar
            toggleSidebar={toggleSidebar}
            sidebarHide={sidebarHide}
            isActive={isActive}
            logout={handleLogout}
          />
        ) : (
          <Navbar />
        )}

        <div
          className={`main-content transition-all duration-300 ${
            token ? `${isActive ? "ml-64" : "ml-16"}` : ""
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={token ? <MyProfileIndex /> : <Landing />}
            />

            <Route
              path="/register"
              element={<Register onLogin={handleLogin} />}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/latexeditor/:projectid" element={<EditorIndex />} />
            <Route path="/user" element={<UserEdit />} />
            <Route path="/templates" element={<TemplatesIndex />} />

            {/*    Sitepage */}
            <Route
              path="/documentation/latex"
              element={<LatexDocumentationIndex />}
            />
            <Route
              path="/documentation/latexwriter"
              element={<LatexWriterDocumentationIndex />}
            />
            <Route
              path="/documentation/latexwriter/:slug"
              element={<LatexWriterDocumentationPageView />}
            />
            <Route path="/premiumexpired" element={<PremiumUpgradePage />} />

            <Route path="/create/project" element={<CreateProject />} />
            <Route path="/connect" element={<Connect />} />
          </Routes>
        </div>
      </div>
  );
}
//
export default App;
