# aiot-h5-common

## 介绍

aiot-h5-common 致力于聚合 IoT 部门的所有 H5 项目，新页面使用新的前后端架构，老项目尝试重构

## 启动项目

```zsh
pnpm i
pnpm dev // 使用测试环境启动项目
pnpm dev-prod // 使用生产环境启动项目
```

## 规范

- 代码风格遵循 ESlint + Prettier 规范
- 命名规范遵循驼峰命名法，文件名全部小写，文件夹名全部小写，类名首字母大写
- 注释规范遵循 JSDoc 规范
- 不直接修改对象，而是返回新的对象，避免修改原对象导致意外的错误
- 页面路由统一使用 hash
- 使用本地缓存，必须先在 cacheRules 中注册字段，然后统一使用 cacheHandler 进行操作
- 使用 scss 编写样式，并使用 postcss-px2rem 插件进行 px 转 rem 转换

## 项目流程

- 进入项目后判断是否存在 app_secret，如果存在，则进入对应页面，否则进入重定向页面获取 app_secret
- 获取 app_secret 后，获取用户模板数据，判断用户需要跳转到哪个页面
