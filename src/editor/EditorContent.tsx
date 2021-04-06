import { PureComponent } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import droppableIdMap, { CONTENT } from './config'
import styles from './editor.module.less'

interface IProps {
  list: Array<{ id: string; content: string; }>
}

interface IState {
}

export default class EditorContent extends PureComponent<IProps, IState> {
  render() {
    const { list } = this.props
    return (
      <div className={styles['editor-content']}>
        <div className={styles.list}>
          <p className={styles.title}>
            test
          </p>
          <Droppable droppableId={droppableIdMap[CONTENT]}>
            {
              (provided, snapshot) => (
                <div ref={provided.innerRef} className={styles.wrapper}>
                  {
                    list.map((l, index) => (
                      <Draggable
                        key={l.id}
                        draggableId={`CONTENT-${l.id}`}
                        index={index}
                      >
                        {
                          (provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={styles.nodes}
                            >
                              {l.content}
                            </div>
                          )
                        }
                      </Draggable>
                    ))
                  }
                </div>
              )
            }
          </Droppable>
        </div>
      </div>
    )
  }
}
