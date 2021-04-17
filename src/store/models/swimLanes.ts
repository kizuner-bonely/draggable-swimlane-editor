type directions = 'Top' | 'Bottom' | 'Left' | 'Right'

export interface ConnectionPointType {
  target: string
  sourcePoint: directions
  targetPoint: directions
}

export interface SwimLaneContent {
  id: string
  uid: number
  content: string
  connects: Array<ConnectionPointType>
}

interface SwimLaneType {
  title: string
  contents: SwimLaneContent[]
}

interface newNode {
  uid: string
  target: string
  sourcePoint: directions
  targetPoint: directions
}

const model = {
  state: [
    {
      title: 'test',
      contents: [
        {
          id: '1',
          uid: 1618386001344,
          content: 'aaa',
          connects: [
            {
              target: '1618386001345',
              sourcePoint: 'Right',
              targetPoint: 'Right',
            },
          ],
        },
        {
          id: '2',
          uid: 1618386001345,
          content: 'bbb',
          connects: [],
        },
      ],
    },
    {
      title: 'another test',
      contents: [
        {
          id: '1',
          uid: 1618386001346,
          content: 'testA',
          connects: [],
        },
        {
          id: '2',
          uid: 1618386001347,
          content: 'testB',
          connects: [],
        },
      ],
    },
  ] as SwimLaneType[],
  reducers: {
    add(state: SwimLaneType[], list: SwimLaneType) {
      return [...state, list]
    },
    remove(state: SwimLaneType[], title: string) {
      return [...state].filter((v) => v.title !== title)
    },
    update(state: SwimLaneType[], newList: SwimLaneType) {
      return [...state].map((v) => {
        if (v.title === newList.title) return newList
        return v
      })
    },
    removeNode(state: SwimLaneType[], node: SwimLaneContent): SwimLaneType[] {
      const stateClone = [...state]
      return stateClone.map((s) => {
        s.contents = s.contents.filter((c) => {
          c.connects = c.connects.filter((c) => c.target !== `${node.uid}`)
          return c.uid !== node.uid
        })
        return s
      })
    },
    addConnection(state: SwimLaneType[], node: newNode) {
      const stateClone = JSON.parse(JSON.stringify(state))
      let target
      stateClone.some((l: SwimLaneType) => {
        // 找出连接的源节点
        target = l.contents.find((i) => `${i.uid}` === node.uid)
        // 查重
        if (target) {
          const arr = [...target.connects]
          const flag = arr.some(
            (c) =>
              c.target === node.target &&
              c.sourcePoint === node.sourcePoint &&
              c.targetPoint === node.targetPoint,
          )
          if (!flag) {
            target.connects.push({
              target: node.target,
              sourcePoint: node.sourcePoint,
              targetPoint: node.targetPoint,
            })
          }
          return true
        }
        return false
      })
      return stateClone
    },
  },
  effects: {},
}

export default model
