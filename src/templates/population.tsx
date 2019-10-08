import React from "react"
import _ from "lodash"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"
import SEO from "../components/seo"
import EntityTable from "../components/table/EntityTable"
import EntityChart from "../components/chart/EntityChart"
import numeral from "numeral"
import {
  Document,
  Heading1,
  Heading3,
  Paragraph,
  DocxRenderer,
} from "../../lib/word-renderer/word-render"
import { saveAs } from "file-saver"

import {
  Share,
  Actions,
  EntityContainer,
  ExportPage,
} from "../components/Actions"
import {
  PageIntro,
  TitleContainer,
  MainTitle,
  Headline,
  ItemWrapper,
  CrossLink,
  SubTitle,
  ForecastProductIcon,
} from "../styles/MainContentStyles"

const FormattedNumber = ({ number }) => <>{formatNumber(number)}</>

const handleExport = (format, data) => {
  const filename = `Annual change in Estimated Resident Population (ERP).docx`

  DocxRenderer.render(<PageContents data={data} />).then(FileContents => {
    saveAs(FileContents, filename)
  })
}

const PageContents = ({ data }) => {
  const {
    allPopulation: {
      nodes: [{ ClientNumber: latestPopulation, ClientYear: latestYear }],
    },
    client: { LongName: prettyName },
  } = data

  return (
    <Document>
      <Heading1 style="Title">{prettyName}</Heading1>
      <Heading3 style="SubTitle">Population</Heading3>
      <Paragraph style="Quote">
        The Estimated Resident Population of the {prettyName} was{" "}
        <FormattedNumber number={latestPopulation} /> as of the 30th June{" "}
        {latestYear}.
      </Paragraph>
      <Paragraph>
        The Estimated Resident Population (ERP) is the official population of
        the area. It is updated annually by the Australian Bureau of Statistics,
        and reassessed every Census. The chart and table show last 10 years ERP
        for {prettyName}, the state and Australia, with percentage comparisons.
        A growing population can indicate a growing economy, but this is not
        necessarily the case and depends on the residential role and function of
        the area.
      </Paragraph>
      <EntityChart data={chartLineBuilder(data)} />
      <Source />
      <EntityChart data={chartBuilder(data)} />
      <Source />
    </Document>
  )
}

export default ({ data }) => {
  const {
    allPopulation: {
      nodes: [{ ClientNumber: latestPopulation, ClientYear: latestYear }],
    },
    client: { LongName: prettyName },
    allClientProducts: { nodes: clientProducts },
  } = data

  const hasForecast = clientProducts =>
    _.some(clientProducts, product => product.ApplicationID === 3)

  return (
    <Layout data={data}>
      <SEO title={data.client.Name} />

      <EntityContainer>
        <TitleContainer>
          <MainTitle>{prettyName}</MainTitle>
          <SubTitle>Population</SubTitle>
        </TitleContainer>
        <Actions>
          <Share />
          <ExportPage
            onExport={e => handleExport(e, data)}
            exportOptions={{
              formats: [{ displayText: "Word" } /*, { name: "PDF" }*/],
            }}
          />
        </Actions>
      </EntityContainer>
      <Headline>
        The Estimated Resident Population of the {prettyName} was{" "}
        <FormattedNumber number={latestPopulation} /> as of the 30th June{" "}
        {latestYear}.
      </Headline>
      <PageIntro>
        <p>
          The Estimated Resident Population (ERP) is the official population of
          the area. It is updated annually by the Australian Bureau of
          Statistics, and reassessed every Census. The chart and table show last
          10 years ERP for {prettyName}, the state and Australia, with
          percentage comparisons. A growing population can indicate a growing
          economy, but this is not necessarily the case and depends on the
          residential role and function of the area.
        </p>
      </PageIntro>
      <ItemWrapper>
        <EntityChart data={chartLineBuilder(data)} />
      </ItemWrapper>
      <ItemWrapper>
        <EntityChart data={chartBuilder(data)} />
      </ItemWrapper>
      <ItemWrapper>
        <EntityTable
          data={tableBuilder(data)}
          name={"Annual change in Estimated Resident Population (ERP)"}
        />
      </ItemWrapper>
      {hasForecast(clientProducts) && (
        <CrossLink>
          <ForecastProductIcon />
          <a
            href={`http://forecast.id.com.au/${
              data.client.Alias
            }/population-summary?WebId=10`}
            target="_blank"
            title="link to forecast"
          >
            Population forecasts
            <span className="hidden"> (opens a new window)</span>
          </a>
        </CrossLink>
      )}
    </Layout>
  )
}

