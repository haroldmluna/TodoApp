<template>
    <div class="register-container">
      <div class="register-card">
        <img src="@/assets/nyu-logo-1.png" alt="NYU Logo" class="logo" />
        <h2>Create Your Account</h2>
        <p class="subtitle">Join us and start managing your tasks today!</p>
        <form @submit.prevent="register" class="register-form">
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
          <button type="submit" class="register-button">Register</button>
        </form>
        <p v-if="message" class="message">{{ message }}</p>
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
        message: "",
      };
    },
    methods: {
      async register() {
        try {
          await axios.post(`${API_BASE_URL}/register`, {
            username: this.username,
            password: this.password,
          });
          this.message = "Registration successful! Redirecting to login...";
          setTimeout(() => this.$router.push("/login"), 2000); // Redirect to login after 2 seconds
        } catch (err) {
          this.message = "Error registering user. Please try again.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f7f7f7;
  }
  
  .register-card {
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
  
  .register-form {
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
  
  .register-button {
    padding: 0.75rem;
    background-color: #0072ce;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .register-button:hover {
    background-color: #005bb5;
  }
  
  .message {
    margin-top: 1rem;
    font-size: 14px;
    color: green;
  }
  </style>