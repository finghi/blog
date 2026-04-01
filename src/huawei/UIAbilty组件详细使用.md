---
title: UIAbility 组件详细使用指南
date: 2026-03-19
tags: [HarmonyOS, UIAbility, 组件]
---

# UIAbility 组件详细使用指南 


<!-- more -->

UIAbility 是 HarmonyOS 应用的基本调度单元，负责管理应用的生命周期和界面展示。本文档详细介绍 UIAbility 的使用方法和最佳实践。

## 1. UIAbility 基本概念

### 1.1 什么是 UIAbility

UIAbility 是 HarmonyOS 中承载页面的能力，每个 UIAbility 可以包含一个或多个页面。

- **基本单位**：应用的最小运行单元
- **生命周期**：有完整的创建、运行、销毁生命周期
- **窗口管理**：管理应用窗口和界面
- **能力提供**：可以向其他应用提供能力

### 1.2 UIAbility 与其他组件的关系

| 组件 | 说明 | 关系 |
|------|------|------|
| UIAbility | 应用基本调度单元 | 包含页面 |
| Page | 页面组件 | 属于 UIAbility |
| Component | 原子组件 | 构成页面 |

## 2. UIAbility 生命周期

### 2.1 生命周期状态

| 状态 | 说明 | 触发时机 |
|------|------|----------|
| onCreate | 初始化 | 应用创建时 |
| onWindowStageCreate | 窗口创建 | 窗口创建时 |
| onForeground | 进入前台 | 应用进入前台时 |
| onBackground | 进入后台 | 应用进入后台时 |
| onWindowStageDestroy | 窗口销毁 | 窗口销毁时 |
| onDestroy | 销毁 | 应用销毁时 |
| onNewWant | 新的启动意图 | 应用已启动但收到新的启动请求时 |

### 2.2 生命周期流程图

```
Create → WindowStageCreate → [Foreground ↔ Background] → WindowStageDestroy → Destroy
```

### 2.3 代码示例

```typescript
import UIAbility from '@ohos.app.ability.UIAbility'
import window from '@ohos.window'

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    console.log('EntryAbility onCreate')
    // 初始化应用级资源
    this.initAppResources()
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    console.log('EntryAbility onWindowStageCreate')
    // 设置窗口内容
    windowStage.setUIContent('pages/Index')
  }

  onForeground() {
    console.log('EntryAbility onForeground')
    // 应用进入前台时的处理
  }

  onBackground() {
    console.log('EntryAbility onBackground')
    // 应用进入后台时的处理
  }

  onWindowStageDestroy() {
    console.log('EntryAbility onWindowStageDestroy')
    // 清理窗口相关资源
  }

  onDestroy() {
    console.log('EntryAbility onDestroy')
    // 清理应用级资源
  }

  onNewWant(want, launchParam) {
    console.log('EntryAbility onNewWant')
    // 处理新的启动意图
  }

  onDump(params: string): Array<string> {
    return [`UIAbility dump params: ${params}`]
  }

  private initAppResources() {
    // 初始化应用资源
  }
}
```

## 3. UIAbility 配置

### 3.1 module.json5 配置

```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "description": "应用入口模块",
    "mainAbility": "EntryAbility",
    "deviceTypes": ["phone", "tablet"],
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ts",
        "description": "应用入口能力",
        "icon": "$media:icon",
        "label": "UIAbility示例",
        "launchType": "singleton",
        "orientation": "portrait",
        "skills": [
          {
            "entities": ["entity.system.home"],
            "actions": ["action.system.home"]
          }
        ],
        "formsEnabled": true,
        "formEnableItems": [
          {
            "name": "FormAbility",
            "srcEntry": "./ets/entryability/FormAbility.ts"
          }
        ]
      }
    ]
  }
}
```

### 3.2 关键配置项

| 配置项 | 说明 | 可选值 |
|--------|------|--------|
| launchType | 启动模式 | singleton, multiton, specified |
| orientation | 屏幕方向 | portrait, landscape, auto |
| skills | 能力声明 | entities, actions |
| formsEnabled | 是否支持卡片 | true, false |
| deviceTypes | 支持的设备类型 | phone, tablet, car, tv, wearable |

## 4. UIAbility 启动模式

