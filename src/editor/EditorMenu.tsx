import droppableIdMap, { MENU } from './config'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styles from './editor.module.less'

interface IProps {
  mockMenu: Array<{ id: string; content: string; }>
}

export default function EditorMenu({ mockMenu }: IProps) {
  
  return (
    <div className={styles['editor-menu']}>
      <Droppable droppableId={droppableIdMap[MENU]}>
        {
          ((provided, snapshot) => (
            <div ref={provided.innerRef} className={styles.wrapper}>
              {
                mockMenu.map((m, index) => (
                  <Draggable
                    key={m.id}
                    draggableId={`MENU-${m.id}`}
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
              {provided.placeholder}
            </div>
          ))
        }
      </Droppable>
    </div>
  )
}
