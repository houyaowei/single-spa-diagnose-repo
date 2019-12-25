import {Inject} from 'angular-es-utils';


@Inject('$rootScope', '$state', '$window')
export default class MainController {

  constructor(){
    this.loaded = true;
    this.name = "single-spa-diagnose-repo";
    
    this.menusOptions = {
			unfold: true,
			shops: false,
			menusResource: [],
			onUnfold: ()=> {

			}
		}
  }
}