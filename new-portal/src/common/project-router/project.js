import uiRouter from 'angular-ui-router';
import 'ui-router-extras';
import ocLazyLoad from 'oclazyload';
import angular from 'angular';
$ProjectProvider.$inject = ['$futureStateProvider'];
function $ProjectProvider($futureStateProvider) {

	/**
   * @param {String} html 项目入口 html 模板
   *
   * @typedef {Object} ProjectInfo
   * @prop {Array} scripts
   * @prop {String} template
   *
   * @returns {ProjectInfo}
   */
	function getProjectInfo(html) {
		const SCRIPT_TAG_REGEX = /<script\s+((?!type=('|")text\/ng-template('|")).)*>.*<\/script>/gi;
		const SCRIPT_SRC_REGEX = /.*\ssrc=("|')(\S+)\1.*/;
		const SCRIPT_SEQ_REGEX = /.*\sseq=("|')(\S+)\1.*/;
		const scripts = [];
		const template = html.replace(SCRIPT_TAG_REGEX, match => {
			const matchedScriptSeq = match.match(SCRIPT_SEQ_REGEX);
			const matchedScriptSrc = match.match(SCRIPT_SRC_REGEX);
			const seq = (matchedScriptSeq && matchedScriptSeq[2]) || 0;

			scripts[seq] = scripts[seq] || [];

			if (matchedScriptSrc && matchedScriptSrc[2]) {
				scripts[seq].push(matchedScriptSrc[2]);
			}

			return '<!-- script replaced -->';
		});

		return {
			scripts: scripts.filter(script => !!script),
			template
		};
	}

	stateFactory.$inject = ['$q', '$http', '$ocLazyLoad', '$log', 'futureState'];
	function stateFactory($q, $http, $ocLazyLoad, $log, futureState) {

		const loadScripts = scripts => {
			const errorHandle = err => {
				$log.error(err);
				return $q.reject(err);
			};
			let promise = $ocLazyLoad.load(scripts.shift());
			let nextGroup;

			while (scripts.length) {
				nextGroup = scripts.shift();
				promise = promise.then(() => {
					return $ocLazyLoad.load(nextGroup);
				});
			}

			return promise.catch(errorHandle);
		};

		const deferred = $q.defer();

		$http.get(futureState.templateUrl).then(response => {

			const projectInfo = getProjectInfo(response.data);

			const state = {
				name: futureState.name,
				url: futureState.url,
				template: projectInfo.template
			};

			if (projectInfo.scripts.length) {
				loadScripts(projectInfo.scripts).then(() => {
					deferred.resolve(state);
				});
			} else {
				deferred.resolve(state);
			}
		}).catch(err => {
			console.error(`Not found: ${futureState.templateUrl}`, err);
			deferred.reject(err);
		});

		return deferred.promise;
	}

	$futureStateProvider.stateFactory('project', stateFactory);

	this.state = (name, definition) => {
		$futureStateProvider.futureState({
			type: 'project',
			name,
			url: definition.url,
			templateUrl: definition.templateUrl
		});

		return this;
	};

	this.$get = () => {};
}

export default angular
	.module('ccms.projectRouter', [
		uiRouter,
		'ct.ui.router.extras',
		ocLazyLoad
	])
	.provider('$project', $ProjectProvider)
	.name;
