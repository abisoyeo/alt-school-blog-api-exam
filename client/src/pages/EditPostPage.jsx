import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";

export default function EditPost() {
  const { fetchWithAuth } = useContext(UserContext);

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState("");
  const [postState, setPostState] = useState("draft");
  const [postStatus, setPostStatus] = useState("");
  const [error, setError] = useState("");

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetchWithAuth(`/api/blogs/me/${id}`).then((response) => {
      response.message.json().then((postInfo) => {
        setTitle(postInfo.data.title);
        setDescription(postInfo.data.description);
        setBody(postInfo.data.body);
        setTags(postInfo.data.tags.map((tag) => tag.name).toString());
        setPostStatus(postInfo.data.state);
      });
    });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    setError("");

    const data = new FormData();
    data.set("title", title);
    data.set("description", description);
    data.set("body", body);
    data.set("state", postState);

    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    tagArray.forEach((tag) => data.append("tags[]", tag));

    const result = await fetchWithAuth(`/api/blogs/me/${id}`, {
      method: "PUT",
      body: data,
    });

    if (result.success === true) {
      setRedirect(true);
    } else {
      const errorData = await result.message;
      setError(errorData || "Update Failed");
    }
  }

  if (redirect) {
    return <Navigate to={"/author-posts/" + id} />;
  }

  return (
    <form onSubmit={updatePost}>
      {error && (
        <div className="error" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}
      <p>
        Current Status: <strong>{postStatus.toUpperCase()}</strong>
      </p>

      <input
        type="title"
        placeholder={"Title (Required)"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="description"
        placeholder={"Description (Required)"}
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <input
        type="tags"
        placeholder={"Tags (comma separated)"}
        value={tags}
        onChange={(ev) => setTags(ev.target.value)}
      />
      <span style={{ fontSize: "0.7em", color: "gray" }}>
        Only image files (jpg, jpeg, png, webp). Max size: 5MB.
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={(ev) => setFiles(ev.target.files)}
      />
      <Editor onChange={setBody} value={body} />
      <label htmlFor="postState">Change Post Status:</label>
      <select
        id="postState"
        value={postState}
        onChange={(e) => setPostState(e.target.value)}
      >
        <option value="draft">Unpublish (Draft)</option>
        <option value="published">Publish</option>
      </select>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button type="submit">Update</button>
        <button
          type="button"
          onClick={async () => {
            await fetchWithAuth(`/api/blogs/me/${id}`, {
              method: "DELETE",
            });
            return <Navigate to={"/author-posts/"} />;
          }}
          style={{ backgroundColor: "#e63946", color: "white" }}
        >
          Delete
        </button>
      </div>
    </form>
  );
}
