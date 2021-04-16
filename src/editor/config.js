const common = {
  isSource: true,
  isTarget: true,
  connector: ['Flowchart'],
  maxConnections: 2,
  endpoint: 'Dot',
  paintStyle: { fill: 'transparent', outlineStroke: '#fff', strokeWidth: 0 },
  hoverPaintStyle: { outlineStroke: 'lightblue', strokeWidth: 1 },
  connectorStyle: { outlineStroke: 'green', strokeWidth: 2 },
  connectorHoverStyle: { strokeWidth: 2 },
  connectorOverlays: [['Arrow', { width: 15, length: 15, location: 1 }]],
}

export default common
