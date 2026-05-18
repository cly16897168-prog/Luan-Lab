# 实验室试剂监控系统 MVP

这是一个实验室试剂监控系统 MVP。当前版本已经有网页端后端、注册、登录、管理员审批和 PostgreSQL 数据库存储，可作为多人系统的第一版骨架。

## 使用方式

启动服务：

```bash
npm install
npm start
```

然后打开 `http://localhost:4173`。

部署到服务器请看 [DEPLOY.md](./DEPLOY.md)。

默认管理员账号：

- 邮箱：`admin@lab.local`
- 密码：`admin123`

可用环境变量覆盖默认管理员：

```bash
ADMIN_EMAIL=pi@example.edu ADMIN_PASSWORD=your-password npm start
```

## PostgreSQL

设置 `DATABASE_URL` 后，系统会自动创建需要的数据表，并把用户、试剂、位置和库存流水保存到 PostgreSQL。

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DATABASE" npm start
```

如果使用本机 PostgreSQL 且不需要 SSL：

```bash
PGSSL=disable DATABASE_URL="postgres://postgres:password@localhost:5432/lab_reagents" npm start
```

如果没有设置 `DATABASE_URL`，系统会退回到本地 `data/db.json`，只建议用于开发测试。

## 当前功能

- 用户注册和登录
- 新注册用户默认为待审批，管理员批准后才能登录
- 管理员可在网页内审批注册申请
- 录入试剂名称、CAS号、Catalog Number、批号、入库日期、存储位置、存入总量、当前余量、单位、试剂类型、预警线、有效期、风险等级、负责人和备注
- 维护实验室存储位置，如试剂柜、冰箱、危化品柜
- 按关键词、存储位置、试剂类型、风险等级和状态筛选库存
- 用户搜索试剂后输入使用量，系统自动扣减当前余量
- 允许每个试剂设置不同预警线，并自动识别低库存、30天内到期、已过期和危险品试剂
- 记录领用和入库流转历史
- 设置 `DATABASE_URL` 时数据保存在 PostgreSQL；未设置时保存在服务器端 `data/db.json`

## 多人异地访问版本建议

当前版本可以部署到一台服务器让实验室成员访问。正式长期版本建议继续升级为：

- 前端：React 或 Next.js，支持手机和电脑访问
- 后端：Node.js/Express、Django 或 FastAPI
- 数据库：PostgreSQL，保存试剂、库存流水、用户和权限
- 登录：学校邮箱、Google/Microsoft 登录或实验室账号
- 部署：Render、Railway、Fly.io、Vercel + Supabase，或学校服务器
- 并发控制：每次领用写入流水表，后端用事务扣减库存，避免多人同时修改造成库存错误
- 预警：低于试剂自己的预警线时，在系统内显示，也可接邮件、企业微信或短信

## 下一步可升级

- 部署到 Render、Railway、Fly.io 或学校服务器并绑定固定域名
- 增加二维码扫码领用和双人复核
- 增加危化品审批、危废处置闭环和审计导出
- 增加权限角色，如管理员、课题组负责人、学生
- 接入邮件、企业微信或短信预警
