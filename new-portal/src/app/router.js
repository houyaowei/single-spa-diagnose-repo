
export default function appRouter(
	$httpProvider,
	$locationProvider
) {
	// ccAreaSelectorProvider.configSetting(UALAPI + '/shuyun-searchapi/1.0/area');
	$httpProvider.defaults.withCredentials = true;
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false,
		rewriteLinks: false
	}).hashPrefix("");
	Object.freeze($httpProvider);
}
appRouter.$inject = [
	"$httpProvider",
	"$locationProvider"
];
