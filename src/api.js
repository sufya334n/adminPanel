const BASE_URL = 'http://localhost:5000/api'; // Change this to your actual API base URL


// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  // You can add more error handling logic here
  throw error;
};

// Add authentication token if user is logged in
const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const userEmail = localStorage.getItem('userEmail');
  
  if (userEmail) {
    // You can add authentication headers here if needed
    // headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export async function getBlogs() {
  try {
    const res = await fetch(`${BASE_URL}/blogs`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getBlogById(id) {
  try {
    const res = await fetch(`${BASE_URL}/blogs/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createBlog(data) {
  try {
    const res = await fetch(`${BASE_URL}/blogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateBlog(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteBlog(id) {
  try {
    const res = await fetch(`${BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete blog');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

// Add a function to check if API is available
export async function checkApiStatus() {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return res.ok;
  } catch (error) {
    console.error('API not available:', error);
    return false;
  }
}



// ... existing code ...

// Courses API functions
export async function getCourses() {
  try {
    const res = await fetch(`${BASE_URL}/courses`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCourseById(id) {
  try {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createCourse(data) {
  try {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateCourse(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteCourse(id) {
  try {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete course');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}






























// ... existing code ...

// Users API functions
export async function getUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getUserById(id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createUser(data) {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateUser(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteUser(id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function blockUser(id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}/block`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to block/unblock user');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

// export async function updateUserLastActive(id) {
//   try {
//     const res = await fetch(`${BASE_URL}/users/${id}/last-active`, {
//       method: 'PUT',
//       headers: getHeaders(),
//     });
//     if (!res.ok) throw new Error('Failed to update last active time');
//     return res.json();
//   } catch (error) {
//     console.error('Error updating last active time:', error);
//     throw error;
//   }
// }

// Instructors API functions
export async function getInstructors() {
  try {
    const res = await fetch(`${BASE_URL}/instructors`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch instructors');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getInstructorById(id) {
  try {
    const res = await fetch(`${BASE_URL}/instructors/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch instructor');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createInstructor(data) {
  try {
    const res = await fetch(`${BASE_URL}/instructors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create instructor');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateInstructor(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/instructors/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update instructor');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteInstructor(id) {
  try {
    const res = await fetch(`${BASE_URL}/instructors/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete instructor');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function verifyInstructor(id) {
  try {
    const res = await fetch(`${BASE_URL}/instructors/${id}/verify`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to verify/unverify instructor');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

// export async function getInstructorCourses(id) {
//   try {
//     const res = await fetch(`${BASE_URL}/instructors/${id}/courses`, {
//       headers: getHeaders()
//     });
//     if (!res.ok) throw new Error('Failed to fetch instructor courses');
//     return res.json();
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

// Ye sahi version hai
export async function getInstructorCourses(id) {
  try {
    const res = await fetch(`${BASE_URL}/instructors/${id}/courses`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch instructor courses');

    return res.json(); // ✅ Yeh array hi return karega
  } catch (error) {
    return handleApiError(error);
  }
}


// export async function getInstructorCourses(id) {
//   try {
//     const res = await fetch(`${BASE_URL}/instructors/${id}/courses`, {
//       headers: getHeaders()
//     });
//     if (!res.ok) throw new Error('Failed to fetch instructor courses');

//     const data = await res.json();

//     return data.courses || []; // ✅ Sirf array return karo
//   } catch (error) {
//     return handleApiError(error);
//   }
// }







// ... existing code ...

// User courses and payment API functions
export async function getUserEnrolledCourses(id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}/enrolled-courses`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch enrolled courses');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getUserCompletedCourses(id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}/completed-courses`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch completed courses');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getUserPurchasedCourses(id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}/purchased-courses`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch purchased courses');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getUserPaymentHistory(id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}/payment-history`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch payment history');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}





// ... existing code ...
// Contact Info API functions using fetch

const API_URL = 'http://localhost:5000/api'; // Or import this if defined elsewhere

export const getContactInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/contactinfo`);
    if (!response.ok) {
      throw new Error('Failed to fetch contact info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching contact info:', error);
    throw error;
  }
};

export const updateContactInfo = async (contactInfoData) => {
  try {
    const response = await fetch(`${API_URL}/contactinfo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactInfoData),
    });

    if (!response.ok) {
      throw new Error('Failed to update contact info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
};



// ... existing code ...

// Contact Messages API functions
export const getContacts = async () => {
  try {
    const response = await fetch(`${API_URL}/contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch contact messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/courses/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};



export const createContact = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error('Failed to create contact message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating contact message:', error);
    throw error;
  }
};

export const markAsReplied = async (id) => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}/reply`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark contact as replied');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking contact as replied:', error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete contact message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting contact message:', error);
    throw error;
  }
};





// Add this function with the other contact API functions
export const sendReply = async (id, replyMessage) => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ replyMessage }),
    });

    if (!response.ok) {
      throw new Error('Failed to send reply');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending reply:', error);
    throw error;
  }
};




// ... existing code ...

// About API Functions
export async function getAbout() {
  try {
    const res = await fetch(`${BASE_URL}/about`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch about information');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateAbout(data) {
  try {
    const res = await fetch(`${BASE_URL}/about`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update about information');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}








// ... existing code ...

// Payouts API Functions
export async function getUnpaidPayouts(instructorId) {
  try {
    const res = await fetch(`${BASE_URL}/payouts/unpaid/${instructorId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch unpaid payouts');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getUnpaidPayoutsSummary() {
  const res = await fetch(`${BASE_URL}/payouts/unpaid-summary`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch unpaid payouts summary');
  return res.json();
}



export async function getUnpaidPayoutsDetails(instructorId) {
  try {
    const res = await fetch(`${BASE_URL}/payouts/unpaid-details/${instructorId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch unpaid payout details');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function processInstructorPayout(instructorId) {
  try {
    const res = await fetch(`${BASE_URL}/payouts/process/${instructorId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to process instructor payout');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getPaidPayouts() {
  try {
    const res = await fetch(`${BASE_URL}/payouts/paid`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch paid payouts');
    return res.json();
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getPayoutBatches(instructorId = '') {
  try {
    const url = instructorId
      ? `${BASE_URL}/payouts/batches/instructor/${instructorId}`
      : `${BASE_URL}/payouts/batches`;

    const res = await fetch(url, { headers: getHeaders() });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch payout batches');
    }

    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}





export async function getAllUsersPaymentHistory() {
  try {
    console.log("Fetching payment history...");
    const res = await fetch(`${BASE_URL}/payouts/all-payment-history`, {
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders() // Make sure this includes Authorization if needed
      }
    });

    const data = await res.json();
    console.log("API Response:", data);

    if (!res.ok) {
      throw new Error(data.message || 'Payment history fetch failed');
    }

    return data;
  } catch (error) {
    console.error("API Error Details:", {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}





















export async function getAnalyticsData(range) {
  try {
    const [usersRes, salesRes, payoutsRes] = await Promise.all([
      fetch(`${BASE_URL}/users/analytics/users?range=${range}`, { headers: getHeaders() }),
      fetch(`${BASE_URL}/users/analytics/sales?range=${range}`, { headers: getHeaders() }),
      fetch(`${BASE_URL}/payouts/summary?range=${range}`, { headers: getHeaders() })
    ]);

    if (!usersRes.ok) throw new Error('Failed to fetch user analytics');
    if (!salesRes.ok) throw new Error('Failed to fetch sales analytics');
    if (!payoutsRes.ok) throw new Error('Failed to fetch payout analytics');

    const usersData = await usersRes.json();
    const salesData = await salesRes.json();
    const { totalPaidPayouts, totalUnpaidPayouts } = await payoutsRes.json();

    return {
      users: usersData,
      sales: salesData,
      payouts: { totalPaidPayouts, totalUnpaidPayouts }
    };
  } catch (error) {
    return handleApiError(error);
  }
}
