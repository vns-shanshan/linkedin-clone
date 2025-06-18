import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
