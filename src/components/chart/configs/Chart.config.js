// default chart: vertical
import { getParameterByName } from "../../Utils"
import { idLogo } from "../../logos/idLogo"
import * as deepmerge from "deepmerge"

export const ChartDefault = (...opts) => {
  const options = Object.assign.apply(Object, [{}].concat(...opts))
  const chartDefaults = {}

  chartDefaults.chart = {
    height: getHeight(),
    /* SETTING HEIGHT TO 400 FOR REPORTING TO PDF. TO FIT 2 CHARTS INSIDE ONE PAGE IN PDF EXPORT */
    spacingRight: 50,
    spacingLeft: 30,
    marginLeft: null,
    zoomType: "x",
    className: "standard-chart",
  }

  chartDefaults.exporting = {
    enabled: false,
    sourceWidth: 850,
    fallbackToExportServer: true,
    chartOptions: {
      chart: {
        height: 500,
        spacingBottom: 60,
        events: {
          load() {
            // this.container.classList.add("export");
            // append svg logo to chart
            const group = this.renderer
              .g()
              .attr({
                transform: `translate(740, 450)`,
                class: "exportLogo",
              })
              .add()
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < idLogo.length; i++) {
              this.renderer
                .path()
                .attr({
                  d: idLogo[i],
                  fill: "gray",
                })
                .add(group)
            }
            this.renderer
              .text(options.source, 20, 470)
              .css({
                width: "600px",
                fontSize: "10px",
                color: "#6a6a6a",
              })
              .add()
          },
        },
      },
      title: {
        style: {
          color: "black",
        },
      },
    },
  }

  chartDefaults.xAxis = {
    tickmarkPlacement: "on",
    style: {
      textOverflow: "none",
    },
  }

  /* THIS CONDITION IS CATERING FOR DUAL YAXIS */
  if (options.yAxis.length === 1) {
    chartDefaults.yAxis = [
      {
        style: {
          textOverflow: "none",
        },
        alignTicks: true,
        allowDecimals: false,
        softMin: 0,
        title: {
          text: "",
          align: "low",
        },
        labels: options.yAxis[0].labels,
      },
    ]
  } else {
    chartDefaults.series[0].yAxis = 0
    chartDefaults.series[1].yAxis = 1
    chartDefaults.yAxis = [
      {
        style: {
          textOverflow: "none",
        },
        alignTicks: false,
        allowDecimals: false,
        title: {
          text: "",
          align: "low",
        },
        tickPositioner: function(min, max) {
          var maxDeviation = Math.ceil(
            Math.max(Math.abs(this.dataMax), Math.abs(this.dataMin))
          )
          if (this.dataMin < 0 && this.dataMax >= 0) {
            return this.getLinearTickPositions(
              this.tickInterval,
              -maxDeviation,
              maxDeviation
            )
          }
        },
        labels: options.yAxis[0].labels,
      },
      {
        style: {
          textOverflow: "none",
        },
        className: "yAxisSecondary",
        alignTicks: true,
        allowDecimals: false,
        title: {
          text: "",
          align: "low",
        },
        tickPositioner: function(min, max) {
          var maxDeviation = Math.ceil(
            Math.max(Math.abs(this.dataMax), Math.abs(this.dataMin))
          )
          var halfMaxDeviation = Math.ceil(maxDeviation / 2)
          if (this.dataMin < 0 && this.dataMax >= 0) {
            return [
              -maxDeviation,
              -halfMaxDeviation,
              0,
              halfMaxDeviation,
              maxDeviation,
            ]
          } else if (this.dataMax <= 0) {
            return [-maxDeviation, -halfMaxDeviation, 0]
          }
        },
        labels: options.yAxis[1].labels,
        opposite: true,
      },
    ]
  }

  chartDefaults.plotOptions = {
    series: {
      groupPadding: 0.2,
      pointPadding: 0,
      borderWidth: 0,
      stacking: undefined,
    },
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
    line: {
      marker: {
        enabled: false,
      },
    },
  }

  chartDefaults.tooltip = {
    shadow: false,
    delayForDisplay: 100,
    hideDelay: 10,
    headFormat: "<span> {point.y} - </span>",
  }

  chartDefaults.legend = {
    align: "left",
    enabled: options.series.length !== 1,
    /* only display legend when more than 1 series exists */
    symbolWidth: 25,
    symbolRadius: 0,
    squareSymbol: false,
    symbolHeight: 12,
    verticalAlign: "top",
    x: 5,
    y: -30,
    margin: 30,
  }

  chartDefaults.title = {
    x: 10,
    text: options.title.text,
    align: "left",
    margin: 40,
    widthAdjust: -100,
  }
  chartDefaults.subtitle = {
    x: 10,
  }

  function getHeight() {
    const yoffset = 50
    const height = options.height !== undefined ? options.height : 400
    return getParameterByName("pdf", null) === "1" ? height : height + yoffset
  }

  const deepmerged = deepmerge(chartDefaults, options)
  return deepmerged
}
