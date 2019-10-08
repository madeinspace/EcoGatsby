interface IData {
  chartTemplate: string
  dataSource: JSX.Element
  cssClass?: string
}
interface EntityChartProps {
  data: IData
}

interface IChartProps {
  config: any
  highchartOptions?: any
  exportOptions?: any
  chartContainerID?: any
  source?: any
  dataSource?: any
  sets?: any[]
  toggles?: any[]
  siblingsInfo?: any
}

interface IChartState {
  addendum: string
  selectedValue: any
  hasSiblings: boolean
  sets: any[]
  title: ""
}

interface ExportImageData {
  imageData: Blob
  width: number
  height: number
}
interface IExportDropdownProps {
  exportOptions: any
  handleExport: (item: IFormat) => void
}

interface IFormat {
  displayText: string
  res: string
  type: string
}

interface IPlayStopButttonProps {
  isPlaying: boolean
  stop: () => void
  play: () => void
}

interface IToggle {
  displayLabel: string
  group: string
  hasInfo: false
  infoUrl: string
  isSelected: false
  label: string
  paramsKeyValue: any
  parentValue: string
  textKeyValue: any
  title: string
  toolTip: any
  url: string
  value: string
  valueInt: number
}

interface ITogglesProps {
  toggles: any[]
  currentToggle: IToggle
  handleToggleClick: (toggle: IToggle) => void
}
