import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_USERS } from '../../mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Async Thunks for Node.js Backend communication
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to dispatch verification code.');
      }
      return data;
    } catch (err) {
      return rejectWithValue('Network error occurred. Please try again.');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Verification failed.');
      }
      return data;
    } catch (err) {
      return rejectWithValue('Network error occurred. Please try again.');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Invalid credentials.');
      }
      return data;
    } catch (err) {
      return rejectWithValue('Network error occurred. Please try again.');
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to resend verification code.');
      }
      return data;
    } catch (err) {
      return rejectWithValue('Network error occurred. Please try again.');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to initialize password recovery.');
      }
      return data;
    } catch (err) {
      return rejectWithValue('Network error occurred. Please try again.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to reset password.');
      }
      return data;
    } catch (err) {
      return rejectWithValue('Network error occurred. Please try again.');
    }
  }
);

// Helper to get from local storage or fallback to mock
const getStoredUsers = () => {
  const stored = localStorage.getItem('gov_users');
  if (stored) {
    const parsed = JSON.parse(stored);
    // Force reset if the new admin user is missing to load fresh mock credentials
    if (!parsed.some(u => u.email === 'nethin163@gmail.com')) {
      localStorage.setItem('gov_users', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return parsed;
  }
  localStorage.setItem('gov_users', JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
};

const getStoredSession = () => {
  const session = localStorage.getItem('gov_session');
  if (session) return JSON.parse(session);
  // Default to public/guest (null)
  return null;
};

const initialState = {
  users: getStoredUsers(),
  currentUser: getStoredSession(),
  error: null,
  loading: false,
  sidebarOpen: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (user) {
        if (user.status === 'blocked') {
          state.error = "This account has been suspended due to security violations.";
          return;
        }
        
        let isPasswordCorrect = false;
        if (user.role === 'admin' || user.role === 'officer') {
          if (user.email.toLowerCase() === 'nethin163@gmail.com' && password === '9894506871') {
            isPasswordCorrect = true;
          } else if (user.email.toLowerCase() === 'nethraswathi17@gmail.com' && password === 'nethrasara') {
            isPasswordCorrect = true;
          }
        } else {
          // Citizen
          if (user.password) {
            isPasswordCorrect = user.password === password;
          } else {
            isPasswordCorrect = true; // allow any password for mock seed citizens
          }
        }

        if (isPasswordCorrect) {
          state.currentUser = user;
          state.error = null;
          localStorage.setItem('gov_session', JSON.stringify(user));
        } else {
          state.error = "Invalid credentials. Please verify and try again.";
        }
      } else {
        state.error = "Invalid credentials. Please verify and try again.";
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.sidebarOpen = false;
      localStorage.removeItem('gov_session');
    },
    clearError: (state) => {
      state.error = null;
    },
    register: (state, action) => {
      const { name, email, password } = action.payload;
      const exists = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        state.error = "Email address already registered.";
        return;
      }
      const newUser = {
        id: `user-${state.users.length + 1}`,
        name,
        email,
        password, // Save password for login checks
        role: 'citizen',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        status: 'active',
        area: 'Coimbatore Central Zone',
        dateJoined: new Date().toISOString().split('T')[0]
      };
      state.users.push(newUser);
      state.currentUser = newUser;
      state.error = null;
      localStorage.setItem('gov_users', JSON.stringify(state.users));
      localStorage.setItem('gov_session', JSON.stringify(newUser));
    },
    updateProfile: (state, action) => {
      const { name, phone, area } = action.payload;
      if (state.currentUser) {
        // Update users list
        state.users = state.users.map(u => {
          if (u.id === state.currentUser.id) {
            const updated = { ...u, name, phone, area };
            state.currentUser = updated; // Update active session too
            return updated;
          }
          return u;
        });
        localStorage.setItem('gov_users', JSON.stringify(state.users));
        localStorage.setItem('gov_session', JSON.stringify(state.currentUser));
      }
    },
    // Admin features
    toggleBlockUser: (state, action) => {
      const userId = action.payload;
      state.users = state.users.map(u => {
        if (u.id === userId && u.role !== 'admin') {
          const updatedStatus = u.status === 'blocked' ? 'active' : 'blocked';
          return { ...u, status: updatedStatus };
        }
        return u;
      });
      // If the blocked user is currently logged in, log them out
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser = null;
        localStorage.removeItem('gov_session');
      }
      localStorage.setItem('gov_users', JSON.stringify(state.users));
    },
    addOfficer: (state, action) => {
      const { name, email, phone, department, area } = action.payload;
      const exists = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        state.error = "Email already in use.";
        return;
      }
      const newOfficer = {
        id: `user-${state.users.length + 1}`,
        name,
        email,
        phone,
        role: 'officer',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        status: 'active',
        department,
        area,
        dateJoined: new Date().toISOString().split('T')[0]
      };
      state.users.push(newOfficer);
      state.error = null;
      localStorage.setItem('gov_users', JSON.stringify(state.users));
    },
    editOfficer: (state, action) => {
      const { id, name, phone, department, area } = action.payload;
      state.users = state.users.map(u => {
        if (u.id === id) {
          return { ...u, name, phone, department, area };
        }
        return u;
      });
      localStorage.setItem('gov_users', JSON.stringify(state.users));
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    editUser: (state, action) => {
      const { id, name, phone, area } = action.payload;
      state.users = state.users.map(u => {
        if (u.id === id) {
          const updated = { ...u, name, phone, area };
          // If editing the currently logged-in user, sync session
          if (state.currentUser && state.currentUser.id === id) {
            state.currentUser = updated;
            localStorage.setItem('gov_session', JSON.stringify(updated));
          }
          return updated;
        }
        return u;
      });
      localStorage.setItem('gov_users', JSON.stringify(state.users));
    },
    deleteUser: (state, action) => {
      const userId = action.payload;
      // Prevent deleting admins or officers
      state.users = state.users.filter(u => u.id !== userId || u.role !== 'citizen');
      // Log out if the deleted user is currently active
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser = null;
        localStorage.removeItem('gov_session');
      }
      localStorage.setItem('gov_users', JSON.stringify(state.users));
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { user, token } = action.payload;
        if (user) {
          const sessionData = { ...user, token };
          // Add to users list if not already there
          if (!state.users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
            state.users.push(user);
            localStorage.setItem('gov_users', JSON.stringify(state.users));
          }
          state.currentUser = sessionData;
          localStorage.setItem('gov_session', JSON.stringify(sessionData));
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { user, token } = action.payload;
        if (user) {
          const sessionData = { ...user, token };
          state.currentUser = sessionData;
          localStorage.setItem('gov_session', JSON.stringify(sessionData));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  login,
  logout,
  clearError,
  register,
  updateProfile,
  toggleBlockUser,
  addOfficer,
  editOfficer,
  editUser,
  deleteUser,
  toggleSidebar,
  setSidebarOpen
} = authSlice.actions;

export default authSlice.reducer;
