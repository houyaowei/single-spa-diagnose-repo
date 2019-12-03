
import './menu.less';
import angular from 'angular';
import menuComponent from './directive';

export default angular.module('common.directive.menu', [])
	.run(['$rootScope', function($rootScope) {
		var execValue = /([^-.]+)-ccms\./.exec(location.hostname);
		var hostName = (execValue && execValue[1]) || 'yangyangyang3';
		$rootScope.tenantId = window.sessionStorage.getItem('tenantId');
		$rootScope.hostName = hostName;
	}])
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-with'];
	}])
	.component('menus', menuComponent).name;


