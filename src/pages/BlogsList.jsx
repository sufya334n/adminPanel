import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlogs } from '../api';
import '../styles/BlogsList.css';

export default function BlogsList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBlogs()
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch blogs');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="blogs-list-container">Loading...</div>;
  if (error) return <div className="blogs-list-container">{error}</div>;

  return (
    <div className="blogs-list-container">
      <div className="blog-card create-card" onClick={() => navigate('/dashboard/blogs/create')}>
        <span className="plus-icon">+</span>
        <span>Create Blog</span>
      </div>
      {blogs.map(blog => (
        <div className="blog-card" key={blog._id}>
          <img src={blog.image} alt={blog.title} className="blog-image" />
          <h3>{blog.title}</h3>
          <p>{blog.excerpt}</p>
          <button onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}>Edit</button>
        </div>
      ))}
    </div>
  );
} 