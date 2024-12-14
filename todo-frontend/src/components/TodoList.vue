<template>
  <div class="todo-app">
    <!-- Header Section -->
    <header class="header">
      <h2>Welcome, {{ username }}</h2>
      <button @click="logout" class="btn logout-btn">Logout</button>
    </header>

    <!-- Todo Form Section -->
    <section class="todo-form-section">
      <h3>My Todos</h3>
      <form class="todo-form" @submit.prevent="addTodo">
        <input
          v-model="newTask"
          placeholder="Enter a new task..."
          required
          class="todo-input"
        />
        <button type="submit" class="btn add-btn">Add</button>
      </form>
    </section>

    <!-- Todo List Section -->
    <section class="todo-list-section">
      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.TodoId" class="todo-item">
          <span :class="{ completed: todo.IsCompleted }" class="todo-task">
            {{ todo.Task }}
          </span>
          <div class="todo-actions">
            <button
              @click="markAsCompleted(todo.TodoId)"
              class="btn complete-btn"
              :disabled="todo.IsCompleted"
            >
              Complete
            </button>
            <button @click="deleteTodo(todo.TodoId)" class="btn delete-btn">
              Delete
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "../config";

export default {
  data() {
    return {
      todos: [], // List of todos
      newTask: "", // New task input
      username: "", // Current username
      connection: null, // SignalR connection
    };
  },
  async created() {
    this.username = localStorage.getItem("username") || "Guest"; // Get username from localStorage
    await this.fetchTodos();

    // Initialize SignalR connection
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://todoapp-backend-harold.azurewebsites.net") // Use your backend URL here
      .build();

    // Listen for real-time updates
    this.connection.on("todos-updated", async () => {
      await this.fetchTodos(); // Fetch updated todos
    });

    try {
      await this.connection.start(); // Start the SignalR connection
      console.log("SignalR connection established.");
    } catch (err) {
      console.error("Error establishing SignalR connection:", err);
    }
  },
  beforeDestroy() {
    // Stop the SignalR connection when the component is destroyed
    if (this.connection) {
      this.connection.stop();
    }
  },
  methods: {
    async fetchTodos() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_BASE_URL}/todos/1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.todos = response.data;
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    },
    async addTodo() {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${API_BASE_URL}/todos`,
          { userId: 1, task: this.newTask },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.newTask = ""; // Reset task input field
        await this.fetchTodos(); // Fetch updated todos after adding
      } catch (err) {
        console.error("Error adding todo:", err);
      }
    },
    async markAsCompleted(id) {
      const token = localStorage.getItem("token");
      try {
        await axios.put(`${API_BASE_URL}/todos/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchTodos(); // Fetch updated todos after marking as completed
      } catch (err) {
        console.error("Error marking todo as completed:", err);
      }
    },
    async deleteTodo(id) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${API_BASE_URL}/todos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchTodos(); // Fetch updated todos after deletion
      } catch (err) {
        console.error("Error deleting todo:", err);
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.reload(); // Refresh the page after logout
    },
  },
};
</script>

<style scoped>
/* General Styles */
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #57068c; /* NYU Violet */
  color: #fff;
  border-radius: 5px;
}

.header h2 {
  margin: 0;
  font-size: 1.5em;
  flex-grow: 1; /* Ensures h2 takes up available space */
  text-align: left;
}

/* Logout Button */
.logout-btn {
  background-color: #ea4335; /* Red for logout */
  color: #fff;
  padding: 10px 15px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c32f28;
}

/* Form Styles */
.todo-form-section {
  margin-bottom: 20px;
}

.todo-form {
  display: flex;
  justify-content: space-between;
}

.todo-input {
  flex: 1;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.add-btn {
  background-color: #57068c; /* NYU Violet */
  color: #fff;
  padding: 10px 15px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-btn:hover {
  background-color: #6f259f;
}

/* Todo List Styles */
.todo-list-section {
  margin-top: 20px;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #fff;
}

.todo-task {
  flex: 1;
  font-size: 1em;
}

.todo-task.completed {
  text-decoration: line-through;
  color: #888;
}

/* Todo Actions Button Styles */
.todo-actions .btn {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 0.9em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.complete-btn {
  background-color: #34a853; /* Green for complete */
  color: #fff;
  transition: background-color 0.3s ease;
}

.complete-btn:hover {
  background-color: #2a8c45;
}

.delete-btn {
  background-color: #ea4335; /* Red for delete */
  color: #fff;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #c32f28;
}
</style>