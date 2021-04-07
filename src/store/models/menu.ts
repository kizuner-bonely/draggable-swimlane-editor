interface MenusType {
  id: string;
  content: string;
}

const model = {
  state: [
    {
      id: '1',
      content: 'menuItem A'
    },
    {
      id: '2',
      content: 'menuItem B'
    },
  ] as Array<MenusType>,
  reducers: {},
  effects: {},
}

export default model
