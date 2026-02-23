<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const errMsg = ref('')

const form = reactive({
  account: '',
  password: '',
  two_fa_code: '',
})

async function onSubmit() {
  errMsg.value = ''
  loading.value = true
  try {
    await auth.login(form)
    router.push('/')
  } catch (err) {
    errMsg.value = err?.response?.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <h2>后台登录</h2>
    <form class="card" @submit.prevent="onSubmit">
      <input v-model="form.account" placeholder="用户名 / 邮箱 / 手机号" />
      <input v-model="form.password" type="password" placeholder="密码" />
      <input v-model="form.two_fa_code" placeholder="2FA 验证码（可选）" />
      <button :disabled="loading" type="submit">{{ loading ? '登录中...' : '登录' }}</button>
      <p v-if="errMsg" class="err">{{ errMsg }}</p>
      <router-link to="/register">没有账号？去注册</router-link>
    </form>
  </div>
</template>