### 4.1 启动模式说明

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| singleton | 单实例模式 | 大多数应用的主入口 |
| multiton | 多实例模式 | 文档编辑器、浏览器标签页 |
| specified | 指定实例模式 | 特定场景下的实例管理 |

### 4.2 单实例模式（singleton）

```typescript
// module.json5
{
  "abilities": [
    {
      "name": "EntryAbility",
      "launchType": "singleton"
    }
  ]
}
```

### 4.3 多实例模式（multiton）

```typescript
// module.json5
{
  "abilities": [
    {
      "name": "DocumentAbility",
      "launchType": "multiton"
    }
  ]
}
```

### 4.4 指定实例模式（specified）

```typescript
// module.json5
{
  "abilities": [
    {
      "name": "ChatAbility",
      "launchType": "specified"
    }
  ]
}

// 启动时指定实例
import featureAbility from '@ohos.ability.featureAbility'

featureAbility.startAbility({
  want: {
    bundleName: 'com.example.app',
    abilityName: 'ChatAbility',
    parameters: {
      instanceKey: 'chat123'
    }
  }
})
```

## 5. UIAbility 间通信

### 5.1 使用 Want 传递数据

```typescript
// 发送方
import featureAbility from '@ohos.ability.featureAbility'

async function startDetailAbility() {
  await featureAbility.startAbility({
    want: {
      bundleName: 'com.example.app',
      abilityName: 'DetailAbility',
      parameters: {
        id: '123',
        name: '测试',
        data: JSON.stringify({ age: 20, gender: 'male' })
      }
    }
  })
}

// 接收方
// DetailAbility.ts
onCreate(want, launchParam) {
  const id = want?.parameters?.id
  const name = want?.parameters?.name
  const data = JSON.parse(want?.parameters?.data || '{}')
  console.log(`收到参数: id=${id}, name=${name}, data=${JSON.stringify(data)}`)
}
```

### 5.2 使用 EventHub 通信

```typescript
// 发布事件
import EventHub from '@ohos.eventhub'

const eventHub = new EventHub()
eventHub.emit('userLogin', { userId: '123', token: 'abc' })

// 订阅事件
eventHub.on('userLogin', (data) => {
  console.log('用户登录:', data)
})
```

### 5.3 使用 AppStorage 全局状态

```typescript
// 设置全局状态
import AppStorage from '@ohos.AppStorage'

AppStorage.SetOrCreate('userInfo', { name: '张三', age: 25 })

// 订阅全局状态
@Component
struct UserInfoComponent {
  @StorageLink('userInfo') userInfo: UserInfo = { name: '', age: 0 }

  build() {
    Text(`用户: ${this.userInfo.name}, 年龄: ${this.userInfo.age}`)
  }
}
```

## 6. UIAbility 状态管理

### 6.1 应用级状态

```typescript
// EntryAbility.ts
import UIAbility from '@ohos.app.ability.UIAbility'
import AppStorage from '@ohos.AppStorage'

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    // 初始化应用状态
    AppStorage.SetOrCreate('appTheme', 'light')
    AppStorage.SetOrCreate('userToken', '')
    AppStorage.SetOrCreate('appSettings', {
      notifications: true,
      autoSave: true
    })
  }

  onDestroy() {
    // 清理应用状态
    AppStorage.Delete('userToken')
  }
}
```

### 6.2 页面级状态

```typescript
// pages/Index.ets
import router from '@ohos.router'

@Entry
@Component
struct Index {
  @State count: number = 0
  @StorageLink('appTheme') theme: string = 'light'

  build() {
    Column() {
      Text(`计数: ${this.count}`)
      Text(`主题: ${this.theme}`)
      
      Button('增加计数')
        .onClick(() => {
          this.count++
        })
      
      Button('切换主题')
        .onClick(() => {
          AppStorage.Set('appTheme', this.theme === 'light' ? 'dark' : 'light')
        })
    }
  }
}
```

## 7. UIAbility 高级特性

### 7.1 后台任务

