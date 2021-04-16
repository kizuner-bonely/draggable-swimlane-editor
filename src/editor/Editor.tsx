import { PureComponent } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { RootDispatch, RootState } from '@/store/store'
import { SwimLaneContent, ConnectionPointType } from '@/store/models/swimLanes'
import styles from './editor.module.less'
import EditorMenu, { MenuProps } from './EditorMenu'
import EditorContent from './EditorContent'
import common from './config'
import 'jsplumb'

type EditorProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

interface DroppableType {
  droppableId: string
  index: number
}

interface ConnectionType {
  sourceId: string
  targetId: string
  sourceEndpoint: { [key: string]: any }
  targetEndpoint: { [key: string]: any }
  source: { [key: string]: any }
  target: { [key: string]: any }
  connection: { [key: string]: any }
}

//* 重置列表元素顺序
const reorder = (
  list: SwimLaneContent[],
  startIndex: number,
  endIndex: number,
) => {
  const res = [...list]
  const [removed] = res.splice(startIndex, 1)
  res.splice(endIndex, 0, removed)
  return res
}

//* 复制元素到另一表中
const copy = (
  source: SwimLaneContent[],
  destination: SwimLaneContent[],
  droppableSource: DroppableType,
  droppableDestination: DroppableType,
) => {
  const sourceClone = [...source]
  const destClone = [...destination]
  const item = sourceClone[droppableSource.index]
  const newItem = Object.assign({}, item)
  newItem.uid = new Date().getTime()
  destClone.splice(droppableDestination.index, 0, newItem)
  return destClone
}

//* 将元素移到另一列表中
const move = (
  source: SwimLaneContent[],
  destination: SwimLaneContent[],
  droppableSource: DroppableType,
  droppableDestination: DroppableType,
) => {
  const sourceClone = [...source]
  const destinationClone = [...destination]
  const [removed] = sourceClone.splice(droppableSource.index, 1)
  destinationClone.splice(droppableDestination.index, 0, removed)
  return { sourceClone, destinationClone }
}

const directionMap = {
  '0': {
    '0.5': 'Left',
  },
  '0.5': {
    '0': 'Top',
    '1': 'Bottom',
  },
  '1': {
    '0.5': 'Right',
  },
}

class Editor extends PureComponent<EditorProps> {
  jsPlumb: any

  onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    const { swimLanes, updateList, menu } = this.props
    //* 将可拖拽的组件拉到可拖拽区域以外的地方或者菜单栏时动作无效
    if (!destination || destination.droppableId === 'menu') return
    //* 在当前区域调整顺序
    if (source.droppableId === destination.droppableId) {
      const _swimLanes = JSON.parse(JSON.stringify(swimLanes))
      const list = _swimLanes.find(
        (v: { title: string }) => v.title === destination.droppableId,
      )
      const newList = reorder(list.contents, source.index, destination.index)
      updateList({ title: destination.droppableId, contents: newList })
    } else if (source.droppableId === 'menu') {
      //* 从菜单栏拖出元素
      const swimLanesClone = JSON.parse(JSON.stringify(swimLanes))
      const destinationClone = copy(
        menu as any,
        swimLanesClone.find(
          (v: { title: string }) => v.title === destination.droppableId,
        )!.contents,
        source,
        destination,
      )
      updateList({ title: destination.droppableId, contents: destinationClone })
    } else {
      //* 将编辑区域的元素拉到其他区域
      const swimLanesClone = JSON.parse(JSON.stringify(swimLanes))
      const { sourceClone, destinationClone } = move(
        swimLanesClone.find(
          (v: { title: string }) => v.title === source.droppableId,
        )!.contents,
        swimLanesClone.find(
          (v: { title: string }) => v.title === destination.droppableId,
        )!.contents,
        source,
        destination,
      )
      updateList({ title: source.droppableId, contents: sourceClone })
      updateList({ title: destination.droppableId, contents: destinationClone })
    }
  }

  connectToJsPlumb = (list: SwimLaneContent[]) => {
    list.forEach((i) => {
      //todo 这里应该根据节点类型添加连接点
      this.jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Right'] }, common)
      this.jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Left'] }, common)
      this.jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Top'] }, common)
      this.jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Bottom'] }, common)
    })
  }

  initSwimLanes = (
    swimLanes: Array<{ title: string; contents: SwimLaneContent[] }>,
  ) => {
    swimLanes.forEach((s) => {
      if (Array.isArray(s.contents)) {
        this.connectToJsPlumb(s.contents)
      }
    })
  }

  updateConnections = () => {
    const { swimLanes } = this.props
    if (Array.isArray(swimLanes)) {
      swimLanes.forEach((l) => {
        l.contents.forEach((c: SwimLaneContent) => {
          c.connects.forEach((p: ConnectionPointType) => {
            this.jsPlumb.connect({
              source: `${c.uid}`,
              target: `${p.target}`,
              editable: true,
              anchors: [p.sourcePoint, p.targetPoint],
              connector: ['Flowchart'],
              endpoint: 'Blank',
              EndpointStyle: { outlineStroke: 'transparent' },
              paintStyle: { strokeWidth: 2, outlineStroke: 'green' },
              overlays: [
                [
                  'Arrow',
                  { width: 15, height: 15, location: 1, visible: true },
                ],
              ],
            })
          })
        })
      })
    }
  }

  componentDidMount() {
    // @ts-ignore
    this.jsPlumb = jsPlumb
    const { swimLanes, addConnection } = this.props
    const initSwimLanes = this.initSwimLanes
    this.jsPlumb.ready(function () {
      if (Array.isArray(swimLanes)) initSwimLanes(swimLanes)
    })

    this.jsPlumb.bind('click', (conn: any, originalEvent: any) => {
      if (window.prompt('输入1删除连接') === '1') {
        this.jsPlumb.deleteConnection(conn)
      }
    })

    this.jsPlumb.bind(
      'connection',
      (info: ConnectionType, originalEvent: any) => {
        const { sourceId, targetId, sourceEndpoint, targetEndpoint } = info
        const sourceX = sourceEndpoint.anchor.x as keyof typeof directionMap
        const sourceY = sourceEndpoint.anchor.y as '0' & '0.5' & '1'
        const targetX = targetEndpoint.anchor.x as keyof typeof directionMap
        const targetY = targetEndpoint.anchor.y as '0' & '0.5' & '1'
        addConnection({
          uid: sourceId,
          target: targetId,
          sourcePoint: directionMap[sourceX][sourceY],
          targetPoint: directionMap[targetX][targetY],
        })
      },
    )

    setTimeout(() => {
      this.updateConnections()
    }, 0)
  }

  componentDidUpdate() {
    const { swimLanes } = this.props
    if (Array.isArray(swimLanes)) this.initSwimLanes(swimLanes)
  }

  render() {
    const { menu, swimLanes } = this.props

    return (
      <div className={styles.editor}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <EditorMenu menu={menu as MenuProps[]} />
          <EditorContent lists={swimLanes as any} />
        </DragDropContext>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  swimLanes: state.swimLanes,
  menu: state.menu,
})

const mapDispatchToProps = (dispatch: RootDispatch) => ({
  updateList: dispatch.swimLanes.update,
  addConnection: dispatch.swimLanes.addConnection,
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
