<template>
  <div class="login-view">
    <v-container fluid class="fill-height d-flex align-center justify-center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <LoginForm />
      </v-col>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
</script>

<style scoped>
.login-view {
  width: 100%;
  height: 100%;
}
</style>
