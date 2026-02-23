<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getUserList } from '../../api/user'

const loading = ref(false)
const errMsg = ref('')
const list = ref([])
const total = ref(0)

const query = reactive({
  keyword: '',
  page: 1,
  page_size: 10,
})

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

    <div class="toolbar">
      <input v-model="query.keyword" placeholder="搜索用户名/邮箱/手机号" @keyup.enter="search" />
      <button @click="search">搜索</button>
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
          <th>最后登录</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in list" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.phone }}</td>
          <td>{{ u.two_fa_enabled ? '开启' : '关闭' }}</td>
          <td>{{ u.last_login_at || '-' }}</td>
        </tr>
        <tr v-if="list.length === 0">
          <td colspan="6" class="muted">暂无数据</td>
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
