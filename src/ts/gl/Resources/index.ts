
import * as GLP from 'glpower';
import * as MXP from 'maxpower';

type ComponentArgs = {[key: string]: any}

export type ResouceComponentItem = {
	key: string;
	component: typeof MXP.Component;
	defaultArgs?: ComponentArgs
};

export class OREngineResource extends GLP.EventEmitter {

	public comListCats: Map<string, ( ResouceComponentItem )[]> = new Map();
	public componentList: ( ResouceComponentItem )[] = [];
	public textures: {[key: string]: GLP.GLPowerTexture} = {};
	public fonts: {[key: string]: GLP.GLPowerTexture} = {};

	constructor() {

		super();

	}

	public clear() {

		this.componentList = [];

		this.comListCats.clear();

		this.textures = {};

	}

	/*-------------------------------
		Component
	-------------------------------*/

	public getComponent( name: string ) {

		return this.componentList.find( c =>{

			return c.component.name == name;

		} );

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

	/*-------------------------------
		Texture
	-------------------------------*/

	public setTexture( key: string, texture: GLP.GLPowerTexture ) {

		this.textures[ key ] = texture;

	}

	public getTexture( key: string ) {

		return this.textures[ key ];

	}

}


