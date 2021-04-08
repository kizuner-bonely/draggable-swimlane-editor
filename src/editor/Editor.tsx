import type { MenuProps } from './EditorMenu'
import EditorMenu from './EditorMenu'
import EditorContent from './EditorContent'
import { useCallback } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { RootDispatch, RootState } from '@/store/store'
import styles from './editor.module.less'

type EditorProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const res = Array.from(list)
  const [removed] = res.splice(startIndex, 1)
  res.splice(endIndex, 0, removed)
  return res
}

function Editor({ swimLanes, menu, addList, removeList, updateList }: EditorProps) {
  /*
  * result 结构
  *   combine: null;
  *   type: string;
  *   reason: string;
  *   mode: string;
  *   draggableId: string;
  *   source: {
  *     droppableId: string;
  *     index: number;
  *   };
  *   destination: {
  *     droppableId: string;
  *     index: number;
  *   };
  * */
  const onDragEnd = useCallback((result: DropResult) => {
    console.log(result)
    const { source, destination } = result
    //* 将可拖拽的组件拉到可拖拽区域以外的地方或者菜单栏时动作无效
    if (!destination || destination.droppableId === 'menu') return
    //* 在当前区域调整顺序
    if (source.droppableId === destination.droppableId) {
      const _swimLanes = JSON.parse(JSON.stringify(swimLanes))
      const list = _swimLanes.find((v: {title: string}) => v.title === destination.droppableId)
      const newList = reorder(list.contents, source.index, destination.index)
      updateList({title: destination.droppableId, contents: newList})
    } else {
      //* 将当前区域的元素拉到其他区域
      
    }
    
  }, [swimLanes, updateList])
  
  return (
    <div className={styles.editor}>
      <DragDropContext onDragEnd={onDragEnd}>
        <EditorMenu menu={menu as MenuProps[]}/>
        <EditorContent lists={swimLanes as any} addList={addList} removeList={removeList}/>
      </DragDropContext>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  swimLanes: state.swimLanes,
  menu: state.menu,
})

const mapDispatchToProps = (dispatch: RootDispatch) => ({
  addList: dispatch.swimLanes.add,
  removeList: dispatch.swimLanes.remove,
  updateList: dispatch.swimLanes.update,
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
