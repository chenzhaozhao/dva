
export const SUPPOER_LOCALES = [
    {
        name: "English",
        value: "en-US"
    },
    {
        name: "简体中文",
        value: "zh-CN"
    }
]
//
// export const WS_URL = (global.location.protocol === 'http:' ? 'ws' : 'wss') + '://socket.crebe.com:6510';
console.log((window.location.protocol==='https:'?'://socket.crebe.com:6510':'://testsocket.crebe.io:6510'));
export const WS_URL = (global.location.protocol === 'http:' ? 'ws' : 'wss') + (window.location.protocol==='https:'?'://socket.crebe.com:6510':'://testsocket.crebe.io:6510');
