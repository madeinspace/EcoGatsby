const _ = require("lodash")
const knex = require("knex")
const fs = require("fs")
const fsPromise = fs.promises
const Promise = require("bluebird")
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const getScopedEnvVar = (scope, db_env_var) =>
  process.env[`${scope}_${db_env_var}`] || process.env[`DEFAULT_${db_env_var}`]

const CommClientAppConnection = () => ({
  client: "mssql",
  connection: {
    host: getScopedEnvVar("COMMAPP", "DATABASE_HOST"),
    user: getScopedEnvVar("COMMAPP", "DATABASE_USER"),
    password: getScopedEnvVar("COMMAPP", "DATABASE_PASS"),
    database: getScopedEnvVar("COMMAPP", "DATABASE_NAME"),
    options: { encrypt: false },
  },
})

const CommClientDBConnection = () => ({
  client: "mssql",
  connection: {
    host: getScopedEnvVar("CLIENT", "DATABASE_HOST"),
    user: getScopedEnvVar("CLIENT", "DATABASE_USER"),
    password: getScopedEnvVar("CLIENT", "DATABASE_PASS"),
    database: getScopedEnvVar("CLIENT", "DATABASE_NAME"),
    options: { encrypt: false },
  },
})

const CommDataEconomyDBConnection = () => ({
  client: "mssql",
  connection: {
    host: getScopedEnvVar("DATA", "DATABASE_HOST"),
    user: getScopedEnvVar("DATA", "DATABASE_USER"),
    password: getScopedEnvVar("DATA", "DATABASE_PASS"),
    database: getScopedEnvVar("DATA", "DATABASE_NAME"),
    requestTimeout: 0,
    options: { encrypt: false },
  },
  acquireConnectionTimeout: 600000,
})

const ClientConnection = knex(CommClientDBConnection())
const AppConnection = knex(CommClientAppConnection())
const DataConnection = knex(CommDataEconomyDBConnection())

const ClientSQL = `
WITH RDAS AS (
  SELECT
    DISTINCT(areas.ClientID),
    CASE WHEN RDAs.IsRDA IS NOT NULL THEN 1 ELSE 0 END AS IsRDA
    FROM [CommClient].[dbo].[ClientToAreas_Economy] areas
    LEFT OUTER JOIN (
    SELECT
      DISTINCT(ClientID),
      COUNT(WebID) AS IsRDA
    FROM [CommClient].[dbo].[ClientToAreas_Economy] areas
      WHERE WebID > 50
      GROUP BY (ClientID)
    ) AS RDAs
    ON areas.ClientID = RDAs.ClientID
  )
  SELECT
    client.ClientID,
    client.Name,
    client.ShortName,
    client.LongName,
    client.Alias
  FROM Client AS client
  INNER JOIN ClientAppDisable AS clientMeta
    ON clientMeta.ClientID = client.ClientID
  INNER JOIN RDAS
    ON client.ClientID = RDAS.ClientID
  WHERE clientMeta.IsDisabled = 0
    AND clientMeta.ApplicationID = 4
    AND RDAS.IsRDA = 0
`

const ClientsQuery = ClientConnection.raw(ClientSQL)

const BenchMarkIndustries = IGBMID =>
  DataConnection.raw(`
    SELECT
      CAST(23000 AS INT) AS ID,
      'All industries' AS Name
    WHERE 23000 != ${IGBMID}
    UNION
    SELECT
      CAST(I.IndustryWebKey as INT) AS ID,
      I.IndustryWebName AS Name
    FROM CommData_Economy.dbo.vS_IndustryCodes AS I
    INNER JOIN CommData_Economy.dbo.vS_IndustryCodesParents AS IP
        ON I.Industrycode = IP.IndustryCode
    WHERE I.IndustryWebKey != ${IGBMID} AND (I.IndustryWebKey NOT IN(23020,23045))
      AND I.IndustryWebKey = IP.IndustryWebKey
`)

const BenchMarkGeo = ClientID =>
  ClientConnection.raw(
    `
    SELECT
      WebID AS ID,
      GeoName AS Name
    FROM [CommClient].[dbo].[ClientToAreas_Economy]
    WHERE ClientID = ${ClientID}
    AND NOT WebID = 10
  `
  )

const Sexes = [
  { ID: 1, Name: "Males" },
  { ID: 2, Name: "Females" },
  { ID: 3, Name: "Persons" },
]

Promise.mapSeries(ClientsQuery, client => {
  console.log(`Querying ${client.Alias}...`)
  return Promise.all([
    BenchMarkGeo(client.ClientID),
    BenchMarkIndustries(40),
  ]).then(([geoAreas, Industries]) => {
    return Promise.map(Industries, ({ ID: Indkey }) => {
      return BenchMarkIndustries(Indkey).then(benchmarkableIndustries => {
        const IGBMs = _.union(geoAreas, benchmarkableIndustries)

        return Promise.map(IGBMs, ({ ID: IGBMID }) => {
          return Promise.map(Sexes, ({ ID: Sex }) => {
            console.log(
              `Querying data for ${
                client.ClientID
              }, ${Indkey}, ${IGBMID}, ${Sex}`
            )
            return DataConnection.raw(
              `select * from [dbo].[fn_Industry_StudyField1and3Digit_Sex](
                ${client.ClientID},
                10,
                ${IGBMID},
                2016,
                2011,
                'WP',
                ${Sex},
                1,
                null,
                ${Indkey}
                ) order by LabelKey`
            ).then(clientData => {
              const fileName = `${client.Alias}-${Indkey}-${IGBMID}-${Sex}.json`
              console.log(`Writing ${fileName}...`)
              return fsPromise.writeFile(
                `src/data/workers-field-of-qualification/${fileName}`,
                JSON.stringify({
                  Industries,
                  IGBMs,
                  Sexes,
                  tabularData: clientData,
                })
              )
            })
          })
        })
      })
    })
  })
}).then(() => process.exit(0))
