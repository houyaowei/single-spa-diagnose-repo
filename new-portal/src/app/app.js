import angular from "angular";
import ngResource from "angular-resource";
import ngSanitize from "angular-sanitize";
import router from "./router";
import commonDirectve from "../components";
import insert from "./insert";

import "../assets/css/index.less";

var webApp = angular.module("ccmsApp", [
		ngSanitize,
		ngResource,
		commonDirectve,
		insert
]);

webApp.config(router);

