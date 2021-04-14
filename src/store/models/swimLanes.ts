export interface SwimLaneContent {
  id: string
  uid: number
  content: string
}

interface SwimLaneType {
  title: string
  contents: SwimLaneContent[]
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
        },
        {
          id: '2',
          uid: 1618386001345,
          content: 'bbb',
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
        },
        {
          id: '2',
          uid: 1618386001347,
          content: 'testB',
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
  },
  effects: {},
}

export default model
