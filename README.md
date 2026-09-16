# 个人健康数据看板

中文、移动端优先的个人健康数据 Dashboard。

## 当前版本
- CSV 导入
- Recovery / Sleep / HRV / RHR / Strain / Steps 卡片
- 最近 7 天表格
- WHOOP / Apple Health / Garmin / 华为 / 小米数据源状态

## 下一阶段：WHOOP OAuth
WHOOP 官方 API 当前支持 OAuth 2.0，并提供 recovery、sleep、cycles、workout、profile、body measurement 等读取权限。
不要把 WHOOP Client Secret 放进 GitHub Pages 前端；OAuth token 应由后端/安全的 serverless function 保存和刷新。

参考：
- https://developer.whoop.com/api/
- https://developer.whoop.com/docs/developing/overview/
