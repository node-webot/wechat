var tpl = [
  '<xml>',
    '<ToUserName><![CDATA[<%=sp%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%=user%>]]></FromUserName>',
    '<CreateTime><%=(new Date().getTime())%></CreateTime>',
    '<MsgType><![CDATA[<%=type%>]]></MsgType>',
    '<% if (type === "text") { %>',
      '<Content><![CDATA[<%=text%>]]></Content>',
    '<% } else if (type === "location") { %>',
      '<Location_X><%=xPos%></Location_X>',
      '<Location_Y><%=yPos%></Location_Y>',
      '<Scale>{<%=scale%>}</Scale>',
      '<Label><![CDATA[<%=label%>]]></Label>',
    '<% } else if (type === "image") { %>',
      '<PicUrl><![CDATA[<%=pic%>]]></PicUrl>',
    '<% } else if (type === "voice") { %>',
      '<MediaId><%=mediaId%></MediaId>',
      '<Format><%=format%></Format>',
    '<% } %>',
  '</xml>'
].join('');

exports.template = require('ejs').compile(tpl);