/**
 * 配置文件
 */
const config = {
	// API前缀
	apiPrefixList: ['/web-portal/', '/dashboard/', '/node'],

	// 后端API地址
	apiUri: 'https://qa-ual.shuyun.com',

	// 后端API端口号
	apiPort: 443,

	// 启用服务接口
	serverPort: 8000,

	// 是否使用mock数据;
	useMock: true
};
// 使用mock环境时需要将apiUri设置为''
config.apiUri = config.useMock ? '127.0.0.1' : config.apiUri;
config.apiPort = config.useMock ? '8999' : config.apiPort;

module.exports = config;
