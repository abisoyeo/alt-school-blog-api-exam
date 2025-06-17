import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import Post from "../components/Post";

export default function AuthorPosts() {
  const { fetchWithAuth } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let url = `/api/blogs/me?page=${page}&limit=5`;
        if (statusFilter !== "all") url += `&state=${statusFilter}`;

        const result = await fetchWithAuth(url);
        if (result.success === true) {
          const blogs = await result.message.json();
          setPosts(blogs.data);
          setTotalPages(blogs.pagination.totalPages);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          console.error("Error fetching author's posts");
          const errorData = await result.message;
          setError(errorData || "Fetching posts Failed");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, statusFilter]);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div>
      {error && (
        <div className="error" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}
      <div className="filter-button">
        <button
          onClick={() => setStatusFilter("all")}
          disabled={statusFilter === "all"}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("draft")}
          disabled={statusFilter === "draft"}
          style={{ marginLeft: "5px" }}
        >
          Draft
        </button>
        <button
          onClick={() => setStatusFilter("published")}
          disabled={statusFilter === "published"}
          style={{ marginLeft: "5px" }}
        >
          Published
        </button>
      </div>
      <h2>Your Posts</h2>

      {loading ? (
        <div>Loading posts...</div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <Post key={post._id} {...post} />
          ))}
          <div className="pagination-controls">
            <button onClick={prevPage} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={nextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