```typescript
import abilityAccessCtrl from '@ohos.abilityAccessCtrl'
import backgroundTaskManager from '@ohos.resourceschedule.backgroundTaskManager'
import wantAgent from '@ohos.app.ability.wantAgent'

async function requestBackgroundTask() {
  const atManager = abilityAccessCtrl.createAtManager()
  try {
    await atManager.requestPermissionsFromUser(this.context, ['ohos.permission.KEEP_BACKGROUND_RUNNING'])
    
    const wantAgentInfo = {
      wants: [
        {
          bundleName: this.context.abilityInfo.bundleName,
          abilityName: this.context.abilityInfo.name
        }
      ],
      operationType: wantAgent.OperationType.START_ABILITY,
      requestCode: 0,
      wantAgentFlags: [wantAgent.WantAgentFlags.UPDATE_PRESENT_FLAG]
    }
    
    const wantAgentObj = await wantAgent.getWantAgent(wantAgentInfo)
    
    const taskId = backgroundTaskManager.startBackgroundRunning(
      this.context, 
      backgroundTaskManager.BackgroundMode.DATA_TRANSFER,
      wantAgentObj
    )
    console.log(`后台任务ID: ${taskId}`)
  } catch (error) {
    console.error('申请后台权限失败:', error)
  }
}

function stopBackgroundTask(taskId: number) {
  backgroundTaskManager.stopBackgroundRunning(this.context, taskId)
}
```

### 7.2 权限管理

```typescript
import abilityAccessCtrl from '@ohos.abilityAccessCtrl'

async function requestPermissions() {
  const atManager = abilityAccessCtrl.createAtManager()
  const permissions = [
    'ohos.permission.CAMERA',
    'ohos.permission.MICROPHONE',
    'ohos.permission.LOCATION'
  ]
  
  try {
    const result = await atManager.requestPermissionsFromUser(this.context, permissions)
    console.log('权限申请结果:', result)
  } catch (error) {
    console.error('权限申请失败:', error)
  }
}
```

### 7.3 多窗口支持

```typescript
import window from '@ohos.window'

async function createSecondaryWindow(windowStage: window.WindowStage) {
  try {
    const secondaryWindow = await windowStage.createSubWindow('secondary')
    
    await secondaryWindow.setUIContent('pages/SecondaryPage')
    await secondaryWindow.show()
  } catch (error) {
    console.error('创建副窗口失败:', error)
  }
}
```

## 8. UIAbility 最佳实践

### 8.1 性能优化

#### 8.1.1 延迟初始化

```typescript
onCreate(want, launchParam) {
  // 基础初始化
  this.initEssentialResources()
  
  // 延迟初始化非必要资源
  setTimeout(() => {
    this.initNonEssentialResources()
  }, 100)
}

private initEssentialResources() {
  // 初始化必要资源
}

private initNonEssentialResources() {
  // 初始化非必要资源
}
```

#### 8.1.2 资源管理

```typescript
onDestroy() {
  // 清理网络连接
  this.disconnectNetwork()
  
  // 清理定时器
  this.clearTimers()
  
  // 清理订阅
  this.unsubscribeEvents()
  
  // 清理文件句柄
  this.closeFileHandles()
}

private disconnectNetwork() {
  // 断开网络连接
}

private clearTimers() {
  // 清理定时器
}

private unsubscribeEvents() {
  // 取消事件订阅
}

private closeFileHandles() {
  // 关闭文件句柄
}
```

### 8.2 错误处理

```typescript
onCreate(want, launchParam) {
  try {
    this.initApp()
  } catch (error) {
    console.error('应用初始化失败:', error)
    this.handleInitError(error)
  }
}

private handleInitError(error: Error) {
  // 错误处理逻辑
  // 1. 记录错误
  // 2. 显示错误页面
  // 3. 尝试恢复
}
```

### 8.3 安全最佳实践

