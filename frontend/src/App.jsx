import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Pages/UserAuth/Login";
import { setAuthToken, setPremiumExpiredHandler } from "./api";
import UserEdit from "./Pages/UserView/UserEdit";
import CreateProject from "./Pages/Projects/CreateProject";
import EditorIndex from "./Pages/LatexEditor/EditorIndex";
import MyProfileIndex from "./Pages/Projects/MyProjectsList/MyProfileIndex";
import PremiumUpgradePage from "./Pages/Premium/PremiumUpgradePage";
import { socket } from "./socket";
function App() {
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

  setPremiumExpiredHandler(() => {
    navigate("/premiumexpired");
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        socket.auth = { token: localStorage.getItem("token") };
        if (!socket.connected) socket.connect();
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchData();
    return () => {
      socket.off("connect");
      socket.off("error");
    };
  }, [token]);
  return (
    <div className="universal-font">
      <Routes>
        <Route
          path="/"
          element={token ? <MyProfileIndex /> : <Login onLogin={handleLogin} />}
        />
        <Route path="/latexeditor/:projectid" element={<EditorIndex />} />
        <Route
          path="/user"
          element={<UserEdit handleLogout={handleLogout} />}
        />
        <Route path="/premiumexpired" element={<PremiumUpgradePage />} />
        <Route path="/create/project" element={<CreateProject />} />
      </Routes>
    </div>
  );
}

export default App;
