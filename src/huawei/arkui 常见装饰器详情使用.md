---
title: ArkUI 常见装饰器详情使用
icon: laptop-code
# order: 1
date: 2026-03-16
category:
  - HarmonyOS
tag:
  - ArkUI
  - ArkTS
  - 装饰器
---

<div style="font-weight:700; ">ArkUI 是华为鸿蒙系统的声明式 UI 开发框架，使用 ArkTS 语言。装饰器是 ArkUI 的核心特性，用于定义组件、状态、样式等，是实现响应式 UI 的关键机制。</div>

<!-- more -->

## 装饰器概述

ArkUI 装饰器用于装饰类、结构体、方法和属性，赋予它们特定的功能。主要分为以下几类：

| 类别 | 装饰器 | 说明 |
|------|--------|------|
| 组件装饰器 | @Component | 定义自定义组件 |
| UI渲染 | @Builder、@BuilderFn | 轻量UI复用机制 |
| 状态管理 | @State、@Prop、@Link 等 | 管理组件状态 |
| 组件间共享 | @Provide、@Consume | 跨层级状态共享 |
| 观察变化 | @Watch | 监听状态变化 |
| 其他 | @Styles、@Extend | 样式复用 |

## 基础装饰器

### @Component - 组件装饰器

`@Component` 装饰器用于定义自定义组件，是 ArkUI 开发的基础。

```typescript
// 基本用法
@Component
struct MyComponent {
  build() {
    Column() {
      Text('Hello ArkUI')
    }
  }
}

// 在其他组件中使用
@Entry
@Component
struct ParentComponent {
  build() {
    Column() {
      // 使用自定义组件
      MyComponent()
    }
  }
}
```

> 💡 注意事项：
>
> - 被 `@Component` 装饰的 struct 不能继承其他类或 struct
> - 必须实现 `build()` 方法
> - 组件名建议使用大驼峰命名法
> - struct 是值类型，不支持继承

### @Entry - 页面入口装饰器

`@Entry` 装饰器标记组件为页面入口，一个页面只能有一个 `@Entry` 组件。

```typescript
@Entry
@Component
struct MainPage {
  build() {
    Column() {
      Text('这是页面入口组件')
    }
    .width('100%')
    .height('100%')
  }
}
```

> ⚠️ 注意：
>
> - `@Entry` 必须与 `@Component` 一起使用
> - 一个 `.ets` 文件中只能有一个 `@Entry` 组件
> - 页面路由跳转时，会加载目标页面的 `@Entry` 组件

### @Preview - 预览装饰器

`@Preview` 装饰器用于在 DevEco Studio 中预览组件。

```typescript
// 基本预览
@Preview
@Component
struct PreviewComponent {
  build() {
    Text('预览组件')
  }
}

// 带参数的预览
@Preview({
  title: '我的预览',
  width: 360,
  height: 640,
  deviceType: 'phone'
})
@Component
struct PreviewWithParams {
  build() {
    Column() {
      Text('带参数的预览')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }
}
```

## 状态管理装饰器

### @State - 本地状态

`@State` 用于声明组件内的本地状态，当状态变化时会触发 UI 刷新。

```typescript
@Component
struct StateComponent {
  // 基本类型
  @State message: string = 'Hello'
  @State count: number = 0
  @State isShow: boolean = true

  // 对象类型
  @State user: User = {
    name: '张三',
    age: 25
  }

  // 数组类型
  @State list: string[] = ['A', 'B', 'C']

  build() {
    Column({ space: 10 }) {
      // 修改基本类型
      Text(this.message)
        .onClick(() => {
          this.message = 'World'  // 触发刷新
        })

      // 修改对象属性
      Text(`姓名: ${this.user.name}`)
        .onClick(() => {
          this.user.name = '李四'  // 触发刷新
        })

      // 修改数组
      Text(`数量: ${this.list.length}`)
        .onClick(() => {
          this.list.push('D')  // 触发刷新
        })
    }
  }
}

interface User {
  name: string
  age: number
}
```

> 💡 @State 特点：
>
> - 状态变化会触发组件重新渲染
> - 支持基本类型、对象、数组
> - 对象属性变化也能触发刷新（深度观察）
> - 只能在组件内部使用

### @Prop - 单向数据传递

`@Prop` 用于父子组件间的单向数据传递，子组件不能修改父组件的数据。

```typescript
// 子组件
@Component
struct ChildComponent {
  @Prop title: string = ''
  @Prop count: number = 0

  build() {
    Column() {
      Text(this.title)
      Text(`计数: ${this.count}`)
      
      // ❌ 不能修改 @Prop 装饰的变量
      // this.count++  // 编译错误
      
      Button('增加')
        .onClick(() => {
          // 只能修改本地状态
          // 不能直接修改 @Prop
        })
    }
  }
}

// 父组件
@Entry
@Component
struct ParentComponent {
  @State count: number = 0

  build() {
    Column() {
      // 传递数据给子组件
      ChildComponent({ 
        title: '计数器',
        count: this.count 
      })
      
      Button('父组件增加')
        .onClick(() => {
          this.count++  // 父组件修改，子组件自动更新
        })
    }
  }
}
```

> ⚠️ @Prop 注意事项：
>
> - 数据从父组件流向子组件（单向）
> - 子组件不能修改 `@Prop` 变量
> - 父组件数据变化，子组件自动更新
> - 支持基本类型，不支持复杂对象（除非配合 @Observed）

### @Link - 双向数据绑定

`@Link` 用于父子组件间的双向数据绑定。

