/**
 *  手机微信解除绑定  2017.11.30
 */
import Servece from '../service';

const UNBINDWECHAT = '解绑微信之后，此微信将无法接收数据赢家推送的消息，也无法再用此微信扫码登录。确定解绑？';
const UNBINDMOBILE = '解绑手机号码之后，此手机号码将无法接收登录验证信息。确定解绑？';

class unbindCtrl {
	constructor($scope, userId, $ccModal, $ccTips, tenantId) {
		this.$ccModal = $ccModal;
		this.userId = userId;
		this.$ccTips = $ccTips;
		this.$scope = $scope;
		this.tenantId = tenantId;
		$scope.list = [{title: '手机号：', no: '', bind: ''}, {title: '微信昵称：', no: '', bind: ''}];
		this.init();
	}

	init() {
		this.$scope.loading = true;

		Servece.getBindInfo(this.userId, this.tenantId).then(({mobile, wxName}) => {
			this.$scope.list[0].no = mobile || '无';
			this.$scope.list[0].bind = mobile && '解绑';
			this.$scope.list[1].no = wxName || '无';
			this.$scope.list[1].bind = wxName && '解绑';
		},
		({ data }) => this.$ccTips.error(data.message || data, document.querySelector('.modal-body')))
			.finally(() => { this.$scope.loading = false; });
	}

	unbind(type) {
		const msgTip = type ? UNBINDWECHAT : UNBINDMOBILE;
		const method = type ? 'unbindWechat' : 'unbindMobile';

		this.$ccModal.confirm(msgTip).open().result.then(() => {
			Servece[method](this.userId, this.tenantId).then(() => this.init(),
				({ data }) => this.$ccTips.error(data.message || data, document.querySelector('.modal-body')));
		});
	}
}
unbindCtrl.$inject = ['$scope', 'userId', '$ccModal', '$ccTips', 'tenantId'];
export default unbindCtrl;
