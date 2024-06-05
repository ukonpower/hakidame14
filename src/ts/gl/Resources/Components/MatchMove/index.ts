import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import matchMoveVert from './shaders/matchMove.vs';
import matchMoveFrag from './shaders/matchMove.fs';
import matchMoveLineVert from './shaders/matchMoveLine.vs';

import { gl, globalUniforms } from '~/ts/gl/GLGlobals';

export class MatchMove extends MXP.Component {

	private compute: MXP.GPUCompute;
	private markerEntity: MXP.Entity;
	private lineEntity: MXP.Entity;

	constructor() {

		super();

		const size = new GLP.Vector( 100 + 1, 70 );

		/*-------------------------------
			Compute
		-------------------------------*/

		this.compute = new MXP.GPUCompute({
			passes: [
				new MXP.GPUComputePass({
					gl,
					size,
					layerCnt:1
				})
			]
		})

		/*-------------------------------
			Marker
		-------------------------------*/

		// geometry

		const markerGeometry = new MXP.Geometry();

		markerGeometry.setAttribute( 'position', new Float32Array( [
			- 0.5, 0.5, 0.0,
			0.5, 0.5, 0.0,
			0.5, - 0.5, 0.0,
			- 0.5, - 0.5, 0.0,

			0.0, - 0.05, 0.0,
			0.2, - 0.2, 0.0,
			- 0.2, - 0.2, 0.0,

			0.0, 0.05, 0.0,
			0.2, 0.2, 0.0,
			- 0.2, 0.2, 0.0,
		] ), 3 );

		markerGeometry.setAttribute( 'index', new Uint8Array( [
			0, 1,
			1, 2,
			2, 3,
			3, 0,

			4, 5,
			4, 6,

			7, 8,
			7, 9,
		] ), 1 );

		const makerIdArray = [];

		for ( let i = 0; i < size.y; i ++ ) {

			makerIdArray.push( i / size.y, 0.0, 0.0 );

		}

		markerGeometry.setAttribute( 'id', new Float32Array( makerIdArray ), 1, { instanceDivisor: 1 } );
		
		// material

		const markerMaterial = new MXP.Material( {
			phase: [ "forward" ],
			frag: MXP.hotGet( "matchMoveFrag", matchMoveFrag ),
			vert: MXP.hotGet( "matchMoveVert", matchMoveVert ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			drawType: "LINES"
		} );

		// marker entity

		this.markerEntity = new MXP.Entity({name: "Marker"});
		this.markerEntity.addComponent( markerGeometry );
		this.markerEntity.addComponent( markerMaterial );

		/*-------------------------------
			Line
		-------------------------------*/

		// geometry

		const lineGeometry = new MXP.Geometry();

		const lineUVArray = [];
		const lineidArray = [];
		const lineIndexArray = [];

		for ( let i = 0; i < ( size.x - 1 ); i ++ ) {

			lineUVArray.push( ( i + 1 ) / ( size.x - 1 ), 0 );

			if ( i < size.x - 2 ) {

				lineIndexArray.push( i, i + 1 );

			}

		}

		for ( let i = 0; i < size.y; i ++ ) {

			lineidArray.push( i / size.y );

		}

		lineGeometry.setAttribute("uv", new Float32Array( lineUVArray ), 2);
		lineGeometry.setAttribute("index", new Uint16Array( lineIndexArray ), 1);
		lineGeometry.setAttribute("id", new Float32Array( lineidArray ), 1, {instanceDivisor: 1});

		// material

		const lineMaterial = new MXP.Material( {
			phase: [ "forward" ],
			frag: MXP.hotGet( "matchMoveLineFrag", matchMoveFrag ),
			vert: MXP.hotGet( "matchMoveVert", matchMoveLineVert ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			drawType: "LINES"
		} );

		// line entity

		this.lineEntity = new MXP.Entity({name: "Line"});
		this.lineEntity.addComponent( lineGeometry );
		this.lineEntity.addComponent( lineMaterial );

	}

	static get key(): string {

		return "matchMove";

	}


	public setEntity( entity: MXP.Entity ): void {

		entity.addComponent( this.compute );

		entity.add( this.markerEntity );
		entity.add( this.lineEntity );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.compute )

		entity.remove( this.markerEntity );
		entity.remove( this.lineEntity );

	}

}
