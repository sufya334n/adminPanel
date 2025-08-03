import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, getCategories } from '../api';
import '../styles/CreateCourse.css';

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: '',
    instructor: '',
    instructorAvatar: '',
    image: '',
    duration: '',
    price: '',
    originalPrice: '',
    category: {
      name: '',
      icon: ''
    },
    tags: '',
    level: 'Beginner',
    videos: [{ title: '', url: '' }],
    description: [{ heading: '', details: [''] }],
    courseVerified: false,
    editCourse: true,
    instructorId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        // console.log('Fetched Categories:', fetchedCategories);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();

    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'categoryOption') {
      setSelectedCategoryOption(value);
      if (value === 'other') {
        setForm(prev => ({
          ...prev,
          category: { name: '', icon: '' }
        }));
      } else {
        const [categoryName, categoryIcon] = value.split('|');
        setForm(prev => ({
          ...prev,
          category: { name: categoryName, icon: categoryIcon }
        }));
      }
    } else {
      setForm(f => ({
        ...f,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };



  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...form.videos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setForm({ ...form, videos: updatedVideos });
  };

  const addVideo = () => {
    setForm({
      ...form,
      videos: [...form.videos, { title: '', url: '' }]
    });
  };

  const removeVideo = (index) => {
    const updatedVideos = [...form.videos];
    updatedVideos.splice(index, 1);
    setForm({ ...form, videos: updatedVideos });
  };

  const handleDescriptionChange = (index, field, value) => {
    const updatedDescription = [...form.description];
    updatedDescription[index] = {
      ...updatedDescription[index],
      [field]: field === 'details' ? value.split('\n') : value
    };
    setForm({ ...form, description: updatedDescription });
  };

  const addDescriptionSection = () => {
    setForm({
      ...form,
      description: [...form.description, { heading: '', details: [''] }]
    });
  };

  const removeDescriptionSection = (index) => {
    const updatedDescription = [...form.description];
    updatedDescription.splice(index, 1);
    setForm({ ...form, description: updatedDescription });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validLessons = form.videos.filter(v => v.url.trim() !== '').length;

      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        lessons: validLessons,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice),
        isFree: parseFloat(form.price) === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createCourse(data);
      setLoading(false);
      navigate('/dashboard/courses');
    } catch (err) {
      setError('Failed to create course');
      setLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create Course</h2>
      <form className="create-course-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label>Course Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Instructor Name</label>
            <input name="instructor" value={form.instructor} onChange={handleChange} required />
          </div>

          

          <div className="form-group">
            <label>Course Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (hours)</label>
              <input name="duration" value={form.duration} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Original Price ($)</label>
              <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} required />
            </div>
          </div>

          {/* ✅ CATEGORY NAME + ICON */}
          <div className="form-group">
            <label>Category</label>
            <select
              name="categoryOption"
              value={selectedCategoryOption}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={`${cat.name}|${cat.icon}`}>
                  {cat.name}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>

          {selectedCategoryOption === 'other' && (
            <>
              <div className="form-group">
                <label>New Category Name</label>
                <input
                  value={form.category.name}
                  onChange={(e) => handleCategoryChange('name', e.target.value)}
                  placeholder="e.g. React"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Category Icon URL</label>
                <input
                  value={form.category.icon}
                  onChange={(e) => handleCategoryChange('icon', e.target.value)}
                  placeholder="https://example.com/icon.png"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Level</label>
            <select name="level" value={form.level} onChange={handleChange} required>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Instructor ID</label>
            <input name="instructorId" value={form.instructorId} onChange={handleChange} />
          </div>
        </div>

        {/* Videos */}
        <div className="form-section">
          <h3>Videos</h3>
          {form.videos.map((video, index) => (
            <div key={index} className="video-item">
              <div className="form-group">
                <label>Video Title</label>
                <input
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Video URL</label>
                <input
                  value={video.url}
                  onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                />
              </div>

              {form.videos.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeVideo(index)}>Remove Video</button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addVideo}>Add Video</button>
        </div>

        {/* Description */}
        <div className="form-section">
          <h3>Course Description</h3>
          {form.description.map((section, index) => (
            <div key={index} className="description-section">
              <div className="form-group">
                <label>Section Heading</label>
                <input
                  value={section.heading}
                  onChange={(e) => handleDescriptionChange(index, 'heading', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Details (one per line)</label>
                <textarea
                  value={section.details.join('\n')}
                  onChange={(e) => handleDescriptionChange(index, 'details', e.target.value)}
                  rows={4}
                />
              </div>

              {form.description.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeDescriptionSection(index)}>Remove Section</button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addDescriptionSection}>Add Description Section</button>
        </div>

        {/* Publishing */}
        <div className="form-section">
          <h3>Publishing Options</h3>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input name="courseVerified" type="checkbox" checked={form.courseVerified} onChange={handleChange} />
              Course Verified
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input name="editCourse" type="checkbox" checked={form.editCourse} onChange={handleChange} />
              Allow Editing
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard/courses')}>
            Cancel
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
