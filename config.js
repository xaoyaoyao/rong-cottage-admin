// 应用全局配置
module.exports = {
  baseUrl: 'https://api.vobase.com/api',
  // baseUrl: 'http://localhost:8080/api',
  // 应用信息
  appInfo: {
    // 应用名称
    name: "vobase-app",
    // 应用版本
    version: "1.2.0",
    // 应用logo
    logo: "/static/logo.png",
    // 官方网站
    site_url: "http://vobase.com",
    // 政策协议
    agreements: [{
        title: "隐私政策",
        url: "https://h5.vobase.com/protocol.html"
      },
      {
        title: "用户服务协议",
        url: "https://h5.vobase.com/protocol.html"
      }
    ]
  }
}
