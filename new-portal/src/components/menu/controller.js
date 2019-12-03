
export default class MenuCtrl {
	constructor(
		$window
	) {
		this.routerChangeStart = e => {
			const _target = e.target.id;
			$window.history.pushState({}, null, `/${_target}`);
		};
	}
}


MenuCtrl.$inject = [
	"$window"
];
