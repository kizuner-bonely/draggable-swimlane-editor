/* eslint-disable */
import { PureComponent } from 'react'
import './mxgraphDemo.less'
import 'jsplumb'
import common from './config'

export default class MxgraphDemo extends PureComponent {
  state = {
    name: 'React',
  }

  componentDidMount() {
    jsPlumb.ready(function () {
      jsPlumb.addEndpoint('item_left', { anchors: ['Right'] }, common)
      jsPlumb.addEndpoint('item_left', { anchors: ['Top'] }, common)
      jsPlumb.addEndpoint('item_right', { anchors: ['Left'] }, common)

      jsPlumb.draggable('item_left', { containment: 'diagramContainer' })
      jsPlumb.draggable('item_right', { containment: 'diagramContainer' })

      jsPlumb.bind('click', function (conn, originalEvent) {
        if (window.prompt('输入1删除连接') === '1')
          jsPlumb.deleteConnection(conn)
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
