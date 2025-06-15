// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { UserContextProvider } from "./components/UserContext";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import EditPostPage from "./pages/EditPostPage";

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<PostPage />} />{" "}
            <Route path="/edit/:id" element={<EditPostPage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
