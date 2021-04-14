import { PureComponent } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styles from './editor.module.less'

export interface MenuProps {
  id: string
  uid: number
  content: string
}

interface IProps {
  menu: Array<MenuProps>
}

export default class EditorMenu extends PureComponent<IProps> {
  render() {
    const { menu } = this.props
    return (
      <div className={styles['editor-menu']}>
        <Droppable droppableId={'menu'}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} className={styles.wrapper}>
              {menu.map((m, index) => (
                <Draggable
                  key={m.id}
                  draggableId={`MENU-${m.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      id={`${m.uid}`}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles['menu-item']}
                    >
                      {m.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }
}
