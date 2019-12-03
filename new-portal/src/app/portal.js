import * as singleSpa from "single-spa";
import * as isActive from "./activityFns";

window.singleSpa = singleSpa;

singleSpa.registerApplication("sceneMarketing", () => {
	return window.System.import ("@portal/sceneMarketing");
}, isActive.sceneMarkting);

singleSpa.registerApplication("cusInsight", () => {
	return window.System.import ("@portal/cusInsight");
}, isActive.cusInsight);

singleSpa.start();
