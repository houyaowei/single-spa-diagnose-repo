/*
 * @author Created by taoyong
 * @time Created on 16/5/24.
 */
// 顶部导航栏
const setNavFunction = function() {
	const navElement = document.querySelectorAll('.nav>li');
	const moreElement = document.querySelectorAll('.more');
	const menuAreaElement = document.querySelector('.menu-area');
	menuAreaElement.style.visibility = 'visible';
	const moreLiElement = document.querySelectorAll('.more ul li');
	const listnum = navElement.length; // 导航总共的个数
	const navwidth = document.body.offsetWidth - document.querySelectorAll('h1')[0].offsetWidth - document.querySelectorAll('.headerAside')[0].offsetWidth - 80;
	const showlistnum = parseInt((navwidth / navElement[0].offsetWidth) * 1, 10) || 1;
	const hidelistnum = listnum - showlistnum;
	if (hidelistnum > 0) {
		var showLength = navElement.length - hidelistnum - 1;
		for (var i = 0, len = navElement.length; i < len; i++) {
			if (i > showLength) {
				navElement[i].style.display = 'none';
				moreLiElement[i].style.display = 'block';
			} else {
				navElement[i].style.display = 'block';
				moreLiElement[i].style.display = 'none';
			}
		};
		moreElement[0].style.display = 'block';
	} else if (hidelistnum <= 0) {
		for (var j = 0, length = navElement.length; j < length; j++) {
			navElement[j].style.display = 'block';
		};
		moreElement[0].style.display = 'none';
	};
};

document.addEventListener('DOMContentLoaded', () => {
	window.onresize = () => {
		setNavFunction();
	};
});

class CtrlCenter {

  static ctrlObj = {};

  static saveCtrl(value, key) { CtrlCenter.ctrlObj[key] = value; }
}

export default {
	setNavFunction,
	CtrlCenter
};
