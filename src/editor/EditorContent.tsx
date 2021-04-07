import { PureComponent } from 'react'
import { Button } from 'antd'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styles from './editor.module.less'

export type ListsProps = Array<{ title: string; contents: Array<{ id: string; content: string; }>; }>;

interface IProps {
  lists: ListsProps;
}

interface IState {
}

export default class EditorContent extends PureComponent<IProps, IState> {
  render() {
    const { lists } = this.props
    return (
      <div className={styles['editor-content']}>
        <Button type={'primary'} style={{ alignSelf: 'start' }}>添加泳道</Button>
        <div className={styles.lists}>
          {
            lists.map(l => (
              <div
                key={l.title}
                className={styles.list}
              >
                <p className={styles.title}>{l.title}</p>
                <Droppable droppableId={l.title}>
                  {
                    (provided, snapshot) => (
                      <div ref={provided.innerRef}>
                        {
                          l.contents.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={`${l.title}-${item.id}`}
                              index={index}
                            >
                              {
                                (provided, snapshot) => (
                                  <div
                                    className={styles.nodes}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {item.content}
                                  </div>
                                )
                              }
                            </Draggable>
                          ))
                        }
                        {provided.placeholder}
                      </div>
                    )
                  }
                </Droppable>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
