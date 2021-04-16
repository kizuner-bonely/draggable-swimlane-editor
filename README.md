## 可视化泳道图编辑器

该编辑器通过元素节点的拖拽和连线生成泳道图数据

泳道图的数据结构

```ts
type directions = 'Top' | 'Bottom' | 'Left' | 'Right'

interface Connection {
  target: string;	// 目标节点的uid
  sourcePoint: directions;
  targetPoint: directions;
}

interface Node {
  id: string;
  uid: number;
  content: string;
  connects: Array<Connection>
}

interface SwimLaneContent {
  title: string;	// 泳道的名称
  contents: Array<Node>;
}

type SwimLane = Array<SwimLaneContent>
```



---

## 功能点备注

============= 1 =============

在 `src/editor`目录下，有 `mxgraph` 和 `react-dnd` 还有 `Editor.tsx`等文件

`mxgraph` 部分是使用 jsplumb 实现的图形连线 demo

`react-dnd` 部分是使用 react-beautiful-dnd 实现的拖拽 demo

剩下的部分是以上二者结合在一起的编辑器页面，也是本项目的核心

在编辑器页面中删去了手动添加、删除泳道的功能

以上功能的实现参考 `src/store/models/swimLanes` 中的 reducers

============= 2 =============

注意本项目中有三个比较重要的数据结构声明

```ts
// src/store/models/swimLanes.ts
interface SwimLaneContent {
  id: string;
  uid: number;
  content: string;
}

interface SwimLaneType {
  title: string;
  contents: SwimLaneContent;
}

// src/editor/Editor.tsx
interface DroppableType {
  droppableId: string;
  index: number;
}
```

1. SwimLaneContent
   泳道图中的节点所承载的数据的结构
2. SwimLaneType
   泳道图中的泳道所代表的数据结构
3. DroppableType
   该接口声明用于 react-beautiful-dnd 中的可拖拽区域声明

---

## 项目涉及的技术栈文档/教程

============= 1 =============

**react-beautiful-dnd**

该技术栈实现的是拖拽功能

* https://egghead.io/lessons/react-customize-screen-reader-messages-for-drag-and-drop-with-react-beautiful-dnd
* https://codesandbox.io/s/ql08j35j3q?file=/index.js

============= 2 =============

**jsplumb**

该技术栈实现的是连线功能

虽然该技术栈提供了让组件进行拖拽的能力，但是从综合的业务场景来看还是交给 react-beautiful-dnd 比较合适

* https://github.com/wangduanduan/jsplumb-chinese-tutorial#11-%E4%BB%80%E4%B9%88%E6%98%AFjsplumb
* https://www.cnblogs.com/zzsdream/p/10906219.html
* https://www.jianshu.com/p/d68a8e61ff2d
* https://shawchen08.github.io/2019/03/21/jsPlumb-docs/#to-overlays
* https://www.jianshu.com/p/2e12d1acaabb

============= 3 =============

**@rematch/core**

该技术栈是  `redux` 和 `react-redux` 的进一步封装

**参考材料:**

* https://react-redux.js.org/using-react-redux/usage-with-typescript
* https://rematchjs.org/docs/getting-started/typescript#usedispatch

**最佳实践:**

使用全局状态

`index.tsx`

```tsx
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from '@/store/store'
import './index.css'

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
)

```

添加全局状态
`store/models/menu.ts`

```ts
interface MenusType {
  id: string
  uid: number
  content: string
}

const model = {
  state: [
    {
      id: '1',
      uid: 1618385128014,
      content: 'menuItem A',
    },
    {
      id: '2',
      uid: 1618385128015,
      content: 'menuItem B',
    },
  ] as Array<MenusType>,
  reducers: {},
  effects: {},
}

export default model

```

`store/store.ts`

```ts
import { init, Models, RematchDispatch } from '@rematch/core'
import updatedPlugin, { ExtraModelsFromUpdated } from '@rematch/updated'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'
import swimLanes from './models/swimLanes'
import menu from './models/menu'

interface RootModal extends Models<RootModal> {
  swimLanes: typeof swimLanes;
  menu: typeof menu;
}

type FullModel = ExtraModelsFromLoading<RootModal> & ExtraModelsFromUpdated<RootModal>

const models = { swimLanes, menu }

const store = init<RootModal, FullModel>({
  models,
  plugins: [
    loadingPlugin(),
    updatedPlugin(),
  ],
})
export default store

export type RootState = RematchDispatch<typeof models>
export type RootDispatch = RematchDispatch<typeof models>

```

连接全局状态

```tsx
import { connect } from 'react-redux'
import { RootDispatch, RootState } from '@/store/store'

type SomePageProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

function SomePage({ login, changeLoginStatus }: SomePageProps) {
  return (
  	<div>
    	<button onClick={() => changeLoginStatus(!login)}>change</button>
    </div>
  )
}
                                
const mapStateToProps = (state: RootState) => ({
  login: state.login,
})

const mapDispatchToProps = (dispatch: RootDispatch) => ({
  changeLoginStatus: dispatch.login.changeLoginStatus,
})

export default connect(mapStateToProps, mapDispatchToProps)(SomePage)
```











