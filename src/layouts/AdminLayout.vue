<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h3>Admin</h3>
      <nav>
        <RouterLink to="/">仪表盘</RouterLink>
        <RouterLink to="/users">用户管理</RouterLink>
      </nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <span>后台管理系统</span>
        <button @click="logout">退出登录</button>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
