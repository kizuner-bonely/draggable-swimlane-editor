/* eslint-disable */
import { PureComponent } from 'react'
import './mxgraphDemo.less'
import 'jsplumb'

export default class MxgraphDemo extends PureComponent {
  state = {
    name: 'React',
  }

  componentDidMount() {
    const common = {
      isSource: true,
      isTarget: true,
      connector: ['Flowchart'],
      maxConnections: -1,
      endpoint: 'Dot',
      paintStyle: {
        fill: 'transparent',
        outlineStroke: 'blue',
        strokeWidth: 1,
      },
      hoverPaintStyle: {
        outlineStroke: 'lightblue',
        strokeWidth: 1,
      },
      connectorStyle: {
        outlineStroke: 'green',
        strokeWidth: 1,
      },
      connectorHoverStyle: {
        strokeWidth: 2,
      },
    }

    jsPlumb.ready(function () {
      jsPlumb.addEndpoint('item_left', { anchors: ['Right'] }, common)
      jsPlumb.addEndpoint('item_left', { anchors: ['Top'] }, common)
      jsPlumb.addEndpoint('item_right', { anchors: ['Left'] }, common)
      // jsPlumb.connect({
      //   source: 'item_left',
      //   target: 'item_right',
      //   endpoint: 'Blank',
      //   connector: ['Flowchart'],
      //   overlays: [['Arrow', { width: 12, length: 12, location: 1 }]],
      // })

      jsPlumb.draggable('item_left', { containment: 'diagramContainer' })
      jsPlumb.draggable('item_right', { containment: 'diagramContainer' })

      jsPlumb.bind('click', function (conn, originalEvent) {
        if (window.prompt('输入1删除连接') === '1') jsPlumb.detach(conn)
      })
    })
  }

  render() {
    return (
      <div id="diagramContainer">
        <div id="item_left" className="item" />
        <div id="item_right" className="item" style={{ left: '300px' }} />
      </div>
    )
  }
}
