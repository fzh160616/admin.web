<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/auth'

const router = useRouter()
const loading = ref(false)
const msg = ref('')
const errMsg = ref('')

const form = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  enable_2fa: false,
})

async function onSubmit() {
  errMsg.value = ''
  msg.value = ''
  loading.value = true
  try {
    const { data } = await register(form)
    const otp = data?.data?.otp_auth_url
    msg.value = otp ? `注册成功，2FA绑定链接：${otp}` : '注册成功，请登录'
    setTimeout(() => router.push('/login'), 1200)
  } catch (err) {
    errMsg.value = err?.response?.data?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <h2>用户注册</h2>
    <form class="card" @submit.prevent="onSubmit">
      <input v-model="form.username" placeholder="用户名" />
      <input v-model="form.email" placeholder="邮箱" />
      <input v-model="form.phone" placeholder="手机号" />
      <input v-model="form.password" type="password" placeholder="密码" />
      <label><input v-model="form.enable_2fa" type="checkbox" /> 启用 2FA</label>
      <button :disabled="loading" type="submit">{{ loading ? '提交中...' : '注册' }}</button>
      <p v-if="msg" class="ok">{{ msg }}</p>
      <p v-if="errMsg" class="err">{{ errMsg }}</p>
      <router-link to="/login">已有账号？去登录</router-link>
    </form>
  </div>
</template>
