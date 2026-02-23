# admin.web

后台管理前端（Vue 3 + Vite + Pinia + Vue Router + Axios）。

## 启动

```bash
npm install
cp .env.example .env
npm run dev
```

默认开发地址：`http://localhost:5173`

## 环境变量

```env
VITE_API_BASE_URL=http://127.0.0.1:8080
```

## 页面

- `/login` 登录页（支持用户名/邮箱/手机号登录）
- `/register` 注册页（支持开启 2FA）
- `/` 管理后台框架（侧边栏 + 顶栏）
- `/users` 用户管理占位页（登录后访问）

## 对接后端接口

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
