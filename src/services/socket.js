//初始化时
window._LINK_COUNT=0;
function connect(action, url, params = {}, requestStatus) {
  if (requestStatus.status) {
    const connection = new WebSocket(url);
    //当地址错误时
     if (!connection){
        throw new Error("socket url 链接错误,变量connection underfind");
         if (window._LINK_COUNT<=1000){
             window._LINK_COUNT++;
             setTimeout(() => {
                 connect(action, url, params, requestStatus)
             }, 10000)
         }
     }
    connection.onopen = (event) => {
        window._LINK_COUNT=0;
      console.log(`webSocket connect at time: ${new Date()}`)
      connection.send(JSON.stringify(params))
      // connection.send('add|index')
    }

    connection.onmessage = (event) => {
      // 此回调接收从socket server 推过来的消息
      action(event.data)
    }

    connection.onclose = (e) => {
        window._LINK_COUNT=0;
      //console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason)
      setTimeout(() => {
        connect(action, url, params, requestStatus)
      }, 3000)
    }

    connection.onerror = (err) => {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      if (window._LINK_COUNT<=1000){
          setTimeout(() => {
              window._LINK_COUNT++;
              connect(action, url, params, requestStatus)
          }, 10000)
      }

    };
    return connection
  } else {
    return
  }

}

export function socket(action, { url, params, requestStatus }) {
  return connect(action, url, params, requestStatus)
}
