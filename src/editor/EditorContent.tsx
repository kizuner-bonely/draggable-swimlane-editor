import { PureComponent } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import styles from './editor.module.less'

type listType = {
  title: string
  contents: Array<{ id: string; uid: number; content: string }>
}
export type ListsProps = Array<listType>

interface IProps {
  lists: ListsProps
}

export default class EditorContent extends PureComponent<IProps> {
  render() {
    const { lists } = this.props

    return (
      <>
        <div className={styles['editor-content']}>
          <div className={styles.lists}>
            {lists.map((l) => (
              <div key={l.title} className={styles.list}>
                <p className={styles.title}>{l.title}</p>
                <Droppable droppableId={l.title}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                      {l.contents.map((item, index) => (
                        <Draggable
                          key={`${l.title}-${item.id}-${index}`}
                          draggableId={`${l.title}-${item.id + index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              id={`${item.uid}`}
                              className={styles.nodes}
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
}
