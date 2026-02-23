<script setup>
import { onMounted, reactive, ref } from 'vue'
import { createUser, deleteUser, getUser2FAQrcode, getUserList, updateUser, updateUserStatus } from '../../api/user'

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
const drawerVisible = ref(false)
const qrcodeVisible = ref(false)
const qrcodeImg = ref('')
const qrcodeTitle = ref('')

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

function openCreateDrawer() {
  resetForm()
  drawerVisible.value = true
}

function closeDrawer() {
  drawerVisible.value = false
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
    closeDrawer()
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
  drawerVisible.value = true
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

async function show2FAQrcode(u) {
  if (!u.two_fa_enabled) {
    errMsg.value = '该用户未开启 2FA'
    return
  }
  try {
    const { data } = await getUser2FAQrcode(u.id)
    qrcodeImg.value = data?.data?.qrcode_data_url || ''
    qrcodeTitle.value = `2FA 二维码 - ${u.username}`
    qrcodeVisible.value = true
  } catch (err) {
    errMsg.value = err?.response?.data?.message || '获取 2FA 二维码失败'
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

function formatHKTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'

  const s = new Intl.DateTimeFormat('zh-HK', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d)

  const map = Object.fromEntries(s.map((x) => [x.type, x.value]))
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`
}

onMounted(fetchUsers)
</script>

<template>
  <section>
    <div class="header-row">
      <h2>用户管理</h2>
      <button class="btn-sm" @click="openCreateDrawer">新增用户</button>
    </div>

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
          <td>
            <a v-if="u.two_fa_enabled" href="#" class="status-link" @click.prevent="show2FAQrcode(u)">开启</a>
            <span v-else class="muted">关闭</span>
          </td>
          <td>
            <a href="#" class="status-link" @click.prevent="toggleStatus(u)">
              {{ u.enabled ? '启用' : '禁用' }}
            </a>
          </td>
          <td>{{ formatHKTime(u.last_login_at) }}</td>
          <td style="display:flex; gap:6px;">
            <button @click="fillEdit(u)">编辑</button>
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

    <div v-if="drawerVisible" class="drawer-mask" @click.self="closeDrawer">
      <aside class="drawer">
        <div class="drawer-header">
          <h3>{{ editing ? '编辑用户' : '新增用户' }}</h3>
          <button class="btn-sm" @click="closeDrawer">关闭</button>
        </div>

        <form class="drawer-form" @submit.prevent="submitForm">
          <input v-model="form.username" required placeholder="用户名" />
          <input v-model="form.email" required placeholder="邮箱" />
          <input v-model="form.phone" required placeholder="手机号" />
          <input v-if="!editing" v-model="form.password" required type="password" placeholder="密码" />
          <label v-if="!editing"><input v-model="form.enable_2fa" type="checkbox" /> 启用 2FA</label>
          <div style="display:flex; gap:8px;">
            <button type="submit">{{ editing ? '保存修改' : '新增用户' }}</button>
            <button type="button" @click="closeDrawer">取消</button>
          </div>
        </form>
      </aside>
    </div>

    <div v-if="qrcodeVisible" class="modal-mask" @click.self="qrcodeVisible = false">
      <div class="modal-card">
        <h3>{{ qrcodeTitle }}</h3>
        <img v-if="qrcodeImg" :src="qrcodeImg" alt="2FA QRCode" class="qrcode-img" />
        <div style="display:flex; justify-content:flex-end;">
          <button class="btn-sm" @click="qrcodeVisible = false">关闭</button>
        </div>
      </div>
    </div>
  </section>
</template>
