import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useSearchParams } from "react-router-dom";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filter/sort inputs
  const [searchTitle, setSearchTitle] = useState(
    searchParams.get("title") || ""
  );
  const [searchAuthor, setSearchAuthor] = useState(
    searchParams.get("author") || ""
  );
  const [searchTags, setSearchTags] = useState(searchParams.get("tags") || "");
  const [sortField, setSortField] = useState(searchParams.get("sort") || "");
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("order") || "desc"
  );

  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Function to apply filters and sorting
  const applyFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "1"); // Reset to page 1 when applying new filters

    if (searchTitle.trim()) {
      newSearchParams.set("title", searchTitle.trim());
    }
    if (searchAuthor.trim()) {
      newSearchParams.set("author", searchAuthor.trim());
    }
    if (searchTags.trim()) {
      newSearchParams.set("tags", searchTags.trim());
    }
    if (sortField) {
      newSearchParams.set("sort", sortField);
      newSearchParams.set("order", sortOrder);
    }

    setSearchParams(newSearchParams);
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTitle("");
    setSearchAuthor("");
    setSearchTags("");
    setSortField("");
    setSortOrder("desc");
    setSearchParams({ page: "1" });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Construct the query string with all parameters
        const query = new URLSearchParams();
        query.set("page", currentPage.toString());
        query.set("limit", "5");

        // Add filter parameters if they exist in searchParams
        const titleParam = searchParams.get("title");
        const authorParam = searchParams.get("author");
        const tagsParam = searchParams.get("tags");
        const sortParam = searchParams.get("sort");
        const orderParam = searchParams.get("order");

        if (titleParam) query.set("title", titleParam);
        if (authorParam) query.set("author", authorParam);
        if (tagsParam) query.set("tags", tagsParam);
        if (sortParam) {
          query.set("sort", sortParam);
          query.set("order", orderParam || "desc");
        }

        const queryString = query.toString();
        const response = await fetch(`/api/blogs?${queryString}`);

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
  }, [currentPage, searchParams]);

  const nextPage = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      "page",
      Math.min(currentPage + 1, totalPages).toString()
    );
    setSearchParams(newSearchParams);
  };

  const prevPage = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", Math.max(currentPage - 1, 1).toString());
    setSearchParams(newSearchParams);
  };

  return (
    <>
      <div className="filter-sort-section">
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Search by Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Author"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Tags (comma-separated)"
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <div className="sort-controls">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="createdAt">Created Date</option>
              <option value="read_count">Read Count</option>
              <option value="reading_time">Reading Time</option>
            </select>

            {sortField && (
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            )}
          </div>
          <button onClick={applyFilters}>Apply Filters</button>
          <button onClick={clearFilters} className="clear-button">
            Clear All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
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
