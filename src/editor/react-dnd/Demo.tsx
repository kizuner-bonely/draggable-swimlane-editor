import { CSSProperties, PureComponent } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

//* fake data generator
const getItems = (count: number, offset = 0) => {
  return Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }))
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const res = Array.from(list)
  const [removed] = res.splice(startIndex, 1)
  res.splice(endIndex, 0, removed)
  return res
}

const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)
  destClone.splice(droppableDestination.index, 0, removed)
  const result: { [key: string]: any } = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone
  return result
}

const grid = 8

const getItemStyle = (isDragging: boolean, draggableStyle: CSSProperties) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
})

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
})

export default class Demo extends PureComponent {
  state = {
    items: getItems(10),
    selected: getItems(5, 10),
  }
  
  id2List = {
    droppable: 'items',
    droppable2: 'selected',
  }
  
  getList = (id: 'droppable' | 'droppable2') => this.state[this.id2List[id] as 'items' | 'selected']
  
  onDragEnd = (result: any) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId) as any,
        source.index,
        destination.index,
      )
      let state: { [key: string]: any } = { items }
      if (source.droppableId === 'droppable2') {
        state = { selected: items }
      }
      this.setState(() => (state))
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination,
      ) as any
      this.setState(() => ({
        items: result.droppable,
        selected: result.droppable2
      }))
    }
  }
  
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={'droppable'}>
          {
            ((provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {
                  this.state.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {
                        (provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style as CSSProperties
                            ) as CSSProperties}
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
            ))
          }
        </Droppable>
        <Droppable droppableId={'droppable2'}>
          {
            (provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {
                  this.state.selected.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {
                        (provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style as CSSProperties
                            ) as CSSProperties}
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
      </DragDropContext>
    )
  }
}
