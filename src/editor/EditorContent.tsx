import { PureComponent } from 'react'
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import styles from './editor.module.less'

type listType = {
  title: string
  contents: Array<{ id: string; uid: number; content: string }>
}
export type ListsProps = Array<listType>

interface IProps {
  lists: ListsProps
  removeList: (title: string) => void
}

interface IState {
  removeModalVisible: boolean
  title: string
}

export default class EditorContent extends PureComponent<IProps, IState> {
  state = {
    removeModalVisible: false,
    title: '',
  }

  toggleRemoveModal = (title?: string) => {
    this.setState((preState) => ({
      removeModalVisible: !preState.removeModalVisible,
      title: title || preState.title,
    }))
  }

  render() {
    const { removeModalVisible, title } = this.state
    const { lists, removeList } = this.props

    return (
      <>
        <div className={styles['editor-content']}>
          <div className={styles.lists}>
            {lists.map((l) => (
              <div key={l.title} className={styles.list}>
                <p className={styles.title}>
                  {l.title}
                  <CloseOutlined
                    style={{
                      float: 'right',
                      cursor: 'pointer',
                      transform: 'translateY(1px)',
                    }}
                    onClick={() => this.toggleRemoveModal(l.title)}
                  />
                </p>
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
        <RemoveModal
          visible={removeModalVisible}
          title={title}
          removeList={removeList}
          toggleModal={this.toggleRemoveModal}
        />
      </>
    )
  }
}

interface removeModalProps {
  visible: boolean
  title: string
  removeList: (title: string) => void
  toggleModal: () => void
}

function RemoveModal({
  visible,
  title,
  removeList,
  toggleModal,
}: removeModalProps) {
  return (
    <Modal
      visible={visible}
      okText={'确认'}
      cancelText={'取消'}
      onOk={() => {
        removeList(title)
        toggleModal()
      }}
      onCancel={toggleModal}
    >
      确认删除泳道"{title}"吗
    </Modal>
  )
}
