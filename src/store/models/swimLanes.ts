interface swimLanesType {
  title: string;
  contents: Array<{ id: string; content: string; }>;
}

const model = {
  state: [
    {
      title: 'test',
      contents: [
        {
          id: '1',
          content: 'aaa',
        },
        {
          id: '2',
          content: 'bbb',
        },
      ],
    },
    {
      title: 'another test',
      contents: [
        {
          id: '1',
          content: 'testA',
        },
        {
          id: '2',
          content: 'testB',
        },
      ],
    },
  ] as swimLanesType[],
  reducers: {
    add(state: swimLanesType[], list: swimLanesType) {
      return [...state, list]
    },
    remove(state: swimLanesType[], title: string) {
      return [...state].filter(v => v.title !== title)
    },
    update(state: swimLanesType[], newList: swimLanesType) {
      return [...state].map(v => {
        if (v.title === newList.title) return newList
        return v
      })
    },
  },
  effects: {},
}

export default model
