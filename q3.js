const startTag = /<([a-zA-Z_][\w\-\.]*)((?:\s+([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))*)\s*(\/?)>/;
const endTag = /<\/([a-zA-Z_][\w\-\.]*)>/;
const attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

function htmlToJson(html) {
  let buff = [];
  let results = {};
  let isText;
  let match;
  let last;
  while (html && last !== html) {
    last = html;
    isText = true;
    if (html.indexOf("</") === 0) {
      match = html.match(endTag);
      if (match) {
        isText = false;
        html = html.substring(match[0].length);
        match[0].replace(endTag, handleEndTag);
      }
    } else if (html.indexOf("<") === 0) {
      match = html.match(startTag);
      if (match) {
        isText = false;
        html = html.substring(match[0].length);
        match[0].replace(startTag, handleStartTag);
      }
    }
    if (isText) {
      let index = html.indexOf("<");
      let text;
      if (index < 0) {
        text = html;
        html = "";
      } else {
        text = html.substring(0, index);
        html = html.substring(index);
      }
      pushChild({
        node: "text",
        text
      });
    }
  }
  function pushChild(node) {
    if (buff.length === 0) {
      results = node;
    } else {
      const parent = buff[buff.length - 1];
      parent.child = parent.child ? [...parent.child, node] : [node];
    }
  }
  function handleStartTag(tag, tagName, rest) {
    let attrs = {};
    let selfClose = tag.endsWith("/>");
    rest.replace(attr, function(match, name) {
      attrs[name] = arguments[2] || "";
    });
    buff.push({
      tag: tagName.toLowerCase(),
      attributes: attrs,
      selfClose
    });
    selfClose && pushChild(buff.pop());
  }

  function handleEndTag() {
    pushChild(buff.pop());
  }
  console.log(results);
}

let html =
  '<div class="classAttr" data-type="dataType" data-id="dataId" style="color:red">div<span>span</span><span id="id" /></div>';
htmlToJson(html);
