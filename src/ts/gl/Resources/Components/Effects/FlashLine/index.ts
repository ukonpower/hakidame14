import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import flFrag from './shaders/flashLine.fs';
import flVert from './shaders/flashLine.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class FlashLine extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.CylinderGeometry({radiusBottom: 0.02, radiusTop: 0.02, radSegments: 8, height: 30.0});

		let oPosArray = []

		let num = 32;

		// let range = new Math.random();
		
		for (let index = 0; index < num; index++) {

			let rnd = GLP.Maths.randomVector().multiply(new GLP.Vector(5.0,1,5.0))
			
			oPosArray.push(
				rnd.x,rnd.y,rnd.z, Math.random()
			)
			
		}
		
		this.geometry.setAttribute("oPos", new Float32Array(oPosArray), 4, {instanceDivisor: 1} )

		// material

		this.material = new MXP.Material( {
			type: ["forward"],
			frag: MXP.hotGet( "flFrag", flFrag ),
			vert: MXP.hotGet( "flVert", flVert ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/flashLine.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'flFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/flashLine.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'flVert', module.default );

					this.material.requestUpdate();

				}

			} );

		}

	}

	static get key(): string {

		return "flashLine";

	}


	public setEntity( entity: MXP.Entity ): void {

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

	}

}
