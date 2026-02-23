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
- `/users` 用户管理页（列表/分页/搜索/新增/编辑/启用禁用/删除）

## 对接后端接口

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users`（用户列表分页搜索）
- `POST /api/v1/users`（新增用户）
- `PUT /api/v1/users/:id`（编辑用户）
- `PATCH /api/v1/users/:id/status`（启用/禁用）
- `DELETE /api/v1/users/:id`（删除用户）

> 当前前端已处理 401：会自动清理 token 并跳转登录页。
