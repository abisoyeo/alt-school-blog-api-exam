import "react-quill-new/dist/quill.snow.css";
import { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const { fetchWithAuth } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    setError("");

    try {
      const data = new FormData();
      data.set("title", title);
      data.set("description", description);
      data.set("body", body);
      data.set("file", files[0]);

      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      tagArray.forEach((tag) => data.append("tags[]", tag));

      const result = await fetchWithAuth("/api/blogs/me", {
        method: "POST",
        body: data,
      });

      if (result.success === true) {
        setRedirect(true);
      } else {
        const errorData = await result.message;
        setError(errorData || "Creation Failed");
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (redirect) {
    return <Navigate to={"/author-posts"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      {error && (
        <div className="error" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}
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
      <Editor value={body} onChange={setBody} />
      <button style={{ marginTop: "5px" }} type="submit">
        Save post (Draft)
      </button>
    </form>
  );
}
