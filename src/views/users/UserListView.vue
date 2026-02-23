<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, username: 'admin', email: 'admin@example.com', phone: '13800138000', status: '启用' },
  { id: 2, username: 'demo', email: 'demo@example.com', phone: '13900139000', status: '禁用' },
])
</script>

<template>
  <section>
    <h2>用户管理</h2>
    <p class="muted">当前为占位页，后续可接真实用户列表 API。</p>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>手机号</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.phone }}</td>
          <td>{{ u.status }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
