function getUrl () {
  const head = document.head
  if (head) {
    const children = head.children
    if (children) {
      const childCount = children.length
      for (let childIndex = 0; childIndex < childCount; childIndex++) {
        const child = children.item(childIndex)
        if (child) {
          if (child.localName === 'meta') {
            const attrCount = child.attributes.length
            for (let attrIndex = 0; attrIndex < attrCount; attrIndex++) {
              const attr = child.attributes.item(attrIndex)
              if (attr) {
                if (attr.localName === 'api') {
                  return attr.value
                }
              }
            }
          }
        }
      }
    }
  }

  return ''
}

export default {
  getUrl
}
