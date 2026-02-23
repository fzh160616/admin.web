<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<template>
  <section>
    <h2>仪表盘</h2>
    <p>登录成功，欢迎回来。</p>
    <p v-if="auth.lastLoginAt">最后登录时间：{{ auth.lastLoginAt }}</p>
  </section>
</template>
