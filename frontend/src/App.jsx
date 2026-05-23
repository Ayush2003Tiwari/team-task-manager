import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Projects from "./Pages/Projects";

function App() {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            userInfo ? (
              <Dashboard />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;