```typescript
// 子组件
@Component
struct LinkChild {
  @Link count: number
  @Link message: string

  build() {
    Column({ space: 10 }) {
      Text(`计数: ${this.count}`)
      Text(`消息: ${this.message}`)
      
      Button('增加计数')
        .onClick(() => {
          this.count++  // ✅ 可以修改，父组件同步更新
        })
      
      Button('修改消息')
        .onClick(() => {
          this.message = '子组件修改'  // ✅ 可以修改
        })
    }
  }
}

// 父组件
@Entry
@Component
struct LinkParent {
  @State count: number = 0
  @State message: string = '初始消息'

  build() {
    Column({ space: 10 }) {
      Text(`父组件计数: ${this.count}`)
      Text(`父组件消息: ${this.message}`)
      
      // 使用 $ 进行双向绑定
      LinkChild({ 
        count: $count,
        message: $message 
      })
    }
  }
}
```

> 💡 @Link 使用要点：
>
> - 使用 `$` 语法进行双向绑定
> - 子组件修改会同步到父组件
> - 父组件修改会同步到子组件
> - 支持基本类型、对象、数组

### @ObjectLink 和 @Observed - 嵌套对象

用于处理嵌套对象的响应式更新。

```typescript
// 定义可观察的类
@Observed
class Person {
  name: string
  age: number
  address: Address

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
    this.address = new Address()
  }
}

@Observed
class Address {
  city: string = '北京'
  street: string = '长安街'
}

// 子组件使用 @ObjectLink
@Component
struct PersonCard {
  @ObjectLink person: Person

  build() {
    Column({ space: 10 }) {
      Text(`姓名: ${this.person.name}`)
      Text(`年龄: ${this.person.age}`)
      Text(`城市: ${this.person.address.city}`)
      
      Button('修改姓名')
        .onClick(() => {
          this.person.name = '新名字'  // ✅ 触发更新
        })
      
      Button('修改城市')
        .onClick(() => {
          this.person.address.city = '上海'  // ✅ 触发更新
        })
    }
  }
}

// 父组件
@Entry
@Component
struct ObjectLinkParent {
  @State person: Person = new Person('张三', 25)

  build() {
    Column() {
      PersonCard({ person: this.person })
    }
  }
}
```

> ⚠️ @ObjectLink 注意事项：
>
> - `@Observed` 装饰的类可以被观察
> - `@ObjectLink` 只能接收 `@Observed` 类的实例
> - 嵌套对象的属性变化也能触发更新
> - 不能在 `@ObjectLink` 变量上重新赋值整个对象

### @Provide 和 @Consume - 跨层级传递

用于跨多层组件传递数据，避免逐层传递。

```typescript
// 祖父组件
@Entry
@Component
struct GrandParent {
  @Provide theme: string = 'light'
  @Provide user: User = { name: '张三', age: 25 }

  build() {
    Column() {
      Text('祖父组件')
      
      // 不需要传递给中间组件
      ParentComponent()
      
      Button('切换主题')
        .onClick(() => {
          this.theme = this.theme === 'light' ? 'dark' : 'light'
        })
    }
  }
}

// 中间组件（不需要接收和传递）
@Component
struct ParentComponent {
  build() {
    Column() {
      Text('中间组件')
      ChildComponent()
    }
  }
}

// 孙子组件直接消费数据
@Component
struct ChildComponent {
  @Consume theme: string
  @Consume user: User

  build() {
    Column() {
      Text(`当前主题: ${this.theme}`)
      Text(`用户: ${this.user.name}`)
      
      // 可以修改，会同步到祖父组件
      Button('修改主题')
        .onClick(() => {
          this.theme = 'dark'
        })
    }
    .backgroundColor(this.theme === 'light' ? '#fff' : '#333')
  }
}

interface User {
  name: string
  age: number
}
```

> 💡 @Provide/@Consume 特点：
>
> - 跨任意层级传递数据
> - 支持双向同步
> - 使用相同的变量名或别名进行匹配
> - 别名用法：`@Provide('myTheme') theme: string` 和 `@Consume('myTheme') theme: string`

### @Watch - 监听状态变化

`@Watch` 用于监听状态变量的变化。

```typescript
@Entry
@Component
struct WatchComponent {
  @State @Watch('onCountChange') count: number = 0
  @State @Watch('onMessageChange') message: string = 'Hello'
  @State log: string = ''

  // 监听 count 变化
  onCountChange(newValue: number, oldValue: number) {
    this.log += `count: ${oldValue} -> ${newValue}\n`
    console.log(`count 变化: ${oldValue} -> ${newValue}`)
  }

  // 监听 message 变化
  onMessageChange(newValue: string, oldValue: string) {
    this.log += `message: ${oldValue} -> ${newValue}\n`
  }

  build() {
    Column({ space: 10 }) {
      Text(`计数: ${this.count}`)
      Text(`消息: ${this.message}`)
      
      Button('增加计数')
        .onClick(() => {
          this.count++
        })
      
      Button('修改消息')
        .onClick(() => {
          this.message = 'World'
        })
      
      Text('日志:')
      Text(this.log)
        .fontSize(12)
    }
  }
}
```

> ⚠️ @Watch 注意事项：
>
> - 回调函数在状态变化后立即执行
> - 回调函数接收新值和旧值两个参数
> - 不要在回调中无限循环修改状态
> - 可以监听 `@State`、`@Prop`、`@Link` 等装饰的变量

### @Track - 精细化更新控制

`@Track` 用于优化对象类型状态的更新性能，实现精细化更新控制。**注意：`@Track` 只能配合 `@ObservedV2` 使用**。

