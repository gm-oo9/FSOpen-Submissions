import { useState } from 'react';
import blogService from '../services/blogs';

const BlogItem = ({ blog, loggedInUser }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    setLikes((prevLikes) => {
      const newLikes = prevLikes + 1;
      // Update the likes on the backend with the newLikes value
      blogService.update(blog.blogId, { ...blog, likes: newLikes });
      return newLikes;  // Update the frontend state with the new likes 
    });
  };

  const handleRemove = () => {
    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (result) {blogService.remove(blog.blogId);}
  };
  // console.log(loggedInUser)
  // console.log(`Logged in user ${loggedInUser}`)

  return (
    <li style={{ paddingTop: 10, paddingLeft: 2, border: 'solid', borderWidth: 1, marginBottom: 5 }}>
      <strong>{blog.title}</strong> by {blog.author}{' '}
      <button onClick={toggleVisibility}>{visible ? 'Hide' : 'View'}</button>

      {visible && (
        <div>
          <p><strong>Title:</strong> {blog.title}</p>
          <p><strong>URL:</strong> {blog.url}</p>
          <p><strong>Likes:</strong> {likes} <button onClick={handleLike}>Like</button></p>
          <p><strong>Added by:</strong> {loggedInUser.name || ''}</p>

          {/* Show the Remove button only if the logged-in user is the same as the blog user */}
          {loggedInUser.id === blog.user.userId && (
            <button onClick={handleRemove}>Remove</button>
          )}
        </div>
      )}
    </li>
  );
};

const Blogs = ({ blogs, loggedInUser }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  return (
    <ul>
      {sortedBlogs.map(blog => (
        <BlogItem key={blog.blogId} blog={blog} loggedInUser={loggedInUser} />
      ))}
    </ul>
  );
};

export default Blogs;
