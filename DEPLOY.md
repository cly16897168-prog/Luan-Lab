# 部署指南

推荐先用 Railway 部署，因为它可以在同一个项目里放 Node 网页服务和 PostgreSQL 数据库，并提供 `DATABASE_URL`。

## 方案 A：Railway

1. 把这个项目上传到 GitHub。
2. 打开 Railway，新建 Project。
3. 选择从 GitHub 仓库部署这个项目。
4. 在同一个 Railway Project 里添加 PostgreSQL 数据库。
5. 在网页服务的 Variables / Environment Variables 里设置：

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
ADMIN_EMAIL=你的管理员邮箱
ADMIN_PASSWORD=一个强密码
```

6. 确认服务的启动命令是：

```bash
npm start
```

7. 部署完成后，Railway 会给你一个公网访问地址。实验室成员用浏览器打开这个地址即可注册。

Railway 会读取 `Procfile` 中的 `web: npm start`。如果需要健康检查，可以使用 `/healthz`。

## 方案 B：Render

1. 把这个项目上传到 GitHub。
2. 在 Render 创建 PostgreSQL 数据库。
3. 在 Render 创建 Web Service，选择这个 GitHub 仓库。
4. 设置：

```text
Build Command: npm install
Start Command: npm start
```

5. 在 Web Service 的 Environment Variables 里设置：

```text
DATABASE_URL=Render PostgreSQL 的 Internal Database URL
ADMIN_EMAIL=你的管理员邮箱
ADMIN_PASSWORD=一个强密码
```

6. 部署完成后，Render 会给你一个公网访问地址。

项目里已经包含 `render.yaml`，Render Blueprint 可以直接读取 Web Service 和 PostgreSQL 的配置。`ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 需要在 Render 界面里手动填入。

## 第一次上线后

1. 用 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 登录。
2. 让实验室成员打开公网网址并提交注册申请。
3. 管理员在“注册审批”面板批准成员。
4. 成员批准后即可登录并修改试剂库存。

## 注意事项

- 不要使用默认管理员密码 `admin123` 上线。
- 不要把数据库密码写进代码里，只放在平台的 Environment Variables。
- 正式使用时必须设置 `DATABASE_URL`，不要用本地 `data/db.json`。
- 如果数据库在本机且不需要 SSL，才设置 `PGSSL=disable`；云数据库通常不需要设置这个变量。
