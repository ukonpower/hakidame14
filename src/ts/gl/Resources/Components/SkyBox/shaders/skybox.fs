#include <common>
#include <packing>
#include <frag_h>
#include <noise>
#include <rotate>

uniform float uTimeE;

uniform sampler2D uMusicFreqTex;

void main( void ) {

	#include <frag_in>

	vec3 normal = normalize( - vNormal );

	vec2 uv = vUv;
	uv.y /= PI / 2.0;
	vec2 p = uv;
	float size = 4.0;

	vec3 h;

	for( int i = 0; i < 7; i++ ) {

		p = floor( uv * size ) / size;
		h = hash( vec3( p * 10.0, float( i ) ) );

		if( h.x < 0.3 ) {
			break;
		}

		size *= 2.0;

		uv.y += uTimeE * 0.01;


	}

	float mtd = texture( uMusicFreqTex, vec2( h.z, 0.0 ) ).x;
	mtd = smoothstep( 0.0, 0.5, mtd );

	uv -= p;
	uv *= size;

	float emit = 0.0;
	emit += smoothstep( 0.4, 0.39, length( uv - 0.5 ) * 3.0 - mtd * 1.0);
	emit *= smoothstep( 0.5, 0.0, abs( vUv.y - 0.5 ) );

	outColor.xyz *= 0.0;
	outEmission = vec3( 1.0 );
	outEmissionIntensity = 3.0 * emit * h.y;

	#ifdef IS_FORWARD

		outColor = vec4( outEmission * outEmissionIntensity, 1.0 );
	
	#endif

	#include <frag_out>

} 