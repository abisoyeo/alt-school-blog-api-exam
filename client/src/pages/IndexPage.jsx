import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useSearchParams } from "react-router-dom";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs?page=${currentPage}&limit=5`);
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
  }, [currentPage]);

  const nextPage = () =>
    setSearchParams({ page: Math.min(currentPage + 1, totalPages) });
  const prevPage = () =>
    setSearchParams({ page: Math.max(currentPage - 1, 1) });

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
            <button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
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
