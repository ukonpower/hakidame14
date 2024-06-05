#include <common>
#include <vert_h>

// layout(location = 5) in float id;

// uniform sampler2D uComBuf;
// uniform vec2 uComputeSize;

void main( void ) {

	#include <vert_in>

	// outPos += id;

	// float size = smoothstep( 1.0, 0.5, computeBuffer.z) * 2.0 + 0.015;
	// size *= 0.2 + id.x * 2.0;

	// gl_Position = vec4( computeBuffer.xyz, 1.0 );
	// gl_Position.xy += pos.xy * vec2( 1.0, uAspectRatio ) * ( 0.5 + v * 0.5 ) * size;
	// gl_Position.z = 0.0;
	
	#include <vert_out>

}