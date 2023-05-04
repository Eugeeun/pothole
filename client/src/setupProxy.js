const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    // /api로 시작하는 api는 target으로 설정된 서버 URL로 호출하도록 설정
    createProxyMiddleware('/api', {
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
