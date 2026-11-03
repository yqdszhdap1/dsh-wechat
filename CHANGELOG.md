# Changelog

All notable changes to `dsh-wechat` will be documented in this file.

## [0.48.0-keeper] - 2026-11-04

### ✨ 新增特性 (Features)

- **「未央」48 小时会话保温守护 (Keeper 48h Keep-Alive)**
  - 自动记录微信用户最后一次上行交互的毫秒时间戳（`state.interactions[conversationId].lastInteractionAt`）。
  - 后台常驻 15 分钟巡检心跳定时器。当会话静默达到第 47 小时（预留 1 小时安全裕度，防 48 小时整微信平台锁死通道）时，自动触发一次温暖的主动推送。
  - 推送文案采用**【💡 拓宽视野·每日冷知识/科普/一言】+【💌 需回复的亲昵情话】**的复合排版结构，给用户最低心理负担的交互理由（例如发表情或敲个 1 即可唤醒连线）。
- **设置界面与菜单全面支持 (Settings UI & Command Menu)**
  - 在 DSH 设置页（**设置 → 微信 → 行为**）中新增「未央」专属配置卡片：
    - **启用未央守护引擎**（总开关，默认开）
    - **48 小时会话保温推送**（独立开关，默认开）
    - **提前提醒时间（分钟）**（定义为到达 48 小时之前 X 分钟发送提醒，默认 60 分钟）
    - **勿扰时间段（HH:mm-HH:mm）**（如 `23:00-08:00`，若预定时间处于勿扰期则自动提前至勿扰起始时刻发出）
    - **10 条回复配额温柔情话**（开关，默认开）
  - 微信斜杠指令全面收录 `/keeper`（支持 `/keeper`、`/keeper test`、`/keeper help`）。
  - 设置页「指令」表格同步展示 `/keeper` 指令用途。
- **多元知识与情话 API 矩阵 (Multi-source Knowledge & Sweet Nothings)**
  - **知识拓宽源**：中文维基百科 REST API（今日人类历史事件与文明突破）、一言 Hitokoto（文学、哲学、诗词）、今日一言。
  - **亲昵情话源**：LoveLive SweetNothings API、Shadiao CHP 彩虹屁 / 蜜语 API。
  - **离线双兜底词库 (100% SLA 保障)**：内置精心筛选的天体物理、生物奇趣、认知脑科学冷知识与高互动亲昵情话，当外部网络超时或 API 宕机时秒级优雅降级，永不报错。

### 🛠️ 架构与存储增强 (Architecture & Storage)

- `packages/core/src/state.ts`：
  - 扩展 `ChannelState`，新增 `interactions` 字段，严格通过 `normalizeInteractions` 校验防丢。
  - 记录每次入站消息的交互时间，并保存当前轮次是否已提醒状态（`warned48h`）。
- `packages/core/src/keeper.ts`：
  - 独立封装多源抓取、去噪清洗、格式组装与降级兜底逻辑。
- `packages/bundle/src/host.ts`：
  - 接入 `#startKeeperTimer` 与 `#checkKeeper48h` 守护协程。
  - 在收到用户消息时精准刷新时间戳并重置保温标志。
  - 在 `#noteQuota` 中调用 `buildQuotaSweetNotice` 实现温柔话术。

### 🧪 测试 (Tests)

- 新增 `packages/core/tests/keeper.test.ts`，验证多元知识抓取、情话接口响应及消息合成。
- 全量回归测试通过：333 项单测全部通过（0 失败，0 告警）。
