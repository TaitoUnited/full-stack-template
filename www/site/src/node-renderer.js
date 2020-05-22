import { Nodes } from './node-mapping'

export const renderNodes = (nodes, lang) => {
  return nodes.map((node, index) => {
    if (node.type === 'element') {
      const tag = Nodes[node.tagName] || Nodes['default']

      // Render links
      if (node.tagName === 'a')
        return tag.render({
          children: renderNodes(node.children),
          href: node.properties.href,
          key: index,
        })
      const language = node.properties && node.properties.dataLanguage
      // Check for code language examples
      const active = language === 'json' || language === lang
      // Get anchor id's for headings
      const id =
        (node.tagName === 'h1' || 'h2' || 'h2') &&
        node.children[0].value &&
        node.children[0].value
          .toLowerCase()
          .split(' ')
          .join('-')
      const element = tag.render({
        children: renderNodes(node.children),
        className: node.properties.className,
        active,
        key: index,
        id,
      })
      return element
    } else if (node.type === 'text') {
      return node.value
    }

    return null
  })
}