```typescript
// 使用 HUKS 安全存储敏感信息
import huks from '@ohos.security.huks'
import cryptoFramework from '@ohos.security.cryptoFramework'
import util from '@ohos.util'

async function secureStore(key: string, value: string): Promise<Uint8Array> {
  const keyAlias = key
  
  const options: huks.HuksOptions = {
    properties: [
      { tag: huks.HuksTag.HUKS_TAG_ALGORITHM, value: huks.HuksKeyAlg.HUKS_ALG_AES },
      { tag: huks.HuksTag.HUKS_TAG_KEY_SIZE, value: 128 },
      { tag: huks.HuksTag.HUKS_TAG_PURPOSE, value: huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_ENCRYPT | huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_DECRYPT },
      { tag: huks.HuksTag.HUKS_TAG_BLOCK_MODE, value: huks.HuksCipherMode.HUKS_MODE_CBC },
      { tag: huks.HuksTag.HUKS_TAG_PADDING, value: huks.HuksKeyPadding.HUKS_PADDING_PKCS7 }
    ]
  }
  
  try {
    await huks.generateKeyItem(keyAlias, options)
    
    const cipher = cryptoFramework.createCipher('AES128|CBC|PKCS7')
    const key = await huks.exportKeyItem(keyAlias, options)
    const symKey = await cryptoFramework.createSymKey(key)
    await cipher.init(cryptoFramework.CipherMode.ENCRYPT_MODE, symKey, null)
    
    const textEncoder = new util.TextEncoder()
    const data = textEncoder.encodeInto(value)
    const encryptData = await cipher.doFinal(data)
    
    return encryptData.data
  } catch (error) {
    console.error('安全存储失败:', error)
    throw error
  }
}

async function secureRetrieve(key: string, encryptedData: Uint8Array): Promise<string> {
  try {
    const options: huks.HuksOptions = {
      properties: [
        { tag: huks.HuksTag.HUKS_TAG_ALGORITHM, value: huks.HuksKeyAlg.HUKS_ALG_AES },
        { tag: huks.HuksTag.HUKS_TAG_KEY_SIZE, value: 128 },
        { tag: huks.HuksTag.HUKS_TAG_PURPOSE, value: huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_ENCRYPT | huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_DECRYPT },
        { tag: huks.HuksTag.HUKS_TAG_BLOCK_MODE, value: huks.HuksCipherMode.HUKS_MODE_CBC },
        { tag: huks.HuksTag.HUKS_TAG_PADDING, value: huks.HuksKeyPadding.HUKS_PADDING_PKCS7 }
      ]
    }
    
    const cipher = cryptoFramework.createCipher('AES128|CBC|PKCS7')
    const key = await huks.exportKeyItem(key, options)
    const symKey = await cryptoFramework.createSymKey(key)
    await cipher.init(cryptoFramework.CipherMode.DECRYPT_MODE, symKey, null)
    
    const decryptData = await cipher.doFinal(encryptedData)
    const textDecoder = new util.TextDecoder()
    return textDecoder.decodeToString(decryptData.data)
  } catch (error) {
    console.error('安全读取失败:', error)
    throw error
  }
}
```

## 9. 常见问题与解决方案

### 9.1 应用启动缓慢

**问题**：UIAbility 启动时间过长

**解决方案**：
- 延迟初始化非必要资源
- 优化 onCreate 中的逻辑
- 使用异步初始化
- 避免在主线程执行耗时操作

### 9.2 内存泄漏

**问题**：UIAbility 销毁后内存未释放

**解决方案**：
- 在 onDestroy 中清理所有资源
- 取消所有定时器和订阅
- 关闭网络连接和文件句柄
- 避免循环引用

### 9.3 权限问题

**问题**：权限申请失败

**解决方案**：
- 在 module.json5 中声明权限
- 使用 abilityAccessCtrl 申请权限
- 提供权限申请的合理理由
- 处理权限拒绝的情况

### 9.4 状态管理混乱

**问题**：应用状态管理复杂

**解决方案**：
- 使用 AppStorage 管理全局状态
- 使用 LocalStorage 管理页面状态
- 合理使用 @State、@Link 等装饰器
- 建立清晰的状态管理策略

## 10. 完整示例

### 10.1 主应用 UIAbility

