// API Configuration for React Frontend

// Get the base API URL based on environment
const getBaseURL = () => {
  // In production (deployed on Render)
  if (import.meta.env.PROD) {
    return window.location.origin; // Same domain as frontend
  }
  
  // In development (local)
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getBaseURL();

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  login: '/api/accounts/login/',
  logout: '/api/accounts/logout/',
  register: '/api/accounts/register/',
  profile: '/api/accounts/me/',
  users: '/api/accounts/all-users/',
  
  // Student endpoints
  students: '/api/accounts/students/',
  peers: '/api/students/peers/',
  gpaRecords: '/api/accounts/gpa-records/',
  studentDetail: (id) => `/api/students/${id}/`,
  
  // Report endpoints
  generateReport: '/api/students/generate-report/',
  reportStatus: (taskId) => `/api/students/report-status/${taskId}/`,
  reports: '/api/students/reports/',
  downloadReport: (taskId) => `/api/students/reports/${taskId}/download/`,
};

// Save token to localStorage
export const setToken = (token) => localStorage.setItem("token", token);

// Get token from localStorage
export const getToken = () => localStorage.getItem("token") || localStorage.getItem("accessToken");

// Remove token
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("jwtToken");
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🔄 API Request: ${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
    
    if (response.status === 403) {
      throw new Error(`Permission denied: You don't have access to this resource`);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Success: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Request Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth functions
export const loginUser = async (username, password) => {
  const response = await apiRequest(API_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  
  if (response.access) {
    setToken(response.access);
  }
  return response;
};

export const fetchCurrentUser = async () => {
  return await apiRequest(API_ENDPOINTS.profile);
};

export const fetchUsers = async () => {
  return await apiRequest(API_ENDPOINTS.users);
};

// Student API functions
export const studentAPI = {
  getStudents: async () => {
    return await apiRequest(API_ENDPOINTS.students);
  },

  getGPARecords: async () => {
    return await apiRequest(API_ENDPOINTS.gpaRecords);
  },
  
  getPeerStudents: async () => {
    return await apiRequest(API_ENDPOINTS.peers);
  },

  generateReport: async (studentId, reportType = 'comprehensive') => {
    return await apiRequest(API_ENDPOINTS.generateReport, {
      method: 'POST',
      body: JSON.stringify({ 
        student_id: studentId, 
        report_type: reportType 
      }),
    });
  },

  getReportStatus: async (taskId) => {
    return await apiRequest(API_ENDPOINTS.reportStatus(taskId));
  },

  getReports: async () => {
    return await apiRequest(API_ENDPOINTS.reports);
  },

  downloadReport: async (taskId) => {
    const response = await apiRequest(API_ENDPOINTS.downloadReport(taskId));
    
    // Create downloadable JSON file
    const content = JSON.stringify(response, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-report-${taskId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  pollReportStatus: async (taskId, onProgress, onComplete, onError, interval = 2000) => {
    const poll = async () => {
      try {
        const status = await studentAPI.getReportStatus(taskId);
        
        if (onProgress) {
          onProgress(status);
        }

        if (status.status === 'completed') {
          if (onComplete) onComplete(status);
          return true;
        } else if (status.status === 'failed') {
          if (onError) onError(status.error);
          return true;
        } else {
          // Continue polling
          setTimeout(poll, interval);
        }
      } catch (error) {
        if (onError) onError(error.message);
        return true;
      }
    };

    poll();
  },
};

export default apiRequest;