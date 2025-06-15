// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { UserContextProvider } from "./components/UserContext";
import CreatePost from "./pages/CreatePostPage";

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
