import { PureComponent } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { RootDispatch, RootState } from '@/store/store'
import { SwimLaneContent } from '@/store/models/swimLanes'
import styles from './editor.module.less'
import EditorMenu, { MenuProps } from './EditorMenu'
import EditorContent from './EditorContent'
import common from './config'
import 'jsplumb'

type EditorProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

interface SwimLaneType {
  droppableId: string
  index: number
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
  droppableSource: SwimLaneType,
  droppableDestination: SwimLaneType,
) => {
  const sourceClone = [...source]
  const destClone = [...destination]
  const item = sourceClone[droppableSource.index]

  destClone.splice(droppableDestination.index, 0, { ...item })
  return destClone
}

//* 将元素移到另一列表中
const move = (
  source: SwimLaneContent[],
  destination: SwimLaneContent[],
  droppableSource: SwimLaneType,
  droppableDestination: SwimLaneType,
) => {
  const sourceClone = [...source]
  const destinationClone = [...destination]
  const [removed] = sourceClone.splice(droppableSource.index, 1)
  destinationClone.splice(droppableDestination.index, 0, removed)
  return { sourceClone, destinationClone }
}

class Editor extends PureComponent<EditorProps> {
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
      // @ts-ignore
      jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Right'] }, common)
      // @ts-ignore
      jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Left'] }, common)
      // @ts-ignore
      jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Top'] }, common)
      // @ts-ignore
      jsPlumb.addEndpoint(`${i.uid}`, { anchors: ['Bottom'] }, common)
    })
  }

  componentDidMount() {
    const { swimLanes } = this.props
    const connectToJsPlumb = this.connectToJsPlumb
    // @ts-ignore
    jsPlumb.ready(function () {
      if (Array.isArray(swimLanes)) {
        swimLanes.forEach((s) => {
          if (Array.isArray(s.contents)) {
            connectToJsPlumb(s.contents)
          }
        })
      }
    })

    // @ts-ignore
    jsPlumb.bind('click', function (conn, originalEvent) {
      // @ts-ignore
      if (window.prompt('输入1删除连接') === '1') jsPlumb.deleteConnection(conn)
    })
  }

  render() {
    const { menu, swimLanes, removeList } = this.props

    return (
      <div className={styles.editor}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <EditorMenu menu={menu as MenuProps[]} />
          <EditorContent lists={swimLanes as any} removeList={removeList} />
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
  removeList: dispatch.swimLanes.remove,
  updateList: dispatch.swimLanes.update,
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
