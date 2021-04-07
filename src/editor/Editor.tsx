import type { MenuProps } from './EditorMenu'
import EditorMenu from './EditorMenu'
import EditorContent from './EditorContent'
import { useCallback, useState } from 'react'
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

function Editor({ swimLanes, menu, addList, removeList }: EditorProps) {
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
    //* 将可拖拽的组件拉到可拖拽区域以外的地方
    if (!destination) return
    //* 在当前区域调整顺序
    if (source.droppableId === destination.droppableId) {
    
    } else {
      //* 将当前区域的元素拉到其他区域
      
    }
    
  }, [])
  
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
