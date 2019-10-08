import React from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"
import SEO from "../components/seo"
export default ({ data }) => {
  return (
    <React.Fragment>
      <Layout data={data}>
        <SEO title={data.client.Name} />
        <ul>
          <li>
            <Link to={`${data.client.Alias}/population`}>Population</Link>
          </li>
        </ul>
      </Layout>
    </React.Fragment>
  )
}

export const query = graphql`
  query($ClientID: Int!, $ClientImageRegex: String!) {
    client(ClientID: { eq: $ClientID }) {
      Alias
      Name
      LongName
      ClientID
    }
    allClientProducts(filter: { ClientID: { eq: $ClientID } }) {
      nodes {
        ApplicationID
        ClientID
        ProductName
        ClientLongName
        ClientShortName
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
