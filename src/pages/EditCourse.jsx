import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse, getCategories } from '../api';
import '../styles/EditCourse.css';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    instructor: '',
    instructorAvatar: '',
    image: '',
    lessons: '',
    duration: '',
    price: '',
    originalPrice: '',
    isFree: false,
    category: { name: '', icon: '' }, 
    tags: '',
    level: 'Beginner',
    videos: [{ title: '', url: '' }],
    description: [{ heading: '', details: [''] }],
    courseVerified: false,
    editCourse: true,
    instructorId: '',
    reviews: [], // 👈 make sure this is here
  
    enrolledUsers: []
  });


  const [categories, setCategories] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState('');


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndCategories = async () => {
      setLoading(true);
      try {
        console.log('Fetching course with ID:', id);
        const courseData = await getCourseById(id);
        console.log('Received course data:', courseData);
        setForm({
          ...courseData,
          tags: Array.isArray(courseData.tags) ? courseData.tags.join(', ') : '',
          videos: courseData.videos && courseData.videos.length > 0 ? courseData.videos : [{ title: '', url: '' }],
          description: courseData.description && courseData.description.length > 0 ? courseData.description : [{ heading: '', details: [''] }]
        });

        if (courseData.category && courseData.category.name && courseData.category.icon) {
          setSelectedCategoryOption(`${courseData.category.name}|${courseData.category.icon}`);
        }

        console.log('Fetching categories...');
        const fetchedCategories = await getCategories();
        console.log('Received categories:', fetchedCategories);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error in fetchCourseAndCategories:', err);
        setError('Failed to fetch course or categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndCategories();
  }, [id]);

  // 🔄 Auto-update lessons when videos change
  useEffect(() => {
    const validVideos = form.videos.filter(v => v.url.trim() !== '');
    setForm(prev => ({
      ...prev,
      lessons: validVideos.length
    }));
  }, [form.videos]);

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
    } else if (name === 'categoryName') { // For manual input when 'Other' is selected
      setForm(prev => ({
        ...prev,
        category: { ...prev.category, name: value }
      }));
    } else if (name === 'categoryIcon') { // For manual input when 'Other' is selected
      setForm(prev => ({
        ...prev,
        category: { ...prev.category, icon: value }
      }));
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
    setSaving(true);
    setError(null);
    try {
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        lessons: parseInt(form.lessons),
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice),
        isFree: parseFloat(form.price) === 0, // ✅ Set isFree based on price
        updatedAt: new Date().toISOString()
      };

      await updateCourse(id, data);
      setSaving(false);
      navigate('/dashboard/courses');
    } catch (err) {
      setError('Failed to update course');
      setSaving(false);
    }
  };

  if (loading) return <div className="edit-course-container">Loading...</div>;
  if (error) return <div className="edit-course-container">{error}</div>;

  return (
    <div className="edit-course-container">
      <h2>Edit Course</h2>
      <form className="edit-course-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Course Title" required />
          </div>

          <div className="form-group">
            <label htmlFor="instructor">Instructor Name</label>
            <input id="instructor" name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor Name" required />
          </div>

          

          <div className="form-group">
            <label htmlFor="image">Course Image URL</label>
            <input id="image" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/course-image.jpg" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lessons">Number of Lessons</label>
              <input id="lessons" name="lessons" type="number" value={form.lessons} readOnly placeholder="Auto-calculated" />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (hours)</label>
              <input id="duration" name="duration" value={form.duration} onChange={handleChange} placeholder="15" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input id="price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="49.99" required />
            </div>

            <div className="form-group">
              <label htmlFor="originalPrice">Original Price ($)</label>
              <input id="originalPrice" name="originalPrice" type="number" step="0.01" value={form.originalPrice} onChange={handleChange} placeholder="99.99" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryOption">Category</label>
            <select
              name="categoryOption"
              id="categoryOption"
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
                <label htmlFor="categoryName">New Category Name</label>
                <input
                  type="text"
                  name="categoryName"
                  id="categoryName"
                  value={form.category.name}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryIcon">New Category Icon URL</label>
                <input
                  type="text"
                  name="categoryIcon"
                  id="categoryIcon"
                  value={form.category.icon}
                  onChange={handleChange}
                  placeholder="https://example.com/icon.png"
                  required
                />
              </div>
            </>
          )}


          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="React, JavaScript, Web" />
          </div>

          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select id="level" name="level" value={form.level} onChange={handleChange} required>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="instructorId">Instructor ID</label>
            <input id="instructorId" name="instructorId" value={form.instructorId} onChange={handleChange} placeholder="Instructor ID" />
          </div>
        </div>

        <div className="form-section">
          <h3>Videos</h3>
          {form.videos.map((video, index) => (
            <div key={index} className="video-item">
              <div className="form-group">
                <label>Video Title</label>
                <input
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                  placeholder="Video Title"
                />
              </div>

              <div className="form-group">
                <label>Video URL</label>
                <input
                  value={video.url}
                  onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              {form.videos.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeVideo(index)}>Remove Video</button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addVideo}>Add Video</button>
        </div>

        <div className="form-section">
          <h3>Course Description</h3>
          {form.description.map((section, index) => (
            <div key={index} className="description-section">
              <div className="form-group">
                <label>Section Heading</label>
                <input
                  value={section.heading}
                  onChange={(e) => handleDescriptionChange(index, 'heading', e.target.value)}
                  placeholder="Section Heading"
                />
              </div>

              <div className="form-group">
                <label>Details (one per line)</label>
                <textarea
                  value={section.details.join('\n')}
                  onChange={(e) => handleDescriptionChange(index, 'details', e.target.value)}
                  placeholder="Enter details, one per line"
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

        <div className="form-section">
          <h3>Enrolled Users</h3>
          <div className="enrolled-users">
            {form.enrolledUsers && form.enrolledUsers.length > 0 ? (
              <div className="user-count">{form.enrolledUsers.length} users enrolled</div>
            ) : (
              <div className="no-users">No users enrolled yet</div>
            )}
          </div>
        </div>
        <div className="form-section">
  <h3>Course Reviews</h3>
  {form.reviews && form.reviews.length > 0 ? (
    form.reviews.map((review, index) => (
      <div key={index} className="review-item">
        <div className="form-group">
          <label>User</label>
          <input
            type="text"
            value={review.user}
            onChange={(e) => {
              const updatedReviews = [...form.reviews];
              updatedReviews[index].user = e.target.value;
              setForm({ ...form, reviews: updatedReviews });
            }}
          />
        </div>
        <div className="form-group">
          <label>Comment</label>
          <textarea
            value={review.comment}
            onChange={(e) => {
              const updatedReviews = [...form.reviews];
              updatedReviews[index].comment = e.target.value;
              setForm({ ...form, reviews: updatedReviews });
            }}
          />
        </div>
        <div className="form-group">
          <label>Rating</label>
          <input
            type="number"
            min="1"
            max="5"
            value={review.rating}
            onChange={(e) => {
              const updatedReviews = [...form.reviews];
              updatedReviews[index].rating = parseInt(e.target.value);
              setForm({ ...form, reviews: updatedReviews });
            }}
          />
        </div>
        <button
          type="button"
          className="remove-btn"
          onClick={() => {
            const updatedReviews = [...form.reviews];
            updatedReviews.splice(index, 1);
            setForm({ ...form, reviews: updatedReviews });
          }}
        >
          Remove Review
        </button>
      </div>
    ))
  ) : (
    <div className="no-users">No reviews yet</div>
  )}
  <button
    type="button"
    className="add-btn"
    onClick={() => {
      setForm({
        ...form,
        reviews: [...(form.reviews || []), { user: '', comment: '', rating: 5 }]
      });
    }}
  >
    Add Review
  </button>
</div>


 <div className="form-section">
  <h3>Course Reviews</h3>
  
  <div className="scrollable-reviews">
    {form.reviews && form.reviews.length > 0 ? (
      form.reviews.map((review, index) => (
        <div key={index} className="review-item">
          {/* Your review inputs and remove button here */}
        </div>
      ))
    ) : (
      <div className="no-users">No reviews yet</div>
    )}
  </div>
  
  <button
    type="button"
    className="add-btn"
    onClick={() => {
      setForm({
        ...form,
        reviews: [...(form.reviews || []), { user: '', comment: '', rating: 5 }]
      });
    }}
  >
    Add Review
  </button>
</div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Updating...' : 'Update Course'}
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
