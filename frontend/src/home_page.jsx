import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Login from "./login";
import Signup from "./signup";
import Admin from "./admin";
import axios from "axios";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [highlight, setHighlight] = useState(false);

  // Flower blog form fields
  const [title, setTitle] = useState('');
  const [flowerType, setFlowerType] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [care, setCare] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);

  // States for expanded post, likes, and comments
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});

  const fetchBlogs = useCallback(() => {
    axios
      .get("http://localhost:4000/api/blog")
      .then((res) => {
        setBlogs(res.data);
        if (res.data.length > 0 && !expandedPostId) {
          setExpandedPostId(res.data[0]._id);
        }
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
      });
  }, [expandedPostId]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.isAdmin) {
      setPage("admin");
    } else {
      setPage("home");
    }
    setHighlight(false);
    fetchBlogs();
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
    setBlogs([]);
    setExpandedPostId(null);
    setLikes({});
    setComments({});
  };

  const toggleExpand = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : 1,
    }));
  };

  const handleComment = (id) => {
    const commentText = prompt("Enter your comment:");
    if (!commentText) return;
    setComments((prev) => ({
      ...prev,
      [id]: prev[id] ? [...prev[id], commentText] : [commentText],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = `
Title: ${title}

Flower/Plant: ${flowerType}

Description: ${description}

Category: ${category}
Care Instructions: ${care}
Location: ${location}
Tags: ${tags}
    `.trim();

    const formData = new FormData();
    formData.append("message", content);
    formData.append("author", user.name || "User");
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:4000/api/blog", formData);
      setTitle('');
      setFlowerType('');
      setDescription('');
      setCategory('');
      setCare('');
      setLocation('');
      setTags('');
      setImage(null);
      setPage("home");
      fetchBlogs();
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error", error.message);
      }
    }
  };

  const renderBlogContent = (message) => {
    const lines = message.split('\n').filter(line => line.trim() !== '');
    return (
      <div>
        {lines.map((line, idx) => {
          const parts = line.split(':');
          return (
            <p key={idx}>
              {parts.length > 1 ? (
                <>
                  <strong>{parts[0]}:</strong> {parts.slice(1).join(':').trim()}
                </>
              ) : (
                line
              )}
            </p>
          );
        })}
      </div>
    );
  };

  // Inline CSS for post form
  const postFormContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh"
  };

  const postFormStyle = {
    background: "rgba(255,255,255,0.93)",
    padding: "30px 25px 18px 25px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(110, 64, 170, 0.12)",
    minWidth: "350px",
    maxWidth: "410px",
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "13px"
  };

  const postFormInputStyle = {
    fontSize: "15px",
    padding: "8px",
    border: "1px solid #ae8df2",
    borderRadius: "5px",
    background: "#f8f4ff",
    width: "100%",
    boxSizing: "border-box"
  };

  const postFormTextareaStyle = {
    fontSize: "15px",
    padding: "8px",
    border: "1px solid #ae8df2",
    borderRadius: "5px",
    background: "#f8f4ff",
    width: "100%",
    minHeight: "40px",
    resize: "vertical",
    boxSizing: "border-box"
  };

  const postFormButtonStyle = {
    margin: "0 8px 0 0",
    padding: "7px 20px",
    borderRadius: "6px",
    border: "none",
    background: "#ac7ff4",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background 0.2s"
  };

  const postFormCancelButtonStyle = {
    ...postFormButtonStyle,
    background: "#e3d7f5",
    color: "#6a41b6",
    border: "1px solid #b49be8"
  };

  return (
    <div className="dataviz-wrapper">
      <header className="dataviz-header">
        <div className="dataviz-logo">
          <div className="logo-icon">🌼</div>
          <span className="logo-text">Floral Blog</span>
        </div>
        <div className="header-icons">
          {!user ? (
            <>
              <button
                className={`primary-btn ${highlight ? "highlight" : ""}`}
                onClick={() => setPage("login")}
              >
                Login
              </button>
              <button
                className={`primary-btn ${highlight ? "highlight" : ""}`}
                onClick={() => setPage("signup")}
              >
                Signup
              </button>
              <button
                className="primary-btn"
                onClick={() => setPage("post")}
              >
                Post
              </button>
            </>
          ) : (
            <>
              <button className="primary-btn" onClick={handleLogout}>
                Logout
              </button>
              <button
                className="primary-btn"
                onClick={() => setPage("post")}
              >
                Post
              </button>
            </>
          )}
        </div>
      </header>

      {page === "home" && (
        <main className="dataviz-main">
          {user ? (
            <div>
              {blogs.map((blog) => (
                <div className="flash-blog-card" key={blog._id}>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleExpand(blog._id)}
                  >
                    <p>
                      <strong>{blog.author}</strong>
                    </p>
                    <p>
                      <strong>
                        {blog.message.split("\n")[0].replace("Title:", "").trim()}
                      </strong>
                    </p>
                    {blog.imageUrl && (
                      <img
                        src={`http://localhost:4000${blog.imageUrl}`}
                        alt="Blog"
                        style={{ maxWidth: "200px", maxHeight: "150px" }}
                      />
                    )}
                  </div>
                  {expandedPostId === blog._id && (
                    <>
                      {renderBlogContent(blog.message)}
                      <p>
                        <small>{new Date(blog.createdAt).toLocaleString()}</small>
                      </p>
                      <button onClick={() => handleLike(blog._id)}>
                        Like ({likes[blog._id] || 0})
                      </button>
                      <button onClick={() => handleComment(blog._id)}>
                        Comment ({comments[blog._id]?.length || 0})
                      </button>
                      <div>
                        {comments[blog._id]?.map((comm, idx) => (
                          <p key={idx}>
                            <em>{comm}</em>
                          </p>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <h1 className="main-title">Post About Flowers & Gardening</h1>
              <p className="main-desc">Share your stories, tips, pictures and more.</p>
            </>
          )}
        </main>
      )}

      {page === "post" && user && (
        <main className="dataviz-main">
          <div style={postFormContainerStyle}>
            <form style={postFormStyle} onSubmit={handleSubmit}>
              <input
                style={postFormInputStyle}
                type="text"
                value={title}
                placeholder="Blog Title"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                style={postFormInputStyle}
                type="text"
                value={flowerType}
                placeholder="Flower/Plant Type"
                onChange={(e) => setFlowerType(e.target.value)}
                required
              />
              <textarea
                style={postFormTextareaStyle}
                value={description}
                placeholder="Description/Story"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <input
                style={postFormInputStyle}
                type="text"
                value={category}
                placeholder="Category (e.g. Indoor, DIY, Care)"
                onChange={(e) => setCategory(e.target.value)}
              />
              <textarea
                style={postFormTextareaStyle}
                value={care}
                placeholder="Care Instructions"
                onChange={(e) => setCare(e.target.value)}
              />
              <input
                style={postFormInputStyle}
                type="text"
                value={location}
                placeholder="Location"
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                style={postFormInputStyle}
                type="text"
                value={tags}
                placeholder="Tags (comma separated)"
                onChange={(e) => setTags(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div style={{ display: "flex", marginTop: "10px" }}>
                <button type="submit" style={postFormButtonStyle}>
                  Post
                </button>
                <button
                  type="button"
                  style={postFormCancelButtonStyle}
                  onClick={() => setPage("home")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {page === "signup" && <Signup />}
      {page === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
      {page === "admin" && user && user.isAdmin && <Admin />}
    </div>
  );
}

export default App;
