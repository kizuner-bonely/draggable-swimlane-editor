const common = {
  isSource: true,
  isTarget: true,
  connector: ['Flowchart'],
  maxConnections: -1,
  endpoint: 'Dot',
  paintStyle: { fill: 'transparent', outlineStroke: '#fff', strokeWidth: 0 },
  hoverPaintStyle: { outlineStroke: 'lightblue', strokeWidth: 1 },
  connectorStyle: { outlineStroke: 'green', strokeWidth: 1 },
  connectorHoverStyle: { strokeWidth: 2 },
  connectorOverlays: [['Arrow', { width: 10, length: 10, location: 1 }]],
}

export default common
