import { useState, useEffect, useRef } from "react";
import Blogs from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [redErrorMessage, setRedErrorMessage] = useState(null);
  const [greenErrorMessage, setGreenErrorMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      // console.log(user);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []); //Get token from Local Storage if it exists. This helps in login without needing password

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []); // Gets all the blogs from the backend

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setGreenErrorMessage("Login successful");
      setTimeout(() => setGreenErrorMessage(null), 3000);
    } catch (exception) {
      setRedErrorMessage("Invalid username or password");
      setTimeout(() => setRedErrorMessage(null), 3000);
    }
  };//Handles login functionality

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    blogService.setToken(null);
  }; //Handles logout

  const createNewBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      setGreenErrorMessage(`A new blog "${blogObject.title}" by ${blogObject.author} added`);
      setTimeout(() => setGreenErrorMessage(null), 3000);
      blogFormRef.current.toggleVisibility(); //change the form visibility using ref
    } catch (exception) {
      setRedErrorMessage("Error creating blog");
      setTimeout(() => setRedErrorMessage(null), 3000);
    }
  }; // createNewBlog

  return (
    <div>
      {redErrorMessage && <div style={{ color: "red", fontWeight: "bold" }}>{redErrorMessage}</div>}
      {greenErrorMessage && <div style={{ color: "green", fontWeight: "bold" }}>{greenErrorMessage}</div>}

      {user === null ? (
        <Togglable buttonLabel="Login">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      ) : (
        <>
          <h2>Blogs</h2>
          <p>Logged in as {user.name} <button onClick={handleLogout}>Logout</button></p>

          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm createNewBlog={createNewBlog} />
          </Togglable>

          <Blogs blogs={blogs} loggedInUser={user} />
        </>
      )}
    </div>
  );
};

export default App;