```typescript
@ObservedV2
class User {
  @Track name: string = ''
  @Track age: number = 0
  @Track email: string = ''
  
  // 不加 @Track 的属性，任何属性变化都会触发整个对象更新
  description: string = ''
}

@Component
struct TrackComponent {
  @Local user: User = new User()

  build() {
    Column({ space: 10 }) {
      Text(`姓名: ${this.user.name}`)
      Text(`年龄: ${this.user.age}`)
      Text(`邮箱: ${this.user.email}`)
      
      Button('修改姓名')
        .onClick(() => {
          this.user.name = '新名字'
          // ✅ 只会触发使用 user.name 的组件更新
          // 不会触发使用 user.age、user.email 的组件重新渲染
        })
      
      Button('修改年龄')
        .onClick(() => {
          this.user.age = 30
          // ✅ 只会触发使用 user.age 的组件更新
        })
    }
  }
}
```

> 💡 @Track 工作原理：
>
> - 标记了 `@Track` 的属性，只有该属性变化时才触发更新
> - 未标记 `@Track` 的属性，任何属性变化都会触发整个对象更新
> - 可以显著提升复杂对象状态的更新性能

> ⚠️ @Track 注意事项：
>
> - **只能用于 `@ObservedV2` 类中的属性**（不支持 `@Observed`）
> - 需要配合 `@Local` 或 `@ObjectLink` 使用才能生效
> - 对于数组类型，`@Track` 不生效（数组需要整体更新）

### @Type - 类型标记

`@Type` 用于标记 `@ObservedV2` 类中属性的类型，主要用于复杂类型（如嵌套对象、数组）的类型声明。

```typescript
@ObservedV2
class Address {
  @Track city: string = ''
  @Track street: string = ''
}

@ObservedV2
class User {
  @Track name: string = ''
  @Track age: number = 0
  
  // 嵌套对象需要使用 @Type 标记类型
  @Type(Address)
  @Track address: Address = new Address()
  
  // 数组类型需要使用 @Type 标记元素类型
  @Type(Address)
  @Track addresses: Address[] = []
  
  // Map 类型
  @Type(Address)
  @Track addressMap: Map<string, Address> = new Map()
  
  // Set 类型
  @Type(Address)
  @Track addressSet: Set<Address> = new Set()
}

@Component
struct TypeComponent {
  @Local user: User = new User()

  build() {
    Column({ space: 10 }) {
      Text(`姓名: ${this.user.name}`)
      Text(`城市: ${this.user.address.city}`)
      
      Button('修改地址')
        .onClick(() => {
          this.user.address.city = '北京'
          // ✅ 嵌套对象的变化会触发更新
        })
      
      Button('添加地址')
        .onClick(() => {
          const newAddress = new Address()
          newAddress.city = '上海'
          this.user.addresses.push(newAddress)
          // ✅ 数组变化会触发更新
        })
    }
  }
}
```

> 💡 @Type 使用场景：
>
> - 嵌套对象类型声明
> - 数组元素类型声明
> - Map/Set 集合类型声明
> - 配合 `@ObservedV2` 和 `@Track` 使用

> ⚠️ @Type 注意事项：
>
> - 只能用于 `@ObservedV2` 类中的属性
> - 必须配合 `@Track` 一起使用
> - 类型参数必须是 `@ObservedV2` 装饰的类
> - 对于基本类型（string、number、boolean）不需要使用 `@Type`

### @ObservedV2 与 @Observed 的区别

```typescript
// @Observed - 传统方式，配合 @ObjectLink 使用
@Observed
class UserV1 {
  name: string = ''
  age: number = 0
}

// @ObservedV2 - 新方式，支持 @Track 精细化更新
@ObservedV2
class UserV2 {
  @Track name: string = ''
  @Track age: number = 0
}

@Component
struct CompareComponent {
  @ObjectLink userV1: UserV1    // @Observed 配合 @ObjectLink
  @Local userV2: UserV2 = new UserV2()  // @ObservedV2 配合 @Local

  build() {
    Column({ space: 20 }) {
      // @Observed：修改 name 会触发所有使用 userV1 的组件重新渲染
      Text(`V1 - 姓名: ${this.userV1.name}`)
      Text(`V1 - 年龄: ${this.userV1.age}`)
      
      Divider()
      
      // @ObservedV2 + @Track：修改 name 只触发使用 name 的组件重新渲染
      Text(`V2 - 姓名: ${this.userV2.name}`)
      Text(`V2 - 年龄: ${this.userV2.age}`)
      
      Button('修改V2姓名')
        .onClick(() => {
          this.userV2.name = '新名字'
          // 只有使用 userV2.name 的组件会重新渲染
          // 使用 userV2.age 的组件不会重新渲染
        })
    }
  }
}
```

> 💡 @ObservedV2 优势：
>
> | 特性 | @Observed | @ObservedV2 |
> |------|-----------|-------------|
> | 精细化更新 | ❌ 不支持 | ✅ 支持 @Track |
> | 嵌套对象 | 需要手动处理 | 自动支持 |
> | 数组监听 | 需要整体替换 | 支持数组元素变化 |
> | 性能 | 一般 | 更优 |

## UI渲染装饰器

### @Builder - 轻量UI复用

`@Builder` 用于定义轻量级的 UI 复用单元。