// #region sql query
export const query = graphql`
  query($ClientID: Int!, $ClientImageRegex: String!) {
    client(ClientID: { eq: $ClientID }) {
      Alias
      Name
      LongName
      ClientID
    }
    allPopulation(
      filter: { ClientID: { eq: $ClientID } }
      sort: { order: DESC, fields: ClientYear }
    ) {
      nodes {
        ClientGeoName
        ClientYear
        ClientNumber
        ClientChangeYear1Year2
        ClientChangeper
        BenchmarkGeoName
        BenchmarkNumber
        BenchmarkChangeYear1Year2
        BenchmarkChangeper
        AusGeoName
        AusNumber
        AusChangeYear1Year2
        AusChangeper
      }
    }
    allClientProducts(filter: { ClientID: { eq: $ClientID } }) {
      nodes {
        ApplicationID
        ClientID
        ProductName
        ClientLongName
        ClientShortName
        SubDomainName
      }
    }
    allMainNavigation(
      filter: { ClientID: { eq: $ClientID } }
      sort: { fields: ParentPageID }
    ) {
      nodes {
        ParentPageID
        PageID
        Alias
        MenuTitle
        Disabled
        GroupName
      }
    }
    allSitemapGroups(sort: { fields: ColNumber }) {
      nodes {
        ColNumber
        GroupName
        Pages
        SitemapName
      }
    }

    clientLogo: file(
      base: { regex: $ClientImageRegex }
      relativeDirectory: { eq: "logos" }
      sourceInstanceName: { eq: "images" }
    ) {
      relativePath
      imageData: childImageSharp {
        fixed(width: 200, quality: 100) {
          src
          srcSet
          width
          height
          aspectRatio
        }
      }
    }
  }
`
// #endregion

const Source = () => (
  <Paragraph>
    Source: Australian Bureau of Statistics, Regional Population Growth,
    Australia (3218.0). Compiled and presented in economy.id by{" "}
    <a
      href="http://home.id.com.au/about-us/"
      target="_blank"
      title=".id website"
    >
      .id, the population experts.
      <span className="hidden"> (opens a new window)</span>
    </a>
  </Paragraph>
)

const tableBuilder = data => {
  return {
    cssClass: "",
    allowExport: false,
    allowSort: true,
    allowSortReset: true,
    groupOn: "",
    clientAlias: data.client.Alias,
    source: <Source />,
    anchorName: "service-age-groups",
    headRows: [
      {
        cssClass: "",
        cols: [
          {
            cssClass: "table-area-name",
            displayText: "Annual change in Estimated Resident Population (ERP)",
            colSpan: 10,
            rowSpan: 0,
          },
        ],
        key: "hr0",
      },
      {
        cssClass: "",
        cols: [
          {
            cssClass: "",
            displayText: "",
            colSpan: 1,
            rowSpan: 0,
          },
          {
            cssClass: "xeven start-year",
            displayText: data.allPopulation.nodes[0].ClientGeoName,
            colSpan: 3,
            rowSpan: 0,
          },
          {
            cssClass: "xodd end-year",
            displayText: data.allPopulation.nodes[0].BenchmarkGeoName,
            colSpan: 3,
            rowSpan: 0,
          },
          {
            cssClass: "xeven start-year",
            displayText: data.allPopulation.nodes[0].AusGeoName,
            colSpan: 3,
            rowSpan: 0,
          },
        ],
        key: "hr1",
      },
    ],
    cols: [
      {
        id: 0,
        displayText: "Year (ending June 30)",
        dataType: "int",
        sortable: true,
        cssClass: "xodd xfirst",
      },
      {
        id: 1,
        displayText: "Number",
        dataType: "int",
        sortable: true,
        cssClass: "xeven latest",
        format: "{0:#,0}",
      },
      {
        id: 2,
        displayText: "Change in number",
        dataType: "money",
        sortable: true,
        cssClass: "xeven latest",
        format: "{0:+#,0;-#,0;0}",
      },
      {
        id: 3,
        displayText: "Change in percent",
        dataType: "money",
        sortable: true,
        cssClass: "xeven latest",
        format: "{0:+#,0;-#,0;0}",
      },
      {
        id: 4,
        displayText: "Number",
        title: "",
        dataType: "int",
        sortable: true,
        cssClass: "xodd",
        format: "{0:#,0}",
      },
      {
        id: 5,
        displayText: "Change in number",
        dataType: "money",
        sortable: true,
        cssClass: "per xodd",
        format: "{0:+#,0;-#,0;0}",
      },
      {
        id: 6,
        displayText: "Change in percent",
        dataType: "money",
        sortable: true,
        cssClass: "xodd",
        format: "{0:+#,0;-#,0;0}",
      },
      {
        id: 7,
        displayText: "Number",
        title: "",
        dataType: "int",
        sortable: true,
        cssClass: "xeven",
        format: "{0:#,0}",
      },
      {
        id: 8,
        displayText: "Change in number",
        dataType: "money",
        sortable: true,
        cssClass: "per xeven",
        format: "{0:+#,0;-#,0;0}",
      },
      {
        id: 9,
        displayText: "Change in percent",
        dataType: "money",
        sortable: true,
        cssClass: "xeven",
        format: "{0:+#,0;-#,0;0}",
      },
    ],
    footRows: [],
    rows: data.allPopulation.nodes.map(
      (
        {
          ClientYear,
          ClientNumber,
          ClientChangeYear1Year2,
          ClientChangeper,
          BenchmarkNumber,
          BenchmarkChangeYear1Year2,
          BenchmarkChangeper,
          AusNumber,
          AusChangeYear1Year2,
          AusChangeper,
        },
        i: number
      ) => ({
        data: [
          ClientYear,
          ClientNumber,
          ClientChangeYear1Year2,
          ClientChangeper,
          BenchmarkNumber,
          BenchmarkChangeYear1Year2,
          BenchmarkChangeper,
          AusNumber,
          AusChangeYear1Year2,
          AusChangeper,
        ],
        formattedData: [
          ClientYear,
          formatNumber(ClientNumber),
          formatChangeNumber(ClientChangeYear1Year2, "--"),
          formatChangePercent(ClientChangeper, "--"),
          formatNumber(BenchmarkNumber),
          formatChangeNumber(BenchmarkChangeYear1Year2, "--"),
          formatChangePercent(BenchmarkChangeper, "--"),
          formatNumber(AusNumber),
          formatChangeNumber(AusChangeYear1Year2, "--"),
          formatChangePercent(AusChangeper, "--"),
        ],
        id: i,
      })
    ),
    noOfRowsOnInit: 11,
  }
}

