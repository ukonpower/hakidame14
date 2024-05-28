import * as MXP from 'maxpower';

import skyboxFrag from './shaders/skybox.fs';

import { globalUniforms } from '~/ts/Globals';

interface SkyBoxParams extends MXP.ComponentParams {
}

export class SkyBox extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor( param?: SkyBoxParams ) {

		param = param || {};

		super();

		this.geometry = new MXP.CylinderGeometry( { height: 100, radiusTop: 20, radiusBottom: 20, heightSegments: 10, radSegments: 32, caps: false } );
		this.material = new MXP.Material( {
			type: [ "deferred", "envMap" ],
			frag: MXP.hotGet( "skybox", skyboxFrag ),
			cullFace: false,
			uniforms: globalUniforms.time
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/skybox.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'skybox', module.default );

					this.material.requestUpdate();

				}

			} );

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( "geometry", this.geometry );
		entity.addComponent( "material", this.material );

	}

}
