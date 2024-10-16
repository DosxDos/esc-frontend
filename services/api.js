import axios from "axios";

const API_BASE_URL = "https://app-energiasolarcanarias-backend.com";

// Function to fetch user data from the API (added for testing purposes)
export const fetchUserData = async (usuario, apiKey) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usuarios`, {
      headers: {
        usuario,
        apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Existing API functions (kept intact)

// Mock login API function
export const loginUserAPI = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate receiving a token from the backend
      const token = "mockToken123";
      const user = { id: "123", name: "Thomas Augot", email };

      // Save token and user to local storage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      resolve({ user });
    }, 1000);
  });

  // Uncomment when the actual backend is set up
  /*
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  const { token, user } = response.data;
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
  return response.data;
  */
};

// Mock register API function
export const registerUserAPI = async (email, password, username) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate receiving a token from the backend
      const token = "mockToken124";
      const user = { id: "124", name: username, email };

      // Save token and user to local storage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      resolve({ user });
    }, 1000);
  });

  // Uncomment when the actual backend is set up
  /*
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
    username,
  });
  const { token, user } = response.data;
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
  return response.data;
  */
};

export const sendPasswordResetEmail = async (email) => {};

export const fetchUserMock = async (email, password) => {
  try {
    const response = await fetch("/user.json");
    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }
    const data = await response.json();
    const user = data.users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      return user;
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchPlantsMock = async (userId) => {
  try {
    const response = await fetch("/plants.json");
    if (!response.ok) {
      throw new Error(`Error fetching plants: ${response.statusText}`);
    }
    const data = await response.json();
    const plants = data.plants.filter((plant) => plant.userId === userId);

    return plants;
  } catch (error) {
    console.error("Error fetching plants data:", error);
    throw error;
  }
};
