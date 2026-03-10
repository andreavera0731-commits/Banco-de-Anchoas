<template>
  <div class="unauthorized-view">
    <v-container fluid class="fill-height d-flex align-center justify-center">
      <v-col cols="12" class="text-center">
        <h1>403 - Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <v-btn color="primary" :to="{ name: 'dashboard' }">
          Volver al Dashboard
        </v-btn>
      </v-col>
    </v-container>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.unauthorized-view {
  width: 100%;
  height: 100%;
}
</style>
