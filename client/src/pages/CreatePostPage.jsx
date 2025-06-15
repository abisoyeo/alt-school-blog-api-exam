import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("description", description);
    data.set("body", body);
    data.set("tags", tags);
    data.set("file", files[0]);
    ev.preventDefault();

    const response = await fetch("http://localhost:3000/blogs", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="description"
        placeholder={"Description"}
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <input
        type="tags"
        placeholder={"Tags (comma separated)"}
        value={tags}
        onChange={(ev) => setTags(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={body} onChange={setBody} />
      <button style={{ marginTop: "5px" }}>Create post</button>
    </form>
  );
}
