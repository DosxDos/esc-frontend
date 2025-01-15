import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  loginRequestAPI,
  validateTokenRequestAPI,
  updateUserAPI,
  deleteUserAPI,
  getUserPlantsAPI,
  sendPasswordResetEmailAPI,
  updateUserProfileAPI,
  updatePasswordAPI,
  fetchUserByIdAPI,
} from "@/services/shared-api";

// Async Thunks
export const authenticateUser = createAsyncThunk(
  "user/authenticateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginRequestAPI(userData);
      if (!response || !response.data) throw new Error("Authentication failed");

      return {
        ...response,
        data: {
          ...response.data,
          tokenIdentificador: response.data.tokenIdentificador,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await fetchUserByIdAPI({ token });

      if (!response.status || response.code !== 200) {
        throw new Error(response.message || "Failed to fetch user");
      }
      console.log("API Response:", response); // Add this log
      // Keep the tokenIdentificador from the current state
      return {
        ...response.data,
        tokenIdentificador: token,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const validateToken = createAsyncThunk(
  "user/validateToken",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await validateTokenRequestAPI(id, token);

      if (!response.status || !response.data) {
        return rejectWithValue(response.message || "Token validation failed");
      }

      return {
        status: true,
        data: {
          ...response.data,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message || "Token validation failed");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await updateUserAPI({ userId, userData, token });

      // Handle both possible response formats
      const updatedUser = response.data || response;

      if (!updatedUser) {
        throw new Error("No user data in response");
      }

      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      return rejectWithValue(error.message || "Failed to update user");
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "users/updateUserPassword",
  async ({ userId, password }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await updateUserAPI({
        userId,
        userData: { password },
        token,
      });

      if (!response?.data) {
        throw new Error("Invalid response format");
      }

      return { userId, success: true };
    } catch (error) {
      console.error("Password update error:", error);
      return rejectWithValue(error.message || "Failed to update password");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      return await deleteUserAPI({ userId, token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserPlants = createAsyncThunk(
  "users/getUserPlants",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await getUserPlantsAPI({ userId, token });
      return { userId, plants: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendPasswordResetEmail = createAsyncThunk(
  "user/sendPasswordResetEmail",
  async ({ email }, { rejectWithValue }) => {
    console.log("email", email);
    try {
      const data = await sendPasswordResetEmailAPI({ email });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Error sending password reset email"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await updatePasswordAPI(token, newPassword);

      // Handle successful password reset
      if (response.status === "success" || response.ok) {
        return response;
      }

      return rejectWithValue(response.message || "Failed to reset password");
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reset password");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await updateUserProfileAPI({ userId, userData, token });

      if (!response?.data) {
        throw new Error("Invalid response format");
      }

      return response.data;
    } catch (error) {
      console.error("Profile update error:", error);
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await createUserAPI({ userData, token });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  isAdmin: false,
  tokenValidated: false,
  users: [],
  userPlants: {},
};

// Slice Definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isAdmin = action.payload?.clase === "admin";
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.error = null;
      state.tokenValidated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Authentication cases
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isAdmin = action.payload?.clase === "admin";
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
      })
      // get logged in user data
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          id: action.payload.usuario_id,
          tokenIdentificador: state.user?.tokenIdentificador,
        };
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Token validation cases
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === true) {
          state.user = action.payload.data;
          state.isLoggedIn = true;
          state.isAdmin = action.payload.data.clase === "admin";
          state.tokenValidated = true;
        } else {
          state.error = action.payload.message;
          state.isLoggedIn = false;
          state.tokenValidated = false;
        }
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
        state.tokenValidated = false;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user?.usuario_id === action.payload.usuario_id) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.usuario_id !== action.payload.userId
        );
        delete state.userPlants[action.payload.userId];
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user plants
      .addCase(getUserPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlants[action.payload.userId] = action.payload.plants;
      })
      .addCase(getUserPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update passsword
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        // We don't need to update any user data here since only the password changed
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // reset password email
      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users || [];
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Base selector
const selectUserState = (state) => state.user;

// Derived selectors
export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState?.user
);

export const selectIsUserReady = createSelector(
  [selectUser],
  (user) => !!user?.tokenIdentificador
);

export const selectTokenValidated = createSelector(
  [selectUserState],
  (userState) => userState?.tokenValidated
);

export const selectIsLoggedIn = createSelector(
  [selectUserState],
  (userState) => userState?.isLoggedIn
);

export const selectIsAdmin = createSelector(
  [selectUserState],
  (userState) => userState?.isAdmin
);

export const selectLoading = createSelector(
  [selectUserState],
  (userState) => userState?.loading
);

export const selectError = createSelector(
  [selectUserState],
  (userState) => userState?.error
);

export const selectUserWithToken = createSelector([selectUser], (user) => ({
  user,
  token: user?.tokenIdentificador,
}));

// Action creators
export const { setUser, logoutUser, clearError } = userSlice.actions;

export default userSlice.reducer;
