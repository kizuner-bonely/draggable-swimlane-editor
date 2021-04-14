interface MenusType {
  id: string
  uid: number
  content: string
}

const model = {
  state: [
    {
      id: '1',
      uid: 1618385128014,
      content: 'menuItem A',
    },
    {
      id: '2',
      uid: 1618385128015,
      content: 'menuItem B',
    },
  ] as Array<MenusType>,
  reducers: {},
  effects: {},
}

export default model
