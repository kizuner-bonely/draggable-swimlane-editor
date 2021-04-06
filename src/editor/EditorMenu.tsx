import droppableIdMap, {MENU} from './config'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import styles from './editor.module.less'
import { useMemo } from 'react'

export default function EditorMenu() {
  const mockMenu = useMemo(() => ([
    {
      id: '1',
      content: 'item A'
    },
    {
      id: '2',
      content: 'item B'
    },
  ]), [])
  
  return (
    <Droppable droppableId={droppableIdMap[MENU]}>
      {
        ((provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={styles['editor-menu']}
          >
            {
              mockMenu.map((m, index) => (
                <Draggable
                  key={m.id}
                  draggableId={m.id}
                  index={index}
                >
                  {
                    (provide, snapshot) => (
                      <div
                        ref={provide.innerRef}
                        {...provide.draggableProps}
                        {...provide.dragHandleProps}
                        className={styles['menu-item']}
                      >
                        {m.content}
                      </div>
                    )
                  }
                </Draggable>
              ))
            }
          </div>
        ))
      }
    </Droppable>
  )
}
