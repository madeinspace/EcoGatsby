import Highcharts from "highcharts/js/highcharts"

let timerId = {}

const generatePointsUniqueKey = points => {
  const generatePointKey = point => {
    return (
      point.category + " " + point.series.name + ": " + point.x + " " + point.y
    )
  }

  const result = points.map(generatePointKey).join(", ")

  return result
}

Highcharts.wrap(Highcharts.Tooltip.prototype, "refresh", function(proceed) {
  let seriesName
  if (Array.isArray(arguments[1])) {
    // Can be array in case that, it's shared tooltip
    seriesName = generatePointsUniqueKey(arguments[1])
  } else {
    seriesName = arguments[1].series.name
  }

  const delayForDisplay = this.chart.options.tooltip.delayForDisplay
    ? this.chart.options.tooltip.delayForDisplay
    : 1000

  if (timerId[seriesName]) {
    clearTimeout(timerId[seriesName])
    delete timerId[seriesName]
  }

  timerId[seriesName] = window.setTimeout(
    function() {
      let pointOrPoints = this.refreshArguments[0]

      if (
        pointOrPoints === this.chart.hoverPoint ||
        $.inArray(this.chart.hoverPoint, pointOrPoints) > -1
      ) {
        proceed.apply(this.tooltip, this.refreshArguments)
      }
    }.bind({
      refreshArguments: Array.prototype.slice.call(arguments, 1),
      chart: this.chart,
      tooltip: this,
    }),
    delayForDisplay
  )
})
Highcharts.Chart.prototype.getDataRows = function(multiLevelHeaders) {
  var time = this.time,
    pick = Highcharts.pick,
    defined = Highcharts.defined,
    fireEvent = Highcharts.fireEvent,
    csvOptions = (this.options.exporting && this.options.exporting.csv) || {},
    xAxis,
    xAxes = this.xAxis,
    rows = {},
    rowArr = [],
    dataRows,
    topLevelColumnTitles = [],
    columnTitles = [],
    columnTitleObj,
    i,
    x,
    xTitle,
    // Options
    columnHeaderFormatter = function(item, key?, keyLength?) {
      if (csvOptions.columnHeaderFormatter) {
        var s = csvOptions.columnHeaderFormatter(item, key, keyLength)

        if (s !== false) {
          return s
        }
      }

      if (!item) {
        return "Category"
      }

      if (item instanceof Highcharts.Axis) {
        return (
          (item.options.title && item.options.title.text) ||
          (item.isDatetimeAxis ? "DateTime" : "Category")
        )
      }

      if (multiLevelHeaders) {
        return {
          columnTitle: keyLength > 1 ? key : item.name,
          topLevelColumnTitle: item.name,
        }
      }

      return item.name + (keyLength > 1 ? " (" + key + ")" : "")
    },
    xAxisIndices = []

  // Loop the series and index values
  i = 0

  this.setUpKeyToAxis()

  this.series.forEach(function(series) {
    var keys = series.options.keys,
      pointArrayMap = keys || series.pointArrayMap || ["y"],
      valueCount = pointArrayMap.length,
      xTaken = !series.requireSorting && {},
      categoryMap = {},
      datetimeValueAxisMap = {},
      xAxisIndex = xAxes.indexOf(series.xAxis),
      mockSeries,
      j

    // Map the categories for value axes
    pointArrayMap.forEach(function(prop) {
      var axisName =
        ((series.keyToAxis && series.keyToAxis[prop]) || prop) + "Axis"

      categoryMap[prop] =
        (series[axisName] && series[axisName].categories) || []
      datetimeValueAxisMap[prop] =
        series[axisName] && series[axisName].isDatetimeAxis
    })

    if (
      series.options.includeInDataExport !== false &&
      !series.options.isInternal &&
      series.visible !== false // #55
    ) {
      // Build a lookup for X axis index and the position of the first
      // series that belongs to that X axis. Includes -1 for non-axis
      // series types like pies.
      if (
        !Highcharts.find(xAxisIndices, function(index) {
          return index[0] === xAxisIndex
        })
      ) {
        xAxisIndices.push([xAxisIndex, i])
      }

      // Compute the column headers and top level headers, usually the
      // same as series names
      j = 0
      while (j < valueCount) {
        columnTitleObj = columnHeaderFormatter(
          series,
          pointArrayMap[j],
          pointArrayMap.length
        )
        columnTitles.push(columnTitleObj.columnTitle || columnTitleObj)
        if (multiLevelHeaders) {
          topLevelColumnTitles.push(
            columnTitleObj.topLevelColumnTitle || columnTitleObj
          )
        }
        j++
      }

      mockSeries = {
        chart: series.chart,
        autoIncrement: series.autoIncrement,
        options: series.options,
        pointArrayMap: series.pointArrayMap,
      }

      // Export directly from options.data because we need the uncropped
      // data (#7913), and we need to support Boost (#7026).
      series.options.data.forEach(function eachData(options, pIdx) {
        var key, prop, val, name, point

        point = {
          series: mockSeries,
        }
        series.pointClass.prototype.applyOptions.apply(point, [options])
        key = point.x
        name = series.data[pIdx] && series.data[pIdx].name

        if (xTaken) {
          if (xTaken[key]) {
            key += "|" + pIdx
          }
          xTaken[key] = true
        }

        j = 0

        // Pies, funnels, geo maps etc. use point name in X row
        if (!series.xAxis || series.exportKey === "name") {
          key = name
        }

        if (!rows[key]) {
          // Generate the row
          rows[key] = []
          // Contain the X values from one or more X axes
          rows[key].xValues = []
        }
        rows[key].x = point.x
        rows[key].name = name
        rows[key].xValues[xAxisIndex] = point.x

        while (j < valueCount) {
          prop = pointArrayMap[j] // y, z etc
          val = Math.abs(point[prop]).toFixed(2) // added for absolute values
          rows[key][i + j] = pick(
            categoryMap[prop][val], // Y axis category if present
            datetimeValueAxisMap[prop]
              ? time.dateFormat(csvOptions.dateFormat, val)
              : null,
            val
          )
          j++
        }
      })
      i = i + j
    }
  })

  // Make a sortable array
  for (x in rows) {
    if (rows.hasOwnProperty(x)) {
      rowArr.push(rows[x])
    }
  }

  var xAxisIndex, column

  // Add computed column headers and top level headers to final row set
  dataRows = multiLevelHeaders
    ? [topLevelColumnTitles, columnTitles]
    : [columnTitles]

  i = xAxisIndices.length
  while (i--) {
    // Start from end to splice in
    xAxisIndex = xAxisIndices[i][0]
    column = xAxisIndices[i][1]
    xAxis = xAxes[xAxisIndex]

    // Sort it by X values
    rowArr.sort(function(a, b) {
      // eslint-disable-line no-loop-func
      return a.xValues[xAxisIndex] - b.xValues[xAxisIndex]
    })

    // Add header row
    xTitle = columnHeaderFormatter(xAxis)
    dataRows[0].splice(column, 0, xTitle)
    if (multiLevelHeaders && dataRows[1]) {
      // If using multi level headers, we just added top level header.
      // Also add for sub level
      dataRows[1].splice(column, 0, xTitle)
    }

    // Add the category column
    rowArr.forEach(function(row) {
      // eslint-disable-line no-loop-func
      var category = row.name

      if (xAxis && !defined(category)) {
        if (xAxis.isDatetimeAxis) {
          if (row.x instanceof Date) {
            row.x = row.x.getTime()
          }
          category = time.dateFormat(csvOptions.dateFormat, row.x)
        } else if (xAxis.categories) {
          category = pick(xAxis.names[row.x], xAxis.categories[row.x], row.x)
        } else {
          category = row.x
        }
      }

      // Add the X/date/category
      row.splice(column, 0, category)
    })
  }
  dataRows = dataRows.concat(rowArr)

  fireEvent(this, "exportData", {
    dataRows: dataRows,
  })

  return dataRows
}
