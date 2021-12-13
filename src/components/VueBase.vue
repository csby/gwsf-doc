<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class VueBase extends Vue {
  isNullOrEmpty (val) {
    if (val === undefined || val === null || val === '' || val === '\u003cnil\u003e') {
      return true
    }
    return false
  }

  isNotNullOrEmpty (val) {
    if (this.isNullOrEmpty(val)) {
      return false
    }
    return true
  }

  apiError (err) {
    let msg = err.summary
    if (this.isNotNullOrEmpty(err.detail)) {
      msg = err.summary + ': ' + err.detail
    }
    this.error(msg)
  }

  error (msg) {
    this.alert(msg, 'error')
  }

  alert (msgVal, msgType = 'info') {
    this.msgbox({
      showClose: true,
      message: msgVal,
      type: msgType
    })
  }

  createShiftArr (step) {
    let space = '    '

    if (isNaN(parseInt(step))) { // argument is string
      space = step
    } else { // argument is integer
      switch (step) {
        case 1: space = ' '; break
        case 2: space = '  '; break
        case 3: space = '   '; break
        case 4: space = '    '; break
        case 5: space = '     '; break
        case 6: space = '      '; break
        case 7: space = '       '; break
        case 8: space = '        '; break
        case 9: space = '         '; break
        case 10: space = '          '; break
        case 11: space = '           '; break
        case 12: space = '            '; break
      }
    }

    const shift = ['\n'] // array of shifts
    for (let ix = 0; ix < 100; ix++) {
      shift.push(shift[ix] + space)
    }
    return shift
  }

  formatXml (text) {
    const ar = text.replace(/>\s{0,}</g, '><')
      .replace(/</g, '~::~<')
      .replace(/\s*xmlns\:/g, '~::~xmlns:')
      .replace(/\s*xmlns\=/g, '~::~xmlns=')
      .split('~::~')
    const len = ar.length
    let inComment = false
    let deep = 0
    let str = ''
    let ix = 0
    const shift = this.createShiftArr('    ')

    for (ix = 0; ix < len; ix++) {
      // start comment or <![CDATA[...]]> or <!DOCTYPE //
      if (ar[ix].search(/<!/) > -1) {
        str += shift[deep] + ar[ix]
        inComment = true
        // end comment  or <![CDATA[...]]> //
        if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1) {
          inComment = false
        }
      } else
      // end comment  or <![CDATA[...]]> //
      if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
        str += ar[ix]
        inComment = false
      } else
      // <elm></elm> //
      if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix]) &&
          /^<[\w:\-\.\,]+/.exec(ar[ix - 1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/', '')) {
        str += ar[ix]
        if (!inComment) deep--
      } else
      // <elm> //
      if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1) {
        str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix]
      } else
      // <elm>...</elm> //
      if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
        str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix]
      } else
      // </elm> //
      if (ar[ix].search(/<\//) > -1) {
        str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix]
      } else
      // <elm/> //
      if (ar[ix].search(/\/>/) > -1) {
        str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix]
      } else
      // <? xml ... ?> //
      if (ar[ix].search(/<\?/) > -1) {
        str += shift[deep] + ar[ix]
      } else
      // xmlns //
      if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
        str += shift[deep] + ar[ix]
      } else {
        str += ar[ix]
      }
    }

    return (str[0] === '\n') ? str.slice(1) : str
  }

  formatJson = function (text) {
    const step = '    '

    if (typeof JSON === 'undefined') return text

    if (typeof text === 'string') return JSON.stringify(JSON.parse(text), null, step)
    if (typeof text === 'object') return JSON.stringify(text, null, step)

    return text // text is not string nor object
  }

  syntaxHighlight (json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 4)
    }

    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g, function (match) {
      let sty = 'color: darkorange;' // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          sty = 'color: red;' // key
        } else {
          sty = 'color: green;' // string
        }
      } else if (/true|false/.test(match)) {
        sty = 'color: blue;' // boolean
      } else if (/null/.test(match)) {
        sty = 'color: magenta;' // null
      }
      return '<span style="' + sty + '">' + match + '</span>'
    })
  }

  syntaxXmlHighlight (xml) {
    if (xml) {
      xml = xml.replace(/</g, '&lt;')
      xml = xml.replace(/>/g, '&gt;')
    }
    return xml
  }

  // example
  // uri: "/user/info"
  // argument: {id: "111212323"}
  // handler: function(code, error, data){ }
  post (uri, argument, handler) {
    this.network.post(uri, argument, handler, null)
  }
}

export default VueBase
</script>