```typescript
@Entry
@Component
struct BuilderComponent {
  @State count: number = 0

  // 无参数的 @Builder
  @Builder
  buildText() {
    Text('这是一个文本组件')
      .fontSize(16)
      .fontColor('#333')
  }

  // 带参数的 @Builder
  @Builder
  buildItem(title: string, value: number) {
    Row() {
      Text(title)
        .width('50%')
      Text(`${value}`)
        .width('50%')
    }
    .width('100%')
    .height(50)
    .backgroundColor('#f5f5f5')
    .borderRadius(8)
  }

  // 使用对象参数
  @Builder
  buildCard(item: Item) {
    Column() {
      Text(item.title)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
      Text(item.description)
        .fontSize(14)
        .fontColor('#666')
    }
    .padding(16)
    .backgroundColor('#fff')
    .borderRadius(12)
    .shadow({ radius: 4, color: '#00000020' })
  }

  build() {
    Column({ space: 10 }) {
      // 使用无参数 @Builder
      this.buildText()
      
      // 使用带参数 @Builder
      this.buildItem('计数', this.count)
      this.buildItem('价格', 99)
      
      // 使用对象参数
      this.buildCard({ title: '商品标题', description: '商品描述' })
      
      Button('增加计数')
        .onClick(() => {
          this.count++
        })
    }
    .padding(16)
  }
}

interface Item {
  title: string
  description: string
}
```

### @BuilderFn - 引用传递

`@BuilderFn` 用于将 `@Builder` 函数作为参数传递。

```typescript
@Component
struct ListComponent {
  // 使用 @BuilderFn 接收 builder 函数
  @BuilderParam itemBuilder: (item: string, index: number) => void = this.defaultItemBuilder

  @Builder
  defaultItemBuilder(item: string, index: number) {
    Text(`${index}: ${item}`)
  }

  build() {
    Column() {
      ForEach(['A', 'B', 'C'], (item: string, index: number) => {
        this.itemBuilder(item, index)
      })
    }
  }
}

@Entry
@Component
struct BuilderFnComponent {
  @State items: string[] = ['苹果', '香蕉', '橙子']

  // 自定义的 builder
  @Builder
  customItemBuilder(item: string, index: number) {
    Row() {
      Text(`${index + 1}.`)
        .width(30)
      Text(item)
        .fontSize(16)
    }
    .width('100%')
    .height(50)
    .backgroundColor('#e0e0e0')
    .borderRadius(8)
    .margin({ bottom: 8 })
  }

  build() {
    Column() {
      // 使用默认 builder
      Text('默认样式:')
      ListComponent()
      
      // 传递自定义 builder
      Text('自定义样式:')
      ListComponent({ 
        itemBuilder: this.customItemBuilder 
      })
    }
    .padding(16)
  }
}
```

### @BuilderParam - 插槽

`@BuilderParam` 用于定义组件插槽，允许外部传入 UI 内容。

```typescript
@Component
struct CardComponent {
  @BuilderParam header: () => void
  @BuilderParam content: () => void
  @BuilderParam footer?: () => void  // 可选插槽

  build() {
    Column() {
      // 头部插槽
      Column() {
        this.header()
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#f0f0f0')

      // 内容插槽
      Column() {
        this.content()
      }
      .width('100%')
      .padding(16)

      // 底部插槽（可选）
      if (this.footer) {
        Column() {
          this.footer()
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#f0f0f0')
      }
    }
    .backgroundColor('#fff')
    .borderRadius(12)
    .shadow({ radius: 8, color: '#00000020' })
  }
}

@Entry
@Component
struct BuilderParamComponent {
  @State count: number = 0

  build() {
    Column({ space: 16 }) {
      // 使用卡片组件，传入插槽内容
      CardComponent({
        header: () => {
          Text('卡片标题')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
        },
        content: () => {
          Column() {
            Text('卡片内容')
            Text(`计数: ${this.count}`)
          }
        },
        footer: () => {
          Row() {
            Button('取消')
            Button('确定')
              .onClick(() => {
                this.count++
              })
          }
          .justifyContent(FlexAlign.End)
        }
      })
    }
    .padding(16)
  }
}
```

> 💡 @BuilderParam 使用场景：
>
> - 创建可复用的容器组件
> - 实现类似 Vue 的 slot 功能
> - 允许外部自定义组件内部部分 UI

## 样式装饰器

### @Styles - 样式复用

`@Styles` 用于提取和复用通用样式。

```typescript
// 全局样式（在 struct 外部定义）
@Styles function commonTextStyles() {
  .fontSize(16)
  .fontColor('#333')
  .fontWeight(FontWeight.Normal)
}

@Styles function commonButtonStyles() {
  .width(200)
  .height(44)
  .borderRadius(22)
  .backgroundColor('#007DFF')
}

@Entry
@Component
struct StylesComponent {
  // 组件内样式
  @Styles
  highlightText() {
    .fontSize(18)
    .fontColor('#FF0000')
    .fontWeight(FontWeight.Bold)
  }

  build() {
    Column({ space: 10 }) {
      // 使用全局样式
      Text('普通文本')
        .commonTextStyles()

      // 使用组件内样式
      Text('高亮文本')
        .highlightText()

      // 组合使用样式
      Text('组合样式')
        .commonTextStyles()
        .highlightText()  // 后面的样式会覆盖前面的

      // 按钮样式
      Button('提交')
        .commonButtonStyles()
    }
    .padding(16)
  }
}
```

> ⚠️ @Styles 限制：
>
> - 只能设置通用样式属性
> - 不能设置事件（如 onClick）
> - 组件内样式只能被当前组件使用
> - 全局样式可以在任何组件使用

### @Extend - 扩展原生组件

`@Extend` 用于扩展原生组件的功能，支持添加事件。

