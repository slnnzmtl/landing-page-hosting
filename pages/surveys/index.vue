<template>
  <div class="container">
    <header>
      <h1>Survey Page</h1>
      <p>Welcome to our survey page. Please take a moment to fill out the survey below.</p>
    </header>

    <form @submit.prevent="submitSurvey">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="formData.name" required>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="formData.email" required>
      </div>

      <div class="form-group">
        <label>How satisfied are you with our service?</label>
        <div class="radio-group">
          <label><input type="radio" name="satisfaction" value="very-satisfied" v-model="formData.satisfaction"> Very Satisfied</label>
          <label><input type="radio" name="satisfaction" value="satisfied" v-model="formData.satisfaction"> Satisfied</label>
          <label><input type="radio" name="satisfaction" value="neutral" v-model="formData.satisfaction"> Neutral</label>
          <label><input type="radio" name="satisfaction" value="dissatisfied" v-model="formData.satisfaction"> Dissatisfied</label>
          <label><input type="radio" name="satisfaction" value="very-dissatisfied" v-model="formData.satisfaction"> Very Dissatisfied</label>
        </div>
      </div>

      <div class="form-group">
        <label for="comments">Comments</label>
        <textarea id="comments" v-model="formData.comments"></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>

    <div v-if="submitted" class="thank-you-message">
      <p>Thank you for your feedback!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: '',
  satisfaction: 'satisfied',
  comments: ''
});

const submitted = ref(false);

const submitSurvey = () => {
  console.log('Survey submitted:', formData.value);
  submitted.value = true;
  // Here you would typically send the data to a server
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.radio-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: normal;
}

.radio-group input {
  margin-right: 0.5rem;
}

button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

button:hover {
  background-color: #0056b3;
}

.thank-you-message {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}
</style>
