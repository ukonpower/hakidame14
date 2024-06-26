import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import textFrag from './shaders/text.fs';
import textVert from './shaders/text.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Text extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.PlaneGeometry();

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'textFrag', textFrag ),
			vert: MXP.hotGet( 'textVert', textVert ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/text.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'textFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/text.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'textVert', module.default );

					this.material.requestUpdate();

				}

			} );

		}

	}

	static get key(): string {

		return 'text';

	}


	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

	}

}