const formatNumber = number => numeral(number).format("0,0")
const formatChangeNumber = (number, zero = "0") =>
  number ? numeral(number).format("+0,0") : zero
const formatChangePercent = (number, zero = "0") =>
  number ? numeral(number).format("+0,0.00") : zero
const formatShortDecimal = (number, zero = "0") =>
  number ? numeral(number).format("0.0") : zero

const chartLineBuilder = ({ allPopulation: { nodes } }) => {
  return {
    cssClass: "",
    highchartOptions: {
      chart: {
        type: "line",
      },
      title: {
        text: "Estimated Resident Population (ERP)",
        align: "left",
      },
      tooltip: {
        pointFormatter: function() {
          return `<span class="highcharts-color-${
            this.colorIndex
          }">\u25CF</span> ${this.series.name}: ${formatShortDecimal(this.y)}%`
        },
      },
      series: [
        {
          color: "",
          yAxis: 0,
          name: nodes[0].ClientGeoName,
          data: _.map(nodes, "ClientChangeper").reverse(),
        },
        {
          color: "",
          yAxis: 0,
          name: nodes[0].BenchmarkGeoName,
          data: _.map(nodes, "BenchmarkChangeper").reverse(),
        },
        {
          color: "",
          yAxis: 0,
          name: nodes[0].AusGeoName,
          data: _.map(nodes, "AusChangeper").reverse(),
        },
      ],
      xAxis: {
        categories: _.map(nodes, "ClientYear").reverse(),
        croshair: false,
        title: {
          text: "Year ending June",
          align: "low",
        },

        labels: {
          staggerLines: 0,
          format: "",
        },
        opposite: false,
        plotBands: [],
      },
      yAxis: [
        {
          croshair: false,
          title: {
            text: "Percentage change",
          },
          labels: {
            staggerLines: 0,
            formatter: function() {
              return formatChangeNumber(this.value)
            },
          },
          opposite: false,
          plotBands: [],
        },
      ],
    },
    rawDataSource:
      "Source: Australian Bureau of Statistics, Regional Population Growth, Australia (3218.0). Compiled and presented in economy.id by .id, the population experts.",
    dataSource: <Source />,
    chartContainerID: "chart2",
    logoUrl: "http://profile.local.com.au:8666/dist/images/id-logo.png",
    entityID: 1,
    chartTemplate: "Standard",
  }
}

const chartBuilder = ({ allPopulation: { nodes } }) => {
  return {
    cssClass: "",
    highchartOptions: {
      chart: {
        type: "column",
        styledMode: true,
      },
      title: {
        text: "Estimated Resident Population (ERP)",
        align: "left",
      },
      subtitle: {
        text: nodes[0].ClientGeoName,
        align: "left",
      },
      series: [
        {
          color: "",
          yAxis: 0,
          name: nodes[0].ClientGeoName,
          data: _.map(nodes, "ClientNumber").reverse(),
        },
      ],
      xAxis: {
        categories: _.map(nodes, "ClientYear").reverse(),
        croshair: false,
        title: {
          text: "Year ending June",
          align: "low",
        },
        labels: {
          staggerLines: 0,
          format: "",
        },
        opposite: false,
        plotBands: [],
      },
      yAxis: [
        {
          croshair: false,
          title: {
            text: "Total Estimated Resident Population (ERP)",
            align: "low",
          },
          labels: {
            staggerLines: 0,
            formatter: function() {
              return formatNumber(this.value)
            },
          },
          opposite: false,
          plotBands: [],
        },
      ],
    },
    rawDataSource:
      "Source: Australian Bureau of Statistics, Regional Population Growth, Australia (3218.0). Compiled and presented in economy.id by .id, the population experts.",
    dataSource: <Source />,
    chartContainerID: "chart1",
    logoUrl: "/images/id-logo.png",
    entityID: 1,
    chartTemplate: "Standard",
  }
}
