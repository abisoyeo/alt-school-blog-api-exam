import { useEffect, useState } from "react";
import Post from "../components/Post";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/blogs?page=${page}&limit=5`);
        setLoading(true);

        if (response.ok) {
          const result = await response.json();
          setPosts(result.data);
          setTotalPages(result.pagination.totalPages);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          console.error("Error fetching blogs");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  if (loading) {
    return <div>Loading posts...</div>;
  }
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <>
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
    </>
  );
}