```typescript
// 扩展 Text 组件
@Extend(Text)
function styledText(text: string, color: ResourceColor = '#333') {
  .fontSize(16)
  .fontColor(color)
  .textOverflow({ overflow: TextOverflow.Ellipsis })
  .maxLines(1)
}

// 扩展 Button 组件，支持事件
@Extend(Button)
function primaryButton(onClick: () => void) {
  .width(200)
  .height(44)
  .borderRadius(22)
  .backgroundColor('#007DFF')
  .fontColor('#fff')
  .onClick(onClick)
}

@Entry
@Component
struct ExtendComponent {
  @State count: number = 0

  build() {
    Column({ space: 10 }) {
      // 使用扩展的 Text
      Text('这是一段很长的文本内容，会被截断显示省略号')
        .styledText('这是一段很长的文本内容，会被截断显示省略号')
        .width(200)

      Text('警告文本')
        .styledText('警告文本', '#FF0000')

      // 使用扩展的 Button
      Button('点击增加')
        .primaryButton(() => {
          this.count++
        })

      Text(`当前计数: ${this.count}`)
    }
    .padding(16)
  }
}
```

> 💡 @Extend vs @Styles：
>
> | 特性 | @Styles | @Extend |
> |------|---------|---------|
> | 支持事件 | ❌ | ✅ |
> | 支持参数 | ❌ | ✅ |
> | 作用范围 | 所有组件 | 指定组件 |
> | 定义位置 | struct 内/外 | struct 外 |

## 其他装饰器

### @Require - 必传参数

`@Require` 标记父组件必须传递的参数。

```typescript
@Component
struct RequireComponent {
  @Require
  @Prop title: string = ''  // 必须传递

  @Prop description: string = ''  // 可选

  build() {
    Column() {
      Text(this.title)
        .fontSize(18)
      Text(this.description)
        .fontSize(14)
    }
  }
}

@Entry
@Component
struct RequireParent {
  build() {
    Column() {
      // ✅ 正确：传递了必传参数
      RequireComponent({ 
        title: '标题' 
      })

      // ✅ 正确：传递了所有参数
      RequireComponent({ 
        title: '标题',
        description: '描述'
      })

      // ❌ 错误：缺少必传参数（编译时报错）
      // RequireComponent({ })
    }
  }
}
```

### @Local - 本地变量

`@Local` 用于声明组件内的本地变量，不会触发 UI 刷新。

```typescript
@Component
struct LocalComponent {
  @Local tempValue: number = 0  // 不会触发刷新
  @State count: number = 0      // 会触发刷新

  build() {
    Column({ space: 10 }) {
      Text(`本地变量: ${this.tempValue}`)
      Text(`状态变量: ${this.count}`)

      Button('修改本地变量')
        .onClick(() => {
          this.tempValue++  // UI 不会更新
          console.log(this.tempValue)
        })

      Button('修改状态变量')
        .onClick(() => {
          this.count++  // UI 会更新
        })
    }
  }
}
```

### @Param - 页面路由参数

`@Param` 用于页面路由传参，支持基本类型和对象类型。

```typescript
// 定义页面参数接口
interface PageInfo {
  id: string
  name: string
  age: number
}

// 页面 A
@Entry
@Component
struct PageA {
  // 使用 @Param 接收路由参数
  @Param id: string = ''
  @Param name: string = ''
  @Param user: PageInfo = { id: '', name: '', age: 0 }

  build() {
    Column() {
      Text(`用户ID: ${this.id}`)
      Text(`用户名: ${this.name}`)
      Text(`年龄: ${this.user.age}`)
    }
  }
}

// 页面B
@Entry
@Component
struct PageB {
  // 使用 @Param 接收路由参数
  @Param id: string = ''
  @Param name: string = ''
  @Param user: PageInfo = { id: '', name: '', age: 0 }

  build() {
    Column() {
      Text(`用户ID: ${this.id}`)
      Text(`用户名: ${this.name}`)
      Text(`年龄: ${this.user.age}`)
    }
  }
}

// 页面跳转
import router from '@ohos/router'

@Entry
@Component
struct PageC {
  @Param id: string = ''
  @Param name: string = ''
  @Param user: PageInfo = { id: '', name: '', age: 0 }

  build() {
    Column() {
      Text(`用户ID: ${this.id}`)
      Text(`用户名: ${this.name}`)
      Text(`年龄: ${this.user.age}`)
      
      Button('跳转到详情页')
        .onClick(() => {
          // 落地跳转
          router.pushUrl({
            url: `pages/PageC?id=${this.id}`
          }, router.RouterMode.Standard)
        })
    }
  }
}
```

> 💡 @Param 特点：
>
> - 用于页面路由传参
> - 支持基本类型和对象类型
> - 参数变化会触发 UI 刷新
> - 必须在 `@Entry` 组件中使用

### @Once - 单次初始化

`@Once` 用于标记组件只初始化一次，适用于只需要重复初始化或只需执行一次的场景。

```typescript
@Component
struct OnceComponent {
  @Once message: string = '初始化消息'

  build() {
    Column() {
      Text(this.message)
      
      Button('显示消息')
        .onClick(() => {
          console.log(this.message)
          // 再次点击不会再次显示
        })

      Button('修改消息')
        .onClick(() => {
          this.message = '新消息'
          // 修改后不会再次显示初始化消息
        })
    }
  }
}
```

> 💡 @Once 使用场景：
>
> - 初始化只需要执行一次的逻辑
> - 加载配置信息（如主题、语言包）
> - 事件监听器（只监听一次）
> - 避免重复初始化带来的性能开销

### @Event - 事件监听器

`@Event` 用于监听组件或元素的事件，实现事件处理逻辑的复用。

```typescript
// 子组件
@Component
struct EventChild {
  @Event onButtonClick: (value: string) => void = {}

  build() {
    Column() {
      Text('子组件')
      Button('点击触发事件')
        .onClick(() => {
          this.onButtonClick('Hello from Child')
        })
    }
  }
}

// 父组件
@Entry
@Component
struct EventParent {
  private onButtonClick?: (value: string) => void

  build() {
    Column() {
      Text('父组件')
      Button('传递事件给子组件')
        .onClick(() => {
          if (this.onButtonClick) {
            this.onButtonClick('Hello from Parent')
          }
        })
    }
  }
}
```

