#include <common>
#include <packing>
#include <frag_h>

#include <sdf>
#include <noise>
#include <rotate>
#include <light_h>

uniform float uTimeE;

uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;
uniform vec2 uResolution;
uniform float uAspectRatio;

vec2 D( vec3 p ) {

	vec2 d = vec2( 99999.0, 0.0 );
	float n = noiseCyc( p * 1.3 + uTimeE * 0.5 ).x;
	float radius = 0.7 + n * 0.2;

	d = add( d, vec2( sdSphere( p, radius ), 1.0 ) );
	
	return d;

}

vec3 N( vec3 pos, float delta ){

    return normalize( vec3(
		D( pos ).x - D( vec3( pos.x - delta, pos.y, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y - delta, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y, pos.z - delta ) ).x
	) );
	
}

void main( void ) {

	#include <frag_in>

	vec3 rayPos = ( modelMatrixInverse * vec4( vPos, 1.0 ) ).xyz;
	vec3 rayDir = normalize( ( modelMatrixInverse * vec4( normalize( vPos - cameraPosition ), 0.0 ) ).xyz );
	vec2 dist = vec2( 0.0 );
	bool hit = false;

	vec3 normal;
	
	for( int i = 0; i < 32; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir;

		if( dist.x < 0.01 ) {

			normal = N( rayPos, 0.0001 );

			hit = true;
			break;

		}
		
	}

	if( dist.y == 1.0 ) {
		
		outRoughness = 1.0;
		outMetalic = 0.0;
		outColor.xyz = vec3( 1.0, 1.0, 1.0 );
		
	} else if( dist.y == 0.0 ) {

		outEmission =  vec3( 1.0, 0.7, 0.7 ) * smoothstep( 0.0, 1.0, dot( normal, -rayDir ) );
		
	} 

	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;

	outColor = vec4( 0.0, 0.0, 0.0, 1.0 );

	#ifdef IS_FORWARD

		vec2 uv = gl_FragCoord.xy / uResolution;

		for( int i = 0; i < 4; i++ ) {

			vec2 v = ( normal.xy ) * 0.1;// * ( 0.1 + ( float(i) / 4.0 ) * 0.015 );
			// v.x *= uAspectRatio;
			// v *= 0.0;
			outColor.x += texture( uDeferredTexture, uv + v * 1.0 ).x;
			outColor.y += texture( uDeferredTexture, uv + v * 1.1 ).y;
			outColor.z += texture( uDeferredTexture, uv + v * 1.2 ).z;

		}

		outColor.xyz /= 4.0;
		outColor.xyz *= vec3( 1.0, 0.5, 0.5 );
		outColor.xyz += fresnel( dot( outNormal, -rayDir ) ) * 0.4;

	#endif

	outPos = ( modelMatrix * vec4( rayPos, 1.0 ) ).xyz;

	#include <frag_out>

}