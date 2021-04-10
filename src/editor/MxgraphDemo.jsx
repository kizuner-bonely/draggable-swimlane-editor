/* eslint-disable */
import { PureComponent } from 'react';
import './mxgraphDemo.less';
import 'jsplumb';

export default class MxgraphDemo extends PureComponent {
  state = {
    name: 'React'
  }
  
  componentDidMount() {
    jsPlumb.ready(function () {
      // const els = document.querySelectorAll(".wrapper");
      
      const common = {
        isSource: true,
        isTarget: true,
        connector: "Straight",
        endpoint: "Rectangle",
        paintStyle: { fill: "white", outlineStroke: "blue", strokeWidth: 3 },
        hoverPaintStyle: { outlineStroke: "lightblue" },
        connectorStyle: { outlineStroke: "green", strokeWidth: 1 },
        connectorHoverStyle: { strokeWidth: 2 },
      };
      jsPlumb.draggable("item_left");
      jsPlumb.addEndpoint("item_left", {
        anchors: ["Right"]
      }, common);
      jsPlumb.addEndpoint("item_right", {
        anchors: ["Right"]
      }, common);
      // jsPlumb.draggable(els);
    });
  }
  
  render() {
    return (
      <div id="diagramContainer">
        <div id="item_left" className="item"/>
        <div id="item_right" className="item" style={{ marginLeft: "50px" }}/>
      </div>
    );
  }
}
