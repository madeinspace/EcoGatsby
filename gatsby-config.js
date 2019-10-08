const _ = require("lodash")

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const ignoreClients = _.isUndefined(process.env.IGNORE_CLIENTS)
  ? []
  : process.env.IGNORE_CLIENTS.split(" ")

const assetPrefix =
  process.env.ASSET_PREFIX || "https://roaring20s.economy.id.com.au"

const knex = require("knex")

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
})

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
  ${ignoreClients
    .map(clientAlias => `  AND NOT client.Alias = '${clientAlias}'`)
    .join("\n")}
`

const ClientIDsQuery = knex(CommClientDBConnection())
  .raw(ClientSQL)
  .then(clients => {
    return _.map(clients, "ClientID")
  })

module.exports = {
  assetPrefix: assetPrefix,
  siteMetadata: {
    title: `Economy.id`,
    description: `A website for Economy.id`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          camelCase: false,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      typeName: `Images`,
      fieldName: `images`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
      },
    },
    {
      resolve: `gatsby-source-sql`,
      options: {
        typeName: "MainNavigation",
        fieldName: "mainNavigation",
        dbEngine: CommClientDBConnection(),
        queryChain: function(x) {
          return x.raw(`
          SELECT [ClientID]
            ,cp.[PageID]
            ,COALESCE(cp.[Alias], p.Alias) as Alias
            ,p.ParentPageID
            ,p.MenuTitle
            ,[Disabled]
            ,pg.Name as GroupName
          FROM [CommClient].[dbo].[ClientPage] cp
          right join [CommApp].dbo.Page p 
            on cp.pageId = p.pageID 
          inner join [CommApp].[dbo].[PageGroup] pg
            on p.PageGroupID = pg.PageGroupID
            and p.ApplicationID = 4
          `)
        },
      },
    },
    {
      resolve: `gatsby-source-sql`,
      options: {
        typeName: "SitemapGroups",
        fieldName: "sitemapGroup",
        dbEngine: CommClientDBConnection(),
        queryChain: function(x) {
          return x.raw(`
          SELECT TOP (1000) [ApplicationID]
            ,[GroupName]
            ,[SitemapName]
            ,[ColNumber]
            ,[SortOrder]
            ,[Pages]
          FROM [CommApp].[dbo].[SitemapInfo]
          where SitemapName like 'footer'
          and ApplicationID = 4
          `)
        },
      },
    },
    {
      resolve: `gatsby-source-sql`,
      options: {
        typeName: "ClientProducts",
        fieldName: "clientProducts",
        dbEngine: CommClientDBConnection(),
        queryChain: function(x) {
          return x.raw(`
            SELECT 
            c.Alias as Alias
            ,c.name as ClientLongName
            ,c.ShortName as ClientShortName
            ,cad.ClientID
            ,cad.ApplicationID
            ,a.SubDomainName
            ,a.FullName as ProductName
          FROM CommClient.dbo.ClientAppDisable as cad
          left outer join [CommApp].[dbo].[Application] as a 
            on  cad.ApplicationID = a.ApplicationID
          left outer join [CommClient].[dbo].[Client] as c
            on cad.ClientID = c.ClientID
          where cad.IsDisabled = 0
          `)
        },
      },
    },
    {
      resolve: `gatsby-source-sql`,
      options: {
        typeName: "Client",
        fieldName: "client",
        dbEngine: CommClientDBConnection(),
        queryChain: function(x) {
          return x.raw(ClientSQL)
        },
      },
    },
    {
      resolve: `gatsby-source-sql`,
      options: {
        typeName: "Population",
        fieldName: "population",
        dbEngine: CommDataEconomyDBConnection(),
        queryChain: function(x) {
          return ClientIDsQuery.then(clientIds => {
            return x.raw(`
              With CTE AS (
                select 
                  [ClientID]
                  ,[WebID]
                  ,[GeoName]
                  ,[Year]
                  ,[Number]
                  ,CASE WHEN [WebID] = 10 THEN 1 ELSE 2 END as [GeoType]
                from [v_IN_ERPPivot]
                where WebID IN (10, 40, 50)
                  AND ClientID IN (${clientIds.join(",")})
              ),
              CTE2 AS (
                select [ClientID]
                  ,[WebID]
                  ,[GeoName]
                  ,[Year] + 1 as [Year]
                  ,[Number]
                  ,[GeoType]
                from CTE
              )
              
              select C.ClientID as ClientID
                ,C.WebID as ClientWebID
                ,C.Geoname as ClientGeoName
                ,C.Year as ClientYear
                ,C.Number as ClientNumber
                ,C.ChangeYear1Year2 as ClientChangeYear1Year2
                ,C.Changeper as ClientChangeper
                
                ,BM.WebID as BenchmarkWebID
                ,BM.Geoname as BenchmarkGeoName
                ,BM.Year as BenchmarkYear
                ,BM.Number as BenchmarkNumber
                ,BM.ChangeYear1Year2 as BenchmarkChangeYear1Year2
                ,BM.Changeper as BenchmarkChangeper
                
                ,AUS.WebID as AusWebID
                ,AUS.Geoname as AusGeoName
                ,AUS.Year as AusYear
                ,AUS.Number as AusNumber
                ,AUS.ChangeYear1Year2 as AusChangeYear1Year2
                ,AUS.Changeper as AusChangeper
              from (
                SELECT CTE_1.ClientID, 
                  CTE_1.WebID,
                  CTE_1.GeoName,
                  CTE_1.Year, 
                  CTE_1.Number,
                  CTE_1.Number  - CTE4.Number as  ChangeYear1Year2,
                  (CAST((CTE_1.Number - CTE4.Number) as float)/CTE4.Number)*100 as ChangePer
                from CTE as CTE_1 
                Left Hash Join CTE2 as CTE4
                        on  CTE_1.ClientId = CTE4.ClientId
                        and CTE_1.Webid = CTE4.Webid
                        and CTE_1.Year = CTE4.Year
                where CTE_1.webid=10
              ) as C
                
              inner join (
                SELECT CTE_1.ClientID, 
                  CTE_1.WebID,
                  CTE_1.GeoName,
                  CTE_1.Year, 
                  CTE_1.Number,
                  CTE_1.Number  - CTE4.Number as  ChangeYear1Year2,
                  (CAST((CTE_1.Number - CTE4.Number) as float)/CTE4.Number)*100 as ChangePer
                from CTE as CTE_1 
                Left Hash Join CTE2 as CTE4 on CTE_1.ClientId = CTE4.ClientId and  CTE_1.Webid = CTE4.Webid and  CTE_1.Year = CTE4.Year
                where CTE_1.WebID=40
              ) as BM
                on  C.ClientID=BM.ClientID
                AND C.Year=BM.Year
              
              inner join (
                SELECT CTE_1.ClientID, 
                  CTE_1.WebID,
                  CTE_1.GeoName,
                  CTE_1.Year, 
                  CTE_1.Number,
                  CTE_1.Number  - CTE4.Number as  ChangeYear1Year2,
                  (CAST((CTE_1.Number - CTE4.Number) as float)/CTE4.Number)*100 as ChangePer
                from CTE as CTE_1 
                Left Hash Join CTE2 as CTE4 on CTE_1.ClientId = CTE4.ClientId and  CTE_1.Webid = CTE4.Webid and  CTE_1.Year = CTE4.Year
                where CTE_1.WebID=50
              ) as AUS
                on  C.Year=AUS.Year
                AND C.ClientID=AUS.ClientID

                ORDER BY ClientID, ClientYear ASC
            `)
          })
        },
      },
    },
    `gatsby-plugin-offline`, // Put this at the end of everything so that it all gets cached (especially the manifest)
  ],
}
