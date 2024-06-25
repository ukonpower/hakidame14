import * as GLP from 'glpower';

import { Font1Renderer } from './Font1Renderer';

type TFont = {
    pointType: string;
    pointPos: string;
    charset: string;
    grid: number[];
}

const FONT_DATA: TFont = {
	"pointType": "YAACZA==,YIA=,YAAB,YAAAAIA=,YBA=,YAAABA==,YAAAAAI=,YBA=,YAACZA==,YAAAAIA=,YLI=,YAATIA==,YAAB,YACA,YBZA,YLI=,YAAABA==,ZZZA,ZZZA,YABA,ZYI=,YIA=,YAI=,YBA=,YAAC,YAAI,YAACZA==,YAALIA==,YAAABA==,ZZA=,YABA,YIA=,YAI=,ZZA=,YLI=,YBA=,YAAAABA=,YAALQA==,ZZA=,ZZA=,ZA==,ZA==,ZA==,ZA==,ZZA=,YBA=,YBA=,ZA==,YAAAIA==,ZZZZ,ZZA=,ZZA=",
	"pointPos": "KCENpusjHCuA,DIDt,IHBFNUjqwA==,LHBFNUYipvrj,EvFjpA==,KGAOTbpvrjcA,NFDHVjrvpibTPVA=,EOAGuA==,KCENpusjHVbA,LbhdVHBFNptr,FqDwdhA=,JqAENapuaVA=,INFBHjrvpA==,GqAENpuA,GGAqwVbA,FGAqbVA=,KNECHjrvpbZA,GAqVbGwA,GDtCEsuA,GGpusjcA,FBrFWwA=,DAqw,FqAfGwA=,EqAwGA==,IHCENpusjA==,HqAENUZV,KENpusjHCfwA,JqAENUZVZwA=,KNFBHOipvrjA,EAGDtA==,GAjsupGA,DAtG,FArRvGA=,EAwGqA==,FAYGYtA=,EAGqwA==,MvrjAFNpgeQSgA==,JICEMTYfmtA=,EPTdhA==,EKRfmA==,CFrA,CkrA,CXZA,ClrA,EVbKmA==,ECMosA==,EEIkuA==,CBIA,JwPIDMjruiA=,IOUciCrFuA==,EBICJA==,EDfmtA==",
	"charset": "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@?=:/.-,+)('&#\"!",
	"grid": [
		8,
		8
	]
};

const decodeFont = ( fontData: TFont ) => {

	const { pointType, pointPos, grid, charset } = fontData;

	const typeArray = pointType.split( ',' );
	const shapeArray = pointPos.split( ',' );

	const base64Decode = ( base64String: string ) => {

		const binaryString = atob( base64String );

		const uint8Array = new Uint8Array( binaryString.length );

		for ( let i = 0; i < binaryString.length; i ++ ) {

			uint8Array[ i ] = binaryString.charCodeAt( i );

		}

		return uint8Array;

	};

	const decodeArray = ( uint8Array: Uint8Array, bit: number ) => {

		let binaryString = '';

		uint8Array.forEach( byte => {

			binaryString += byte.toString( 2 ).padStart( 8, '0' );

		} );

		const array = [];

		for ( let i = 0; i < binaryString.length; i += bit ) {

			array.push( parseInt( binaryString.slice( i, i + bit ), 2 ) );

		}

		return array;

	};

	const out: {[key: string]: number[] } = {};

	for ( let i = 0; i < typeArray.length; i ++ ) {

		const type = typeArray[ i ];
		const resType = decodeArray( base64Decode( type ), 3 );

		const shape = shapeArray[ i ];
		const resShape = decodeArray( base64Decode( shape ), 6 );

		const pathLength = resShape.shift() || 0;

		const res = [];

		for ( let i = 0; i < pathLength; i ++ ) {

			res.push(
				resType[ i ],
				( resShape[ i ] % ( grid[ 0 ] - 1 ) + 1 ) / ( grid[ 0 ] ),
				( Math.floor( resShape[ i ] / ( grid[ 0 ] - 1 ) ) + 1 ) / ( grid[ 1 ] )
			);

		}

		out[ charset[ i ] ] = res;

	}

	return out;

};

export class Font1 extends GLP.GLPowerTexture {

	constructor( gl: WebGL2RenderingContext ) {

		super( gl );

		const renderer = new Font1Renderer();

		const data = decodeFont( FONT_DATA );

		const charCanvas = document.createElement( 'canvas' );
		charCanvas.width = 64;
		charCanvas.height = 100;
		const charContext = charCanvas.getContext( '2d' )!;

		const texCanvas = document.createElement( 'canvas' );
		texCanvas.width = charCanvas.width * FONT_DATA.charset.length;
		texCanvas.height = charCanvas.height;
		const texContext = texCanvas.getContext( '2d' )!;

		for ( let i = 0; i < FONT_DATA.charset.length; i ++ ) {

			const char = FONT_DATA.charset[ i ];

			charContext.clearRect( 0, 0, charCanvas.width, charCanvas.height );

			renderer.render( charContext, data[ char ] );

			texContext.drawImage( charCanvas, i * charCanvas.width, 0 );

		}

		renderer.render( charContext, data[ 'D' ] );

		// debug

		const wrapper = document.createElement( 'div' );
		wrapper.style.position = 'absolute';
		wrapper.style.top = '0';
		wrapper.style.left = '0';
		wrapper.style.width = '100vw';
		wrapper.style.zIndex = '1000';
		document.body.appendChild( wrapper );

		texCanvas.style.width = '100%';

		wrapper.appendChild( texCanvas );

	}

}
