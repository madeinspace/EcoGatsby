/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)

exports.createPages = ({ graphql, actions: { createPage } }) => {
  return graphql(`
    query {
      allClient {
        nodes {
          ClientID
          Alias
          Name
          LongName
        }
      }
    }
  `).then(result => {
    result.data.allClient.nodes.forEach(node => {
      createPage({
        path: node.Alias,
        component: path.resolve(`./src/templates/home.tsx`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          ClientImageRegex: `/${node.Alias}/i`,
          ClientID: node.ClientID,
        },
      })
      createPage({
        path: `${node.Alias}/population`,
        component: path.resolve(`./src/templates/population.tsx`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          ClientID: node.ClientID,
          ClientImageRegex: `/${node.Alias}/i`,
        },
      })
      createPage({
        path: `${node.Alias}/workers-field-of-qualification`,
        component: path.resolve(
          `./src/templates/workers-field-of-qualification.tsx`
        ),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          ClientID: node.ClientID,
          ClientImageRegex: `/${node.Alias}/i`,
        },
      })
    })
  })
}
