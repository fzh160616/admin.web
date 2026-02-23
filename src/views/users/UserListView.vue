<script setup>
import { onMounted, reactive, ref } from 'vue'
import { createUser, deleteUser, getUserList, updateUser, updateUserStatus } from '../../api/user'

const loading = ref(false)
const errMsg = ref('')
const list = ref([])
const total = ref(0)

const query = reactive({
  keyword: '',
  page: 1,
  page_size: 10,
})

const form = reactive({
  id: 0,
  username: '',
  email: '',
  phone: '',
  password: '',
  enable_2fa: false,
})
const editing = ref(false)

async function fetchUsers() {
  loading.value = true
  errMsg.value = ''
  try {
    const { data } = await getUserList(query)
    list.value = data?.data?.list || []
    total.value = data?.data?.total || 0
  } catch (err) {
    errMsg.value = err?.response?.data?.message || '获取用户列表失败'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.id = 0
  form.username = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  form.enable_2fa = false
  editing.value = false
}

async function submitForm() {
  try {
    if (editing.value) {
      await updateUser(form.id, {
        username: form.username,
        email: form.email,
        phone: form.phone,
      })
    } else {
      await createUser({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        enable_2fa: form.enable_2fa,
      })
    }
    resetForm()
    await fetchUsers()
  } catch (err) {
    errMsg.value = err?.response?.data?.message || '提交失败'
  }
}

function fillEdit(u) {
  editing.value = true
  form.id = u.id
  form.username = u.username
  form.email = u.email
  form.phone = u.phone
  form.password = ''
  form.enable_2fa = !!u.two_fa_enabled
}

async function toggleStatus(u) {
  try {
    await updateUserStatus(u.id, !u.enabled)
    await fetchUsers()
  } catch (err) {
    errMsg.value = err?.response?.data?.message || '更新状态失败'
  }
}

async function removeUser(u) {
  if (!confirm(`确认删除用户 ${u.username} ?`)) return
  try {
    await deleteUser(u.id)
    await fetchUsers()
  } catch (err) {
    errMsg.value = err?.response?.data?.message || '删除失败'
  }
}

function search() {
  query.page = 1
  fetchUsers()
}

function prevPage() {
  if (query.page <= 1) return
  query.page -= 1
  fetchUsers()
}

function nextPage() {
  const maxPage = Math.max(1, Math.ceil(total.value / query.page_size))
  if (query.page >= maxPage) return
  query.page += 1
  fetchUsers()
}

onMounted(fetchUsers)
</script>

<template>
  <section>
    <h2>用户管理</h2>

    <form class="card" @submit.prevent="submitForm" style="margin-bottom: 12px;">
      <h3>{{ editing ? '编辑用户' : '新增用户' }}</h3>
      <input v-model="form.username" required placeholder="用户名" />
      <input v-model="form.email" required placeholder="邮箱" />
      <input v-model="form.phone" required placeholder="手机号" />
      <input v-if="!editing" v-model="form.password" required type="password" placeholder="密码" />
      <label v-if="!editing"><input v-model="form.enable_2fa" type="checkbox" /> 启用 2FA</label>
      <div style="display:flex; gap:8px;">
        <button type="submit">{{ editing ? '保存修改' : '新增用户' }}</button>
        <button v-if="editing" type="button" @click="resetForm">取消编辑</button>
      </div>
    </form>

    <div class="toolbar compact-toolbar">
      <input
        v-model="query.keyword"
        class="search-input"
        placeholder="搜索用户名 / 邮箱 / 手机号"
        @keyup.enter="search"
      />
      <button class="btn-sm" @click="search">搜索</button>
    </div>

    <p v-if="errMsg" class="err">{{ errMsg }}</p>
    <p v-if="loading" class="muted">加载中...</p>

    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>手机号</th>
          <th>2FA</th>
          <th>状态</th>
          <th>最后登录</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in list" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.phone }}</td>
          <td>{{ u.two_fa_enabled ? '开启' : '关闭' }}</td>
          <td>{{ u.enabled ? '启用' : '禁用' }}</td>
          <td>{{ u.last_login_at || '-' }}</td>
          <td style="display:flex; gap:6px;">
            <button @click="fillEdit(u)">编辑</button>
            <button @click="toggleStatus(u)">{{ u.enabled ? '禁用' : '启用' }}</button>
            <button @click="removeUser(u)">删除</button>
          </td>
        </tr>
        <tr v-if="list.length === 0">
          <td colspan="8" class="muted">暂无数据</td>
        </tr>
      </tbody>
    </table>

    <div class="pager">
      <span>总数：{{ total }}</span>
      <button @click="prevPage">上一页</button>
      <span>第 {{ query.page }} 页</span>
      <button @click="nextPage">下一页</button>
    </div>
  </section>
</template>
