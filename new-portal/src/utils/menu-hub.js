import axios from 'axios';
import Cache from './easy-cache.js';

const cachedInstance = {};

class MenuHub {

	get env() {
		const appName = location.hash.split('/')[1];
		if (!appName || appName === 'insert') throw Error('MenuHub can not support this app!');
		return appName;
	}

	get cache() {
		return cachedInstance[this.env] || (cachedInstance[this.env] = Cache.getInstance(this.env, this.opt.moduleName));
	}

	// 1. 注册url或者promise, promise需要返回的是数组对象  2. opt用于控制缓存
	fork(source, opt = {}) {
		this.opt = opt;
		if (!source) throw new Error('menu promise is required!!');
		const cachedMenu = this.cache.getMenuConfig();
		if (cachedMenu) {
			console.log('menu from session');
			return Promise.resolve(cachedMenu);
		}

		let pm;
		if (typeof source === 'string') {
			pm = axios.get(source).then(res => res.data);
		}
		if (typeof source === 'function') {
			pm = source();
		}

		return pm.then(menuData => {
			setTimeout(() => {
				this.cache.setMenuConfig(menuData, opt.expires);
			});
			return menuData;
		});
	}
}

const hub = new MenuHub();
export default hub;
