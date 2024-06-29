import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Font1 } from '../../Fonts/Font1';

import textFrag from './shaders/text.fs';
import textVert from './shaders/text.vs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Text extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	private interval: number;

	constructor() {

		super();

		const font = resource.getFont( Font1 )!;

		// geometry

		this.geometry = new MXP.PlaneGeometry();

		this.geometry.setAttribute( "uvMatrix", new Float32Array( [
			...new GLP.Matrix().elm.concat(),
			// ...new GLP.Matrix().elm.concat(),
			// ...new GLP.Matrix().elm.concat(),
			// ...new GLP.Matrix().elm.concat(),
		] ), 16, {
			instanceDivisor: 1
		} );

		this.geometry.setAttribute( "geoMatrix", new Float32Array( [
			...new GLP.Matrix().applyScale( new GLP.Vector( 1, 1, 1 ) ).elm.concat(),
			// ...new GLP.Matrix().applyScale( new GLP.Vector( 1, 1, 1 ) ).elm.concat(),
			// ...new GLP.Matrix().applyScale( new GLP.Vector( 1, 1, 1 ) ).elm.concat(),
			// ...new GLP.Matrix().applyScale( new GLP.Vector( 1, 1, 1 ) ).elm.concat(),
		] ), 16, {
			instanceDivisor: 1
		} );


		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'textFrag', textFrag ),
			vert: MXP.hotGet( 'textVert', textVert ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time, {
				uTex: {
					value: font.texture,
					type: '1i'
				}
			} )
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

		this.interval = window.setInterval( () => {

			this.setText( Math.floor( Math.random() * 10000.0 ).toString() );

		}, 1000 );

	}

	static get key(): string {

		return 'text';

	}

	public setText( text: string ): void {

		console.log( text );


		const font = resource.getFont( Font1 )!;

		const uvMatrixArray = [];
		const geoMatrixArray = [];

		for ( let i = 0; i < text.length; i ++ ) {

			const c = text[ i ];

			const uvMatrix = font.matrices.get( c );

			if ( uvMatrix ) {

				uvMatrixArray.push( ...uvMatrix.uv.elm );
				geoMatrixArray.push( ...uvMatrix.geo.elm );

			}

		}

		this.geometry.setAttribute( "uvMatrix", new Float32Array( uvMatrixArray ), 3, {
			instanceDivisor: 1
		} );


		this.geometry.setAttribute( "geoMatrix", new Float32Array( geoMatrixArray ), 3, {
			instanceDivisor: 1
		} );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

	}

	public dispose(): void {

		super.dispose();
		window.clearInterval( this.interval );

	}

}
