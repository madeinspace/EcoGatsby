import * as React from "react"
import { ChartFactory } from "./ChartFactory"
import { ChartFooter } from "./ChartFooter"
import { RenderContext } from "../../../lib/word-renderer/word-render"

const EntityChart: React.SFC<EntityChartProps> = props => {
  const {
    data,
    data: { chartTemplate, dataSource, cssClass },
  } = props
  const Chart = ChartFactory.getChart(chartTemplate, data)

  return (
    <RenderContext.Consumer>
      {renderContext =>
        renderContext === "word" ? (
          Chart
        ) : (
          <div className={"entity-chart " + cssClass || "standard"}>
            {Chart}
            <ChartFooter dataSource={dataSource} />
          </div>
        )
      }
    </RenderContext.Consumer>
  )
}

export default EntityChart
