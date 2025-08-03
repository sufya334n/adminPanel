import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCourses } from '../api';
import '../styles/CourseList.css';

export default function CoursesList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    getCourses()
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch courses');
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="courses-list-container">Loading...</div>;
  if (error) return <div className="courses-list-container">{error}</div>;

  return (
  <div className="courses-page">
    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search courses..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="course-search-input"
    />

    {/* Course Cards Container */}
    <div className="courses-list-container">
      <div className="course-card create-card" onClick={() => navigate('/dashboard/courses/create')}>
        <span className="plus-icon">+</span>
        <span>Create Course</span>
      </div>

      {filteredCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        filteredCourses.map(course => (
          <div className="course-card" key={course._id}>
            <img src={course.image} alt={course.title} className="course-image" />
            <h3>{course.title}</h3>
            <p>Instructor: {course.instructor}</p>
            <p>Level: {course.level}</p>
            <p>Price: ${course.price}</p>
            <button onClick={() => navigate(`/dashboard/courses/edit/${course._id}`)}>Edit</button>
          </div>
        ))
      )}
    </div>
  </div>
);

}
