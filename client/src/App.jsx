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
import AuthorBlogsPage from "./pages/AuthorBlogsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthorPostPage from "./pages/AuthorPostPage";

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/post/:id" element={<PostPage />} />{" "}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/author-posts"
              element={
                <ProtectedRoute>
                  <AuthorBlogsPage />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/author-posts/:id"
              element={
                <ProtectedRoute>
                  <AuthorPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