> 💡 @Event 使用场景：
>
> - 父子组件事件通信
> - 实现事件回调
> - 替代传统的 `onClick` 属性
> - 支持多个事件监听器

### @Monitor - 监听组件生命周期

`@Monitor` 用于监听组件的生命周期变化。

```typescript
@Component
struct MonitorComponent {
  @Monitor
  aboutToAppear: () => void

  build() {
    Column() {
      Text('组件即将出现')
    }
  }
}

  aboutToDisappear() {
    console.log('组件即将消失')
  }
}
```

> 💡 @Monitor 监听的生命周期：
>
> - `aboutToAppear`: 组件即将出现时调用
> - `aboutToDisappear`: 组件即将消失时调用
> - `onAreaChange`: 组件显示区域变化时调用

> ⚠️ @Monitor 注意事项：
>
> - 不要在监听回调中执行耗时操作
> - 可以使用 `@Monitor` 监听组件的创建和销毁
> - 监听回调中的 `this` 指向当前组件实例

> 💡 @Monitor 与 @Watch 的区别：
>
> | 装饰器 | 说明 | 触发时机 | 适用场景 |
> |--------|------|----------|----------|
> | @Monitor | 监听生命周期 | 组件创建/销毁时 | 需要响应生命周期变化 |
> | @Watch | 监听状态变化 | 状态变化时 | 需要响应状态变化 |

### @StorageLink 和 @StorageProp - 应用级状态

用于应用级别的状态管理。

```typescript
// 在 EntryAbility 中初始化
// AppStorage.SetOrCreate('token', 'initial-token')
// AppStorage.SetOrCreate('userInfo', { name: '张三', id: 1 })

@Component
struct StorageComponent {
  // 双向绑定
  @StorageLink('token') token: string = ''
  @StorageLink('userInfo') userInfo: UserInfo = { name: '', id: 0 }

  // 单向绑定
  @StorageProp('theme') theme: string = 'light'

  build() {
    Column({ space: 10 }) {
      Text(`Token: ${this.token}`)
      Text(`用户: ${this.userInfo.name}`)
      Text(`主题: ${this.theme}`)

      Button('修改Token')
        .onClick(() => {
          this.token = 'new-token-123'  // 同步到 AppStorage
        })

      Button('修改用户信息')
        .onClick(() => {
          this.userInfo.name = '李四'  // 同步到 AppStorage
        })
    }
  }
}

interface UserInfo {
  name: string
  id: number
}
```

> 💡 AppStorage 使用场景：
>
> - 用户登录状态
> - 全局主题配置
> - 应用配置信息
> - 跨页面共享数据

### 应用级与页面级状态的区别

| 特性 | @StorageLink / @StorageProp (AppStorage) | @LocalStorageLink / @LocalStorageProp (LocalStorage) |
|------|-----------------------------------------|----------------------------------------------------|
| 作用范围 | 应用全局 | 页面级别 |
| 存储位置 | AppStorage | LocalStorage |
| 生命周期 | 应用启动到应用销毁 | 页面打开到页面关闭 |
| 数据共享 | 全应用共享 | 仅当前页面共享 |
| 数据持久化 | 应用内持久 | 页面内临时 |

#### 使用场景对比

| 场景类型 | 推荐使用 | 原因 |
|---------|---------|------|
| 全局配置 | @StorageLink / @StorageProp | 需要在整个应用中共享 |
| 用户状态 | @StorageLink / @StorageProp | 登录状态需要全应用访问 |
| 跨页面数据 | @StorageLink / @StorageProp | 不同页面之间需要共享数据 |
| 表单数据 | @LocalStorageLink / @LocalStorageProp | 仅页面内使用，页面关闭后无需保留 |
| 搜索条件 | @LocalStorageLink / @LocalStorageProp | 仅当前页面有效 |
| 页面配置 | @LocalStorageLink / @LocalStorageProp | 仅影响当前页面 |
| 临时状态 | @LocalStorageLink / @LocalStorageProp | 页面关闭后自动清理 |

### @LocalStorageLink 和 @LocalStorageProp - 页面级状态

用于页面级别的状态管理。

```typescript
// 创建 LocalStorage
const storage: LocalStorage = new LocalStorage({
  'pageData': { title: '页面标题', count: 0 }
})

@Entry(storage)
@Component
struct LocalStorageComponent {
  // 双向绑定
  @LocalStorageLink('pageData') pageData: PageData = { title: '', count: 0 }

  build() {
    Column({ space: 10 }) {
      Text(this.pageData.title)
      Text(`计数: ${this.pageData.count}`)

      Button('增加计数')
        .onClick(() => {
          this.pageData.count++
        })
    }
  }
}

interface PageData {
  title: string
  count: number
}
```

## 装饰器对比总结

### 状态管理装饰器对比

| 装饰器 | 数据流向 | 触发刷新 | 使用场景 |
|--------|----------|----------|----------|
| @State | 本地 | ✅ | 组件内部状态 |
| @Prop | 父→子 | ✅ | 父子单向传递 |
| @Link | 父↔子 | ✅ | 父子双向绑定 |
| @ObjectLink | 父↔子 | ✅ | 嵌套对象 |
| @Provide/@Consume | 跨层级 | ✅ | 跨组件共享 |
| @StorageLink | 应用级 | ✅ | 全局状态双向 |
| @StorageProp | 应用级 | ✅ | 全局状态单向 |

### UI装饰器对比

