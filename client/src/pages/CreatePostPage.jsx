import "react-quill-new/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
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

      const response = await fetch("/api/blogs/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: data,
        credentials: "include",
      });
      if (response.ok) {
        setRedirect(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
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
        Create post
      </button>
    </form>
  );
}
