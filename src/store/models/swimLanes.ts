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
          content: 'testA'
        },
        {
          id: '2',
          content: 'testB'
        },
      ]
    }
  ] as swimLanesType[],
  reducers: {},
  effects: {},
}

export default model