| 装饰器 | 支持参数 | 支持事件 | 使用场景 |
|--------|----------|----------|----------|
| @Builder | ✅ | ❌ | UI片段复用 |
| @BuilderParam | ✅ | ❌ | 插槽 |
| @Styles | ❌ | ❌ | 样式复用 |
| @Extend | ✅ | ✅ | 组件扩展 |

## 性能与并发装饰器

### @Animatable - 动画属性装饰器

`@Animatable` 用于标记可动画化的属性，实现属性变化的动画效果。

```typescript
@Animatable
class AnimatableParams {
  width: number = 100
  height: number = 100
  color: string = '#FF0000'
  
  constructor(width: number, height: number, color: string) {
    this.width = width
    this.height = height
    this.color = color
  }
}

@Component
struct AnimatableComponent {
  @State animatableParams: AnimatableParams = new AnimatableParams(100, 100, '#FF0000')

  build() {
    Column() {
      Rect()
        .width(this.animatableParams.width)
        .height(this.animatableParams.height)
        .fill(this.animatableParams.color)
        .animation({
          duration: 1000,
          curve: Curve.EaseInOut
        })
      
      Button('动画变化')
        .onClick(() => {
          this.animatableParams = new AnimatableParams(200, 200, '#00FF00')
        })
    }
  }
}
```

> 💡 @Animatable 使用场景：
>
> - 需要平滑过渡的属性变化
> - 自定义动画效果
> - 配合 `animation` 属性使用

### @Reusable - 可复用组件装饰器

`@Reusable` 用于标记可复用的组件，优化组件创建和销毁的性能。

```typescript
@Reusable
@Component
struct ReusableItem {
  @State message: string = ''

  // 组件复用时调用，用于更新状态
  aboutToReuse(params: Record<string, Object>): void {
    this.message = params.message as string
    console.log('组件被复用')
  }

  // 组件回收时调用
  aboutToRecycle(): void {
    console.log('组件被回收')
  }

  build() {
    Text(this.message)
      .padding(10)
      .backgroundColor('#f0f0f0')
  }
}

@Entry
@Component
struct ReusableParent {
  @State items: string[] = ['Item 1', 'Item 2', 'Item 3']

  build() {
    Column() {
      ForEach(this.items, (item: string, index: number) => {
        ReusableItem({ message: item })
      }, (item: string) => item)
      
      Button('添加项目')
        .onClick(() => {
          this.items.push(`Item ${this.items.length + 1}`)
        })
      
      Button('移除项目')
        .onClick(() => {
          this.items.pop()
        })
    }
  }
}
```

> 💡 @Reusable 优势：
>
> - 减少组件创建和销毁的开销
> - 提升列表滚动性能
> - 适用于频繁创建销毁的组件
> - 配合 `aboutToReuse` 和 `aboutToRecycle` 生命周期使用

> ⚠️ @Reusable 注意事项：
>
> - 组件必须是无副作用的
> - 在 `aboutToReuse` 中重置状态
> - 避免在组件中保存不可复用的资源

### @Concurrent - 并发任务装饰器

`@Concurrent` 用于标记可以在后台线程执行的任务函数。

```typescript
@Concurrent
function heavyComputation(data: number[]): number {
  let result = 0
  for (let i = 0; i < data.length; i++) {
    result += data[i] * data[i]
  }
  return result
}

@Entry
@Component
struct ConcurrentComponent {
  @State result: number = 0
  @State isComputing: boolean = false

  async computeInBackground() {
    this.isComputing = true
    
    // 使用 TaskPool 在后台执行
    const taskPool = new taskpool.TaskPool()
    const data = Array.from({ length: 1000000 }, (_, i) => i)
    
    try {
      this.result = await taskpool.execute(heavyComputation, data)
    } catch (error) {
      console.error('计算错误:', error)
    } finally {
      this.isComputing = false
    }
  }

  build() {
    Column({ space: 10 }) {
      Text(`结果: ${this.result}`)
      
      Button(this.isComputing ? '计算中...' : '开始计算')
        .enabled(!this.isComputing)
        .onClick(() => {
          this.computeInBackground()
        })
    }
  }
}
```

> 💡 @Concurrent 使用场景：
>
> - 大量数据计算
> - 图像处理
> - 文件解析
> - 不阻塞主线程的耗时操作

> ⚠️ @Concurrent 注意事项：
>
> - 函数必须是纯函数，不能访问组件状态
> - 不能使用 UI 相关 API
> - 参数和返回值必须是可序列化的
> - 需要配合 TaskPool 使用

### @Sendable - 可发送装饰器

`@Sendable` 用于标记可以在不同线程间传递的数据类。

```typescript
@Sendable
class SendableData {
  name: string = ''
  value: number = 0
  
  constructor(name: string, value: number) {
    this.name = name
    this.value = value
  }
}

@Sendable
class SendableArray {
  items: number[] = []
  
  constructor(items: number[]) {
    this.items = items
  }
  
  sum(): number {
    return this.items.reduce((a, b) => a + b, 0)
  }
}

@Concurrent
function processData(data: SendableData, arr: SendableArray): number {
  console.log(`处理数据: ${data.name}`)
  return data.value + arr.sum()
}

@Entry
@Component
struct SendableComponent {
  @State result: number = 0

  async processInBackground() {
    const data = new SendableData('测试', 100)
    const arr = new SendableArray([1, 2, 3, 4, 5])
    
    const taskPool = new taskpool.TaskPool()
    this.result = await taskpool.execute(processData, data, arr)
  }

  build() {
    Column({ space: 10 }) {
      Text(`结果: ${this.result}`)
      
      Button('处理数据')
        .onClick(() => {
          this.processInBackground()
        })
    }
  }
}
```

> 💡 @Sendable 使用场景：
>
> - 跨线程数据传递
> - 配合 @Concurrent 使用
> - TaskPool 任务参数和返回值
> - Worker 通信数据

