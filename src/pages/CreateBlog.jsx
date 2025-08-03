

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../api';
import '../styles/CreateBlog.css';

export default function CreateBlog() {
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: '',
    author: '',
    // date اور views کو فارم سے ہٹا دیا گیا ہے
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Convert tags string to array
      const data = { 
        ...form, 
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        // آٹومیٹک طور پر آج کی تاریخ سیٹ کریں
        date: new Date().toISOString(),
        // views کو 0 سیٹ کریں
        views: 0
      };
      await createBlog(data);
      setLoading(false);
      navigate('/dashboard/blogs');
    } catch (err) {
      setError('Failed to create blog');
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create Blog</h2>
      <form className="create-blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <input id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" value={form.content} onChange={handleChange} placeholder="Content" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input id="category" name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
        </div>
        
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input id="author" name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={handleChange} />
            Published
          </label>
        </div>
        
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Blog'}</button>
        {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
      </form>
    </div>
  );
}