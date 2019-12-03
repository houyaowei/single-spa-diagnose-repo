import Configs from '../../../app/config.js';

export default ['$element', '$scope', 'modalInstance', '$ccValidator', '$http', '$ccTips', function($element, $scope, modalInstance, $ccValidator, $http, $ccTips) {
	const that = this;
	this.ok = function() {
		that.savePassword(modalInstance.ok);
	};
	this.ccValidators = {
		checkpasswd: {
			msg: '密码至少8位，并包括大小写字母及数字',
			regex: /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
		},
		equalTo: {
			msg: '两次输入的密码不一致',
			fn: (modelValue, viewValue) => {
				const value = modelValue || viewValue;
				return value ? (value === that.password) : !value;
			}
		}
	};
	let tips = null;
	var saveFn = function(callback) {
		var PasswordInfo = {
			id: $scope.user.id,
			password: that.password,
			newPassword: that.newPassword,
			oldPassword: that.oldPassword
		};

		$http.put(Configs.webSystem + '/sys/user/' + PasswordInfo.id + '/password/?_=' + new Date().getTime(), PasswordInfo).success(function() {
			callback();
			$ccTips.success('密码修改成功');
		}).error(function(data, status, headers, config) {
			if (!tips || !tips.element) {
				tips = $ccTips.error(data.description, document.querySelector('.ccms-modal'));
			}
		});
	};
	this.savePassword = callback => {
		$ccValidator.validate($scope.changepassword).then(() => {
			saveFn(callback);
		}, () => {
			console.log('校验失败!');
		});
	};
}];
