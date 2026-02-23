<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="page">
    <h2>Admin Dashboard</h2>
    <p>登录成功，欢迎回来。</p>
    <p v-if="auth.lastLoginAt">最后登录时间：{{ auth.lastLoginAt }}</p>
    <button @click="logout">退出登录</button>
  </div>
</template>
