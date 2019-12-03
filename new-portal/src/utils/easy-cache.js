/** 0. 数据结构的设计
 * 缓存数据的存储
 * 将项目标志作为命名空间
 * FE2E:{
 *  'ccms.le': { __menuConfig__, __shopConfig__, __moduleName__, ...otherData,  },
 *  'ccms.wxcrm': {}
 * }
 *
 * 传入的标志
 * {
 *  key: 'ccms.le',
 * label: '新忠诚度'
 * }
 */

// 1. 从缓存中拉取数据，形成基础数据结构
// 2. 如果没有当前获取的，则进行注册
// 3. 缓存位置sessionStorage还是localStorage， sessionStorage在关闭浏览器下丢失，刷新后不变
// 4. sessionStorage 和 localStorage的模式


/**
 * cachedData 是整个应用的存储整体
 * moduleData 是模块下的存储数据
 * cachedData => { moduleData1, moduleData2, moduleData3 }
 */

const MAIN_CACHE_KEY = '__FE2E__';
const reservedKey = {
	SHOP_CONFIG: '__shopConfig__',
	MENU_CONFIG: '__menuConfig__',
	MODULE_NAME: '__moduleName__'
};
// const FE2E_EXPIRES = 12 * 60 * 60 * 1000;

class StorageAdapter {
	constructor(storage) {
		if (!storage) { throw new Error('缺少存储体'); }
		this.storage = storage; // sessionStorage
	}

	get(k) {
		const str = this.storage.getItem(k);

		try {
			return JSON.parse(str);
		} catch (error) {
			throw error;
		}
	}

	set(k, v) {
		this.storage.setItem(k, JSON.stringify(v)); // 添加过期时间
	}

	remove(k) {
		this.storage.remove(k);
	}

	clear() {
		this.storage.clear();
	}
}

const defaultStorage = new StorageAdapter(window.sessionStorage);


let instance = null;

const privateKey = Symbol();

class EasyCache {
	constructor(moduleKey, moduleName, pk) {
		if (privateKey !== pk) throw new Error('can not instatiate this class outside');
		this.moduleKey = moduleKey;
		this.moduleName = moduleName;
		this.storage = defaultStorage;
	}

	static getInstance(moduleKey, moduleName = '未命名模块') {
		if (!moduleKey) throw new Error('缺少模块键值！');
		return instance || (instance = new EasyCache(moduleKey, moduleName, privateKey));
	}

	/**
	 * 获取最新缓存的数据源
	 * @returns {{}}
	 */
	get dataSource() {
		// 数据源
		const cachedData = this.storage.get(MAIN_CACHE_KEY); // 主体数据
		const moduleData = cachedData && cachedData[this.moduleKey];
		return { cachedData, moduleData };
	}

	/* 抽象的方法 */
	get(k) {
		const moduleData = this.dataSource.moduleData;
		const data = moduleData && moduleData[k];
		const { value, expires } = data || {};

		if (expires && expires < Date.now()) {
			this.remove(k);
			return null;
		}
		return value;
	}

	set(k, v, expires) {
		if (expires && typeof expires !== 'number') {
			throw new Error('设置过期时间必须为到期时间的时间戳');
		}

		const { cachedData = {}, moduleData = {} } = this.dataSource;

		const newModuleData = {
			...moduleData,
			[reservedKey.MODULE_NAME]: this.moduleName,
			[k]: expires ? { value: v, expires } : { value: v }
		};

		// 存储数据和模块注释, expires是针对有个存储值进行设置的，应该放置于改键值下面
		const targetData = { ...cachedData, [this.moduleKey]: newModuleData };
		this.storage.set(MAIN_CACHE_KEY, targetData);
	}

	remove(k) {
		const { cachedData } = this.dataSource;
		cachedData && cachedData[this.moduleKey] && delete cachedData[this.moduleKey][k];
		this.storage.set(MAIN_CACHE_KEY, cachedData);
	}

	clear() {
		const cachedData = this.dataSource.cachedData;
		const moduleKey = this.moduleKey;

		cachedData && (delete cachedData[moduleKey]);
		this.storage.set(MAIN_CACHE_KEY, cachedData);
	}

	/* 提供的一些具体的方法 */
	getShopConfig() {
		return this.get(reservedKey.SHOP_CONFIG);
	}

	setShopConfig(v, expires) {
		this.set(reservedKey.SHOP_CONFIG, v, expires);
	}

	getMenuConfig() {
		return this.get(reservedKey.MENU_CONFIG);
	}

	setMenuConfig(v, expires) {
		this.set(reservedKey.MENU_CONFIG, v, expires);
	}

	removeShopConfig() {
		this.remove(reservedKey.SHOP_CONFIG);
	}

	removeMenuConfig() {
		this.remove(reservedKey.MENU_CONFIG);
	}

	registerVolatileData(k) {
		window.onbeforeunload = () => {
			this.remove(k);
		};
	}

	registerVolatileAll() {
		window.onbeforeunload = () => {
			// 移除该模块下所有数据
			this.clear();
		};
	}

	registerShopVolatile() {
		this.registerVolatileData(reservedKey.SHOP_CONFIG);
	}

	registerMenuVolatile() {
		this.registerVolatileData(reservedKey.MENU_CONFIG);
	}
}

export default EasyCache;
