import EditorMenu from './EditorMenu'
import EditorContent from './EditorContent'
import { useCallback, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import styles from './editor.module.less'

export default function Editor() {
  const [mockList, setMockList] = useState([
    {
      id: '1',
      content: 'aaa',
    },
    {
      id: '2',
      content: 'bbb',
    },
  ])
  const [mockMenu] = useState([
    {
      id: '1',
      content: 'item A',
    },
    {
      id: '2',
      content: 'item B',
    },
  ])
  
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
        <EditorMenu mockMenu={mockMenu}/>
        <EditorContent list={mockList}/>
      </DragDropContext>
    </div>
  )
}
