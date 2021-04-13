import { Draggable, Droppable } from 'react-beautiful-dnd'
import styles from './editor.module.less'

export type MenuProps = { id: string; content: string; }

interface IProps {
  menu: Array<MenuProps>
}

export default function EditorMenu({ menu }: IProps) {
  
  return (
    <div className={styles['editor-menu']}>
      <Droppable
        droppableId={'menu'}
        type={'done'}
        isDropDisabled={true}
      >
        {
          ((provided, snapshot) => (
            <div ref={provided.innerRef} className={styles.wrapper}>
              {
                menu.map((m, index) => (
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
