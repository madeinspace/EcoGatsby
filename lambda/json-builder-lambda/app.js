const _ = require("lodash");
const knex = require("knex");
const AWS = require("aws-sdk");
const Promise = require("bluebird");

const S3 = new AWS.S3();

const getScopedEnvVar = (scope, db_env_var) =>
  process.env[`${scope}_${db_env_var}`] || process.env[`DEFAULT_${db_env_var}`];

const CommClientDBConnection = () => ({
  client: "mssql",
  connection: {
    host: getScopedEnvVar("CLIENT", "DATABASE_HOST"),
    user: getScopedEnvVar("CLIENT", "DATABASE_USER"),
    password: getScopedEnvVar("CLIENT", "DATABASE_PASS"),
    database: getScopedEnvVar("CLIENT", "DATABASE_NAME"),
    requestTimeout: 0,
    options: { encrypt: false }
  },
  acquireConnectionTimeout: 600000
});

const CommDataEconomyDBConnection = () => ({
  client: "mssql",
  connection: {
    host: getScopedEnvVar("DATA", "DATABASE_HOST"),
    user: getScopedEnvVar("DATA", "DATABASE_USER"),
    password: getScopedEnvVar("DATA", "DATABASE_PASS"),
    database: getScopedEnvVar("DATA", "DATABASE_NAME"),
    requestTimeout: 0,
    options: { encrypt: false }
  },
  acquireConnectionTimeout: 600000
});

let ClientConnection;
let DataConnection;

const Client = ClientIDs =>
  ClientConnection.raw(`
    SELECT
      ClientID,
      Name,
      ShortName,
      LongName,
      Alias
    FROM Client
    WHERE ClientID IN (${ClientIDs.join(",")})
  `);

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
  `);

const BenchMarkGeo = ClientID =>
  ClientConnection.raw(`
    SELECT
      WebID AS ID,
      GeoName AS Name
    FROM [CommClient].[dbo].[ClientToAreas_Economy]
    WHERE ClientID = ${ClientID}
    AND NOT WebID = 10
  `);

const Sexes = [
  { ID: 1, Name: "Males" },
  { ID: 2, Name: "Females" },
  { ID: 3, Name: "Persons" }
];

const Identity = i => i;

const LoadData = client => {
  console.log(`Querying ${client.Alias}...`);
  return Promise.all([
    BenchMarkGeo(client.ClientID),
    BenchMarkIndustries(40)
  ]).then(([geoAreas, Industries]) => {
    return Promise.map(Industries, ({ ID: Indkey }) => {
      const FetchAndMapIGBMs = () => {
        return BenchMarkIndustries(Indkey)
          .then(benchmarkableIndustries => {
            const IGBMs = _.union(geoAreas, benchmarkableIndustries);

            return Promise.map(IGBMs, ({ ID: IGBMID }) => {
              const MapSexes = () => {
                return Promise.map(Sexes, ({ ID: Sex }) => {
                  const WriteData = clientData => {
                    const fileName = `${
                      client.Alias
                    }-${Indkey}-${IGBMID}-${Sex}.json`;
                    console.log(
                      `[${client.Alias}, ${
                        client.ClientID
                      }, ${new Date().toISOString()}] Writing ${fileName}...`
                    );

                    return S3.upload({
                      Bucket: "roaring20s.economy.id.com.au-data",
                      Key: `data/${client.Alias}/${fileName}`,
                      ACL: "public-read",
                      Region: "ap-southeast-2",
                      Body: JSON.stringify({
                        Industries,
                        IGBMs,
                        Sexes,
                        TabularData: clientData
                      }),
                      ContentType: "application/json"
                    }).promise();
                  };

                  const FetchAndWriteData = () => {
                    return DataConnection.raw(
                      `
                        select * from [dbo].[fn_Industry_StudyField1and3Digit_Sex](
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
                        ) order by LabelKey
                        `
                    ).then(WriteData, FetchAndWriteData);
                  };

                  return FetchAndWriteData();
                }).then(Identity, MapSexes);
              };

              return MapSexes();
            });
          })
          .then(Identity, FetchAndMapIGBMs);
      };

      return FetchAndMapIGBMs();
    });
  });
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    const FetchAll = () => {
      ClientConnection = knex(CommClientDBConnection());
      DataConnection = knex(CommDataEconomyDBConnection());
      return Client(event.ClientID).then(([client]) => {
        return LoadData(client).then(data => {
          console.log("Writing success manifest");
          const writtenFiles = _.flattenDeep(data);
          return S3.upload({
            Bucket: "roaring20s.economy.id.com.au-data",
            Key: `data/${client.Alias}/0-success-manifest.json`,
            ACL: "public-read",
            Region: "ap-southeast-2",
            Body: JSON.stringify({
              metadata: {
                count: writtenFiles.length
              },
              writtenFiles: writtenFiles
            }),
            ContentType: "application/json"
          })
            .promise()
            .then(
              () => console.log("File Written"),
              err =>
                console.log("An error occurred writing the success file: ", err)
            );
        });
      });
    };
    return FetchAll().then(Identity, FetchAll);
  } catch (err) {
    console.log(err);
    return err;
  }
};
