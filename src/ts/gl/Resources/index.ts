
import * as MXP from 'maxpower';

type ComponentArgs = {[key: string]: any}
import * as GLP from 'glpower';

export type ResouceComponentItem = {
	key: string;
	component: typeof MXP.Component;
	defaultArgs?: ComponentArgs
};

export class OREngineResource extends GLP.EventEmitter {

	public comListCats: Map<string, ( ResouceComponentItem )[]> = new Map();
	public componentList: ( ResouceComponentItem )[] = [];

	constructor() {

		super();

	}

	static get key(): string {

		return "blidgeClient";

	}


	public getComponent( name: string ) {

		return this.componentList.find( c =>{

			return c.component.name == name;

		} );

	}

	public clearComponents() {

		this.componentList = [];

		this.comListCats.clear();

	}

	public componentCategory( catName: string ) {

		const catCompList = this.comListCats.get( catName ) || [];

		this.comListCats.set( catName, catCompList );

		return {
			register: ( component: typeof MXP.Component, defaultArgs?: ComponentArgs ) => {

				const compItem = {
					key: component.key,
					component,
					defaultArgs
				};

				this.componentList.push( compItem );

				catCompList.push( compItem );

			}
		};

	}

}