> ⚠️ @Sendable 注意事项：
>
> - 类中只能包含基本类型和可序列化类型
> - 不能包含函数类型（方法除外）
> - 不能包含 Symbol 类型
> - 需要配合 TaskPool 或 Worker 使用

## 最佳实践

### 1. 选择合适的状态装饰器

```typescript
// ❌ 不推荐：过度使用 @State
@Component
struct BadExample {
  @State items: string[] = []  // 如果只是展示，不需要 @State
  @State config: Config = {}   // 如果不会变化，不需要 @State
}

// ✅ 推荐：根据需求选择
@Component
struct GoodExample {
  @State items: string[] = []        // 会变化，需要 @State
  config: Config = {}                // 不会变化，普通变量
  @Prop readonly title: string = ''  // 父组件传入，只读
}
```

### 2. 避免状态嵌套过深

```typescript
// ❌ 不推荐：嵌套过深
@State data: Data = {
  level1: {
    level2: {
      level3: {
        value: ''
      }
    }
  }
}

// ✅ 推荐：扁平化结构
@State value: string = ''
@State level1Data: Level1Data = {}
```

### 3. 合理使用 @Builder 复用 UI

```typescript
// ✅ 推荐：将重复的 UI 抽取为 @Builder
@Component
struct ListPage {
  @Builder
  listItem(title: string, value: string) {
    Row() {
      Text(title)
      Blank()
      Text(value)
    }
    .width('100%')
    .height(50)
  }

  build() {
    List() {
      ListItem() { this.listItem('姓名', '张三') }
      ListItem() { this.listItem('年龄', '25') }
      ListItem() { this.listItem('城市', '北京') }
    }
  }
}
```

### 4. 使用 @Watch 处理副作用

```typescript
@Component
struct SearchComponent {
  @State @Watch('onKeywordChange') keyword: string = ''
  @State searchResults: string[] = []

  onKeywordChange(newValue: string) {
    // 防抖搜索
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.search(newValue)
    }, 300)
  }

  private timer: number = -1

  search(keyword: string) {
    // 执行搜索
  }

  build() {
    Column() {
      TextInput({ placeholder: '搜索' })
        .onChange((value) => {
          this.keyword = value
        })
      
      List() {
        ForEach(this.searchResults, (item: string) => {
          ListItem() {
            Text(item)
          }
        })
      }
    }
  }
}
```

## 常见问题

### 1. 状态变化但 UI 不更新

```typescript
// ❌ 问题：直接修改数组元素
this.list[0] = 'new value'  // 不会触发更新

// ✅ 解决：重新赋值整个数组
this.list = [...this.list]

// 或使用数组方法
this.list.splice(0, 1, 'new value')
```

### 2. @Prop 不能修改

```typescript
// ❌ 问题：尝试修改 @Prop
@Component
struct Child {
  @Prop value: number = 0
  
  build() {
    Button('增加')
      .onClick(() => {
        this.value++  // 编译错误
      })
  }
}

// ✅ 解决：使用 @Link 或回调函数
@Component
struct Child {
  @Link value: number  // 使用 @Link
  
  // 或使用回调
  @Prop value: number = 0
  onIncrease?: () => void
  
  build() {
    Button('增加')
      .onClick(() => {
        this.onIncrease?.()  // 调用父组件方法
      })
  }
}
```

### 3. @ObjectLink 类型错误

```typescript
// ❌ 问题：@ObjectLink 接收非 @Observed 类型
@Component
struct Child {
  @ObjectLink user: User  // User 没有 @Observed
}

// ✅ 解决：添加 @Observed
@Observed
class User {
  name: string = ''
}
```

## 装饰器速查表

| 装饰器 | 类型 | 说明 |
|--------|------|------|
| @Component | 组件 | 定义自定义组件 |
| @Entry | 组件 | 标记页面入口 |
| @Preview | 组件 | DevEco 预览 |
| @State | 状态 | 本地状态，触发刷新 |
| @Prop | 状态 | 父→子单向传递 |
| @Link | 状态 | 父↔子双向绑定 |
| @ObjectLink | 状态 | 嵌套对象双向绑定 |
| @Observed | 状态 | 标记类可被观察 |
| @ObservedV2 | 状态 | 标记类可被观察(支持@Track) |
| @Provide | 状态 | 提供跨层级数据 |
| @Consume | 状态 | 消费跨层级数据 |
| @Watch | 状态 | 监听状态变化 |
| @Track | 状态 | 精细化更新控制 |
| @Type | 状态 | 类型标记(配合@ObservedV2) |
| @Param | 状态 | 页面路由参数 |
| @Once | 状态 | 单次初始化 |
| @Event | 状态 | 事件监听器 |
| @Monitor | 状态 | 监听组件生命周期 |
| @Builder | UI | 定义 UI 片段 |
| @BuilderParam | UI | 定义插槽 |
| @BuilderFn | UI | 传递 builder 函数 |
| @Styles | 样式 | 复用样式 |
| @Extend | 样式 | 扩展组件 |
| @Require | 参数 | 标记必传参数 |
| @Local | 变量 | 本地变量 |
| @StorageLink | 状态 | 应用级双向绑定 |
| @StorageProp | 状态 | 应用级单向绑定 |
| @LocalStorageLink | 状态 | 页面级双向绑定 |
| @LocalStorageProp | 状态 | 页面级单向绑定 |
| @Animatable | 动画 | 可动画化属性 |
| @Reusable | 性能 | 可复用组件 |
| @Concurrent | 并发 | 后台线程任务 |
| @Sendable | 并发 | 可跨线程传递数据 |
