import is from 'electron-is'

export default {
  index: {
    attrs: {
      title: 'Motrix',
      // 默认窗体大小
      width: 740,
      height: 506,
      minWidth: 478,
      minHeight: 420,
      transparent: is.macOS()
    },
    bindCloseToHide: true,
    openDevTools: is.dev(),
    url: is.dev() ? 'http://localhost:9080' : require('path').join('file://', __dirname, '/index.html')
  }
}
