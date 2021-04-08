import { PureComponent, useCallback } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { CloseOutlined } from '@ant-design/icons'
import styles from './editor.module.less'

type listType = { title: string; contents: Array<{ id: string; content: string; }> }
export type ListsProps = Array<listType>;

interface IProps {
  lists: ListsProps;
  addList: (list: listType) => { [key: string]: any };
  removeList: (title: string) => void;
}

interface IState {
  visible: boolean;
  removeModalVisible: boolean;
  title: string;
}

export default class EditorContent extends PureComponent<IProps, IState> {
  state = {
    visible: false,
    removeModalVisible: false,
    title: '',
  }
  
  toggleModal = () => {
    this.setState(preState => ({
      visible: !preState.visible,
    }))
  }
  
  toggleRemoveModal = (title?: string) => {
    this.setState(preState => ({
      removeModalVisible: !preState.removeModalVisible,
      title: title || preState.title,
    }))
  }
  
  render() {
    const { lists, addList, removeList } = this.props
    const { visible, removeModalVisible, title } = this.state
    return (
      <>
        <div className={styles['editor-content']}>
          <Button
            type={'primary'}
            style={{ alignSelf: 'start' }}
            onClick={this.toggleModal}
          >添加泳道</Button>
          <div className={styles.lists}>
            {
              lists.map(l => (
                <div key={l.title} className={styles.list}>
                  <p className={styles.title}>
                    {l.title}
                    <CloseOutlined
                      style={{ float: 'right', cursor: 'pointer', transform: 'translateY(1px)' }}
                      onClick={() => this.toggleRemoveModal(l.title)}
                    />
                  </p>
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
        <FormModal
          visible={visible}
          toggleModal={this.toggleModal}
          addList={addList}
        />
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
  visible: boolean;
  title: string;
  removeList: (title: string) => void;
  toggleModal: () => void;
}

function RemoveModal({ visible, title, removeList, toggleModal }: removeModalProps) {
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

interface FormModalProps {
  visible: boolean;
  toggleModal: () => void;
  addList: (list: listType) => { [key: string]: any };
}

function FormModal({ visible, toggleModal, addList }: FormModalProps) {
  const [form] = Form.useForm()
  
  const handleAddList = useCallback(() => {
    const { title } = form.getFieldsValue()
    addList({ title, contents: [] })
    toggleModal()
    form.resetFields()
  }, [form, addList, toggleModal])
  
  return (
    <Modal
      visible={visible}
      title={'添加泳道'}
      onOk={handleAddList}
      onCancel={toggleModal}
      okText={'添加'}
      cancelText={'取消'}
    >
      <Form
        form={form}
        onFinish={handleAddList}
      >
        <Form.Item
          name={'title'}
          label={'泳道名'}
          rules={[{ required: true, message: '必须填写泳道名' }]}
        >
          <Input placeholder={'泳道名'}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}
