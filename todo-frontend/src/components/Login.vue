<template>
  <div class="login-container">
    <div class="login-card">
      <img src="@/assets/nyu-logo-1.png" alt="NYU Logo" class="logo" />
      <h2>Welcome Back</h2>
      <p class="subtitle">Please login to continue</p>
      <form @submit.prevent="login" class="login-form">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="form-input"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="form-input"
          required
        />
        <button type="submit" class="login-button">Login</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p class="register-link">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "../config";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          username: this.username,
          password: this.password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token); // Save the token
        this.$router.push("/todos"); // Redirect to the TodoList page
      } catch (err) {
        this.error = "Invalid credentials.";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.logo {
  width: 100px;
  margin-bottom: 1rem;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #0072ce;
}

.login-button {
  padding: 0.75rem;
  background-color: #0072ce;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #005bb5;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 1rem;
}

.register-link {
  margin-top: 1rem;
  font-size: 14px;
  color: #333;
}

.register-link a {
  color: #0072ce;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #005bb5;
}
</style>