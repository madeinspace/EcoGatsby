import React from "react"
import IndexLayout from "../components/Indexlayout"
import SEO from "../components/seo"
import { StaticQuery, graphql, Link } from "gatsby"

const IndexPage = () => (
  <IndexLayout>
    <SEO title="ClientList" />

    <StaticQuery
      query={graphql`
        query {
          allClient {
            nodes {
              Alias
              Name
            }
          }
        }
      `}
      render={data => (
        <ul>
          {data.allClient.nodes.map((client, i) => (
            <li key={i}>
              <Link to={`/${client.Alias}/population`}>
                {client.Alias}: {client.Name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    />
  </IndexLayout>
)

export default IndexPage
