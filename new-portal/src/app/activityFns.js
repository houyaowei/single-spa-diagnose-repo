import * as singleSpa from "single-spa";

export function prefix(location, ...prefixes) {
	 let _href = encodeURIComponent(location.href);
	 console.log("location:" , location.href ,"prefix:",prefixes)
	let res = prefixes.some(prefix => _href.indexOf(`${prefix}`) !== -1);
	console.log(res);
	return res;
}
export function sceneMarkting(location) {
	console.log("activityFns -> sceneMarkting");
	let status = singleSpa.getAppStatus("sceneMarketing");
	if("MOUNTED" == status){
		return;
	}
	return prefix(location, "sceneMarketing");
}
export function cusInsight(location) {
	console.log("activityFns -> cusInsight");
	return prefix(location, "cusInsight");
}
