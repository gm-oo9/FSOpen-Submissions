import { useState } from "react";

const BlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();
    createNewBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleCreate}>
      <h2>Create New Blog</h2>
      <div>
        Title:
        <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        Author:
        <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        URL:
        <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default BlogForm;
