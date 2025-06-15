import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";

export default function EditPost() {
  const token = localStorage.getItem("token");

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      credentials: "include",
    }).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.data.title);
        setDescription(postInfo.data.description);
        setBody(postInfo.data.body);
        setTags(postInfo.data.tags.map((tag) => tag.name).toString());
      });
    });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("description", description);
    data.set("body", body);
    // data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    tagArray.forEach((tag) => data.append("tags[]", tag));
    const response = await fetch(`/api/blogs/me/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <form onSubmit={updatePost}>
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
      <button style={{ marginTop: "5px" }}>Update post</button>
    </form>
  );
}
