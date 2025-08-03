// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getBlogById, updateBlog } from '../api';
// import '../styles/EditBlog.css';

// export default function EditBlog() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     title: '',
//     excerpt: '',
//     content: '',
//     image: '',
//     category: '',
//     tags: '',
//     author: '',
//     date: '',
//     views: '',
//     isPublished: false,
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     getBlogById(id)
//       .then(data => {
//         setForm({
//           ...data,
//           tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
//           date: data.date ? data.date.slice(0, 10) : '',
//         });
//         setLoading(false);
//       })
//       .catch(() => {
//         setError('Failed to fetch blog');
//         setLoading(false);
//       });
//   }, [id]);

//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     setForm(f => ({
//       ...f,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setSaving(true);
//     setError(null);
//     try {
//       const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
//       await updateBlog(id, data);
//       setSaving(false);
//       navigate('/dashboard/blogs');
//     } catch (err) {
//       setError('Failed to update blog');
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="edit-blog-container">Loading...</div>;
//   if (error) return <div className="edit-blog-container">{error}</div>;

//   return (
//     <div className="edit-blog-container">
//       <h2>Edit Blog</h2>
//       <form className="edit-blog-form" onSubmit={handleSubmit}>
//         <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
//         <input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" required />
//         <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required />
//         <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required />
//         <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
//         <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
//         <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
//         <input name="date" value={form.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" type="date" required />
//         <input name="views" value={form.views} onChange={handleChange} placeholder="Views" type="number" />
//         <label className="checkbox-label">
//           <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={handleChange} />
//           Published
//         </label>
//         <button type="submit" disabled={saving}>{saving ? 'Updating...' : 'Update Blog'}</button>
//         {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
//       </form>
//     </div>
//   );
// } 

























import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../api';
import '../styles/EditBlog.css';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: '',
    author: '',
    isPublished: false,
    // date اور views کو state میں رکھیں گے لیکن UI پر نہیں دکھائیں گے
    date: '',
    views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBlogById(id)
      .then(data => {
        setForm({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          date: data.date ? data.date.slice(0, 10) : '',
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch blog');
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = { 
        ...form, 
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) 
      };
      await updateBlog(id, data);
      setSaving(false);
      navigate('/dashboard/blogs');
    } catch (err) {
      setError('Failed to update blog');
      setSaving(false);
    }
  };

  if (loading) return <div className="edit-blog-container">Loading...</div>;
  if (error) return <div className="edit-blog-container">{error}</div>;

  return (
    <div className="edit-blog-container">
      <h2>Edit Blog</h2>
      <form className="edit-blog-form" onSubmit={handleSubmit}>
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
        
        <button type="submit" disabled={saving}>{saving ? 'Updating...' : 'Update Blog'}</button>
        {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
      </form>
    </div>
  );
}