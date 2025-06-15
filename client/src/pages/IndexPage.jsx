import { useEffect, useState } from "react";
import Post from "../components/Post";

export default function IndexPage() {
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/blogs?page=${page}&limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
          credentials: "include",
        });

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
      }
    }

    fetchData();
  }, [page]);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} {...post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>

      <div className="pagination-controls" style={{ marginTop: "20px" }}>
        <button onClick={prevPage} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </>
  );
}
