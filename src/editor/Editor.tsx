import EditorMenu from './EditorMenu'
import EditorContent from './EditorContent'
import { useCallback, useState } from 'react'
import {DragDropContext} from 'react-beautiful-dnd'
import styles from './editor.module.less'

export default function Editor() {
  const [list, setList] = useState([
    {
      id: '1',
      content: 'aaa'
    },
    {
      id: '2',
      content: 'bbb'
    }
  ])
  
  const onDragEnd = useCallback((result: any) => {
  
  }, [])
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.editor}>
        <EditorMenu/>
        <EditorContent list={list}/>
      </div>
    </DragDropContext>
  )
}
