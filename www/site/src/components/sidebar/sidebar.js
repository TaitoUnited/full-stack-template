import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

const renderTOC = content =>
  content.headings.map(element => {
    if (element.depth === 1) {
      return (
        <Item key={element.value}>
          <Anchor
            href={`#${element.value
              .toLowerCase()
              .split(' ')
              .join('-')}`}
          >
            {element.value}
          </Anchor>
        </Item>
      )
    }
    return null
  })

const TOC = ({ content, data }) => {
  return (
    <StaticQuery
      query={query}
      render={data => (
        <View>
          <Title>{data.site.siteMetadata.title}</Title>
          <List>{renderTOC(content)}</List>
        </View>
      )}
    />
  )
}

export default TOC

const query = graphql`
  query SiteQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const View = styled.div`
  bottom: 0;
  display: block;
  position: fixed;
  background-color: #2e3336;
  left: 0;
  overflow-y: auto;
  top: 0;
  width: 230px;
`
const Title = styled.h1`
  color: white;
  font-size: 20px;
  padding: 1rem;
  text-align: center;
`

const List = styled.ul`
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
  //margin-block-start: 1em;
  //margin-block-end: 1em;
  //margin-inline-start: 0px;
  //margin-inline-end: 0px;
  //padding-inline-start: 40px;
`

const Item = styled.li`
  color: white;
  display: list-item;
  &:hover {
    background-color: #3076cd;
  }
`
const Anchor = styled.a`
  line-height: 28px;
  padding: 0 15px 0 15px;
  display: block;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: none;
  color: #fff;
  transition-property: background;
  transition-timing-function: linear;
  transition-duration: 130ms;
`