```typescript
// EntryAbility.ts
import UIAbility from '@ohos.app.ability.UIAbility'
import window from '@ohos.window'
import AppStorage from '@ohos.AppStorage'

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    console.log('EntryAbility onCreate')
    
    // 初始化应用状态
    AppStorage.SetOrCreate('userInfo', {
      name: '',
      isLoggedIn: false
    })
    
    AppStorage.SetOrCreate('appConfig', {
      theme: 'light',
      language: 'zh-CN'
    })
    
    // 初始化应用资源
    this.initResources()
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    console.log('EntryAbility onWindowStageCreate')
    
    // 设置窗口内容
    windowStage.setUIContent('pages/Index')
    
    // 设置窗口属性
    windowStage.getMainWindow().then((mainWindow) => {
      mainWindow.setWindowBackgroundColor('#ffffff')
    })
  }

  onForeground() {
    console.log('EntryAbility onForeground')
    // 应用进入前台时的处理
  }

  onBackground() {
    console.log('EntryAbility onBackground')
    // 应用进入后台时的处理
  }

  onWindowStageDestroy() {
    console.log('EntryAbility onWindowStageDestroy')
    // 清理窗口相关资源
  }

  onDestroy() {
    console.log('EntryAbility onDestroy')
    // 清理应用级资源
    this.cleanupResources()
  }

  onNewWant(want, launchParam) {
    console.log('EntryAbility onNewWant')
    // 处理新的启动意图
    this.handleNewWant(want)
  }

  private initResources() {
    // 初始化资源
    console.log('初始化应用资源')
  }

  private cleanupResources() {
    // 清理资源
    console.log('清理应用资源')
  }

  private handleNewWant(want) {
    // 处理新的启动意图
    console.log('处理新的启动意图:', want)
  }
}
```

### 10.2 页面组件

```typescript
// pages/Index.ets
import router from '@ohos.router'
import featureAbility from '@ohos.ability.featureAbility'
import AppStorage from '@ohos.AppStorage'

@Entry
@Component
struct Index {
  @State count: number = 0
  @StorageLink('userInfo') userInfo: any = { name: '', isLoggedIn: false }
  @StorageLink('appConfig') appConfig: any = { theme: 'light' }

  build() {
    Column({
      space: 20
    }) {
      Text(`计数: ${this.count}`)
        .fontSize(30)
      
      Text(`用户: ${this.userInfo.name}`)
        .fontSize(20)
      
      Text(`主题: ${this.appConfig.theme}`)
        .fontSize(20)
      
      Button('增加计数')
        .onClick(() => {
          this.count++
        })
      
      Button('切换主题')
        .onClick(() => {
          this.appConfig.theme = this.appConfig.theme === 'light' ? 'dark' : 'light'
        })
      
      Button('跳转到详情页')
        .onClick(async () => {
          await featureAbility.startAbility({
            want: {
              bundleName: 'com.example.app',
              abilityName: 'DetailAbility',
              parameters: {
                id: '123',
                title: '详情页'
              }
            }
          })
        })
      
      Button('登录')
        .onClick(() => {
          this.userInfo = {
            name: '张三',
            isLoggedIn: true
          }
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
```

### 10.3 详情页 UIAbility

```typescript
// DetailAbility.ts
import UIAbility from '@ohos.app.ability.UIAbility'
import window from '@ohos.window'

export default class DetailAbility extends UIAbility {
  private detailId: string = ''
  private detailTitle: string = ''

  onCreate(want, launchParam) {
    console.log('DetailAbility onCreate')
    
    // 获取参数
    this.detailId = want?.parameters?.id || ''
    this.detailTitle = want?.parameters?.title || '详情页'
    
    console.log(`详情ID: ${this.detailId}, 标题: ${this.detailTitle}`)
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    console.log('DetailAbility onWindowStageCreate')
    
    // 设置窗口内容
    windowStage.setUIContent('pages/Detail')
  }

  onDestroy() {
    console.log('DetailAbility onDestroy')
  }
}
```

## 11. 总结

UIAbility 是 HarmonyOS 应用的核心组件，掌握其使用方法对于开发高质量应用至关重要。

### 核心要点

1. **生命周期管理**：理解并正确处理 UIAbility 的各个生命周期阶段
2. **状态管理**：合理使用 AppStorage、LocalStorage 和组件状态
3. **通信机制**：掌握 Want 传递、EventHub 和全局状态管理
4. **性能优化**：延迟初始化、资源管理、避免内存泄漏
5. **安全最佳实践**：权限管理、敏感信息保护

### 开发建议

- 遵循单一职责原则，每个 UIAbility 负责特定功能
- 合理设计启动模式，根据业务需求选择合适的模式
- 建立清晰的状态管理策略，避免状态混乱
- 注重错误处理和异常恢复
- 定期进行性能优化和内存泄漏检测

通过本文档的学习，开发者可以更好地理解和使用 UIAbility 组件，构建更加稳定、高效的 HarmonyOS 应用。
