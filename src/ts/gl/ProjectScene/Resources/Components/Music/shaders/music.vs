#include <common>

#include <noise>

in float aTime;

out float o_left;
out float o_right;

uniform float uDuration;
uniform float uSampleRate;
uniform float uTimeOffset;

uniform float uBPM;

/*-------------------------------
	Utils
-------------------------------*/

float whiteNoise(float time)
{
    return fract(sin(dot(vec2( time ), vec2(12.9898,78.233))) * 43758.5453);
}


float saw(float time){

    return fract(-time)*2.-1.;
	
}

float square( float time) {

	return sign( fract( time ) - 0.1 );
	
}

float tri(float time ){
    return abs(2.*fract(time*.5-.25)-1.)*2.-1.;
}

float ssin(float time ) {
	return sin( time * TPI );
}

float s2f( float scale ){

	return 440.0 * pow( 1.06, scale );
	
}

float slope( float value, float slope ) {

	if( value >= 0.0 ) {

		return linearstep( 0.0, 1.0 - slope, value );

	} else {

		return linearstep( 0.0, -1.0 + slope, value ) * -1.0;
		
	}

	return 0.0;
	
}

bool isin( float time, float start, float end ) {

	return start <= time && time <= end;
	
}

/*-------------------------------
	clap
-------------------------------*/

float clap( float time, float loop ) {

	float envTime = fract(loop) * 7.0;

	float o = 0.0;
	
	float env = exp( envTime * - 5.0 );
	
	o += fbm( time * 3000.0 ) * env * 1.3;
	
	return o;

}

// vec2 clap1( float time, float loop ) {

// 	vec2 o = vec2( 0.0 );

// 	float l = loop;

// 	o += clap( time, l );
// 	// * float[]( 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0  )[int(l)];
	
// 	return o * 0.5;

// }


vec2 moistclap( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	float l = loop;

	float tt = floor( loop * 16.0 ) / 16.0;


	for(int i = 0; i < 8; i++){

		o += clap( time, l - (1.0 / 8.0) * float( i ) ) * step( 0.5, fbm( tt + float( i ) ) );
		
	}
	
	return o * 0.5;

}


/*-------------------------------
	Hihat
-------------------------------*/

float hihat( float time, float loop ) {

	return noise(time * 22000.0) * max(0.0,1.0-min(0.85,loop*4.25)-(loop-0.25)*0.3);

}

vec2 hihat1( float time, float loop ) {
	
	vec2 o = vec2( 0.0 );

	float l4 = loop * 4.0;
	float fl = fract( loop / 4.0 );

	float p = mod( floor( fl * 16.0 ), 2.0 ) + 0.5;

	o += hihat( time, fract( l4 ) ) * p;
	o *= 0.02;
	
	return o;
  
}

/*-------------------------------
	Kick
-------------------------------*/

float kick( float time, float loop ) {

	float envTime = fract( loop );

	float t = time;
	t -= 0.1 * exp( -70.0 * envTime );
	t += 0.1;

	float o = ( linearstep( -0.8, 0.8, sin( t * 150.0 ) ) * 2.0 - 1.0 ) * smoothstep( 1.0, 0.0, envTime );
	o *= 0.20;

    return o;

}

vec2 kick1( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	float loop2 = loop - 0.25;
	float loop3 = loop - 0.5;

	o += kick( time, loop ) * float[]( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0  )[int( loop )];

	return o;

}

vec2 deepKick( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	float envTime = fract( loop );
	float env = smoothstep( 1.0, 0.0, envTime );

	float t = time;
	t -= exp( -5.0 * envTime );

	o += slope(
		sin( t * 130.0 + sin( t * 100.0 ) * 1.0 ), 0.5
	)* env;

	o *= 0.1;

	return o;

}

/*-------------------------------
	BASSS
-------------------------------*/

float bass( float time, float loop, float freq ) {

	float envTime = fract( loop );

	float t = time;
	float tt = t * (s2f(-48.0) * freq);
	float o = slope( ssin( tt ), 0.6 ) * abs(ssin( tt * 0.5 )); 
	o *= smoothstep( 0.9, 0.8, envTime ) *  0.3 * (freq > 0.0 ? 1.0 : 0.0);

    return o;

}

vec2 bass1( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	float l = loop / 4.0;

	o += bass( time, l, float[]( 1.0, 0.9 )[int( l )] );

	return o;

}

/*-------------------------------
	dada
-------------------------------*/

vec2 dada( float time, float loop ) {

	int index = int( loop );
	float envTime = fract( loop );
	float w = mod(envTime * 2.0, 1.0);

	vec2 o = vec2( 0.0 );

	for( int i = 0; i < 6; i ++ ) {

		float fi = float( i ) / 6.0;
		float frec = s2f(4.0 + float(i) * 12.0 ) * pow( 0.5, 4.0 ); 

		float v = saw( time * frec + ssin( w * 20.0 ) + TPI * fi ) * abs( pow( sin( w * TPI ), 3.0 ));

		o.x += v * ( sin( fi * TPI ) * 0.5 + 0.5 );
		o.y += v * ( cos( fi * TPI ) * 0.5 + 0.5 );

		frec = s2f(4.0 + float(i) * 12.0 ) * pow( 0.5, 10.0 ); 
		v = tri( time * frec + ssin( w * 21.0 ) + TPI * fi ) * abs( pow( sin( w * TPI ), 1.0 )) * 0.8;

		o.x += v * ( sin( PI / 2.0 + fi * TPI ) * 0.5 + 0.5 );
		o.y += v * ( cos( PI / 2.0 + fi * TPI ) * 0.5 + 0.5 );

	}

	o *= isin(loop, 7.0, 8.0 ) ? 1.0 : 0.0 ;

	o *= 0.05;

	return o;
	
}

/*-------------------------------
	faaa
-------------------------------*/

const float mainCord[] = float[](
	4.0, 6.0, 7.0, 6.0,
	7.0, 9.0, 11.0, 6.0,
	11.0, 13.0, 14.0, 13.0
);

vec2 faaa( float time, float loop ) {

	int index = int( loop );
	float envTime = fract( loop );

	vec2 o = vec2( 0.0 );

	for( int i = 0; i < 3; i ++ ) {

		float scale = mainCord[ index + 4 * i ];
		float freq = s2f(scale - 12.0); 

		// o += ( sin( time * freq ) + sin( time * freq * 1.007 ) );
		o += tri( time * freq ) * 0.5; 

	}

	o *= 0.05;

	return o;
	
}

/*-------------------------------
	turnAround
-------------------------------*/

const float TACODE[] = float[](
	4.0, 2.0, 0.0, 2.0,
	7.0, 6.0, 4.0, 6.0,
	11.0, 11.0, 9.0, 11.0
);

vec2 turnAround( float time, float loop ) {

	int index = int( loop );

	vec2 o = vec2( 0.0 );

	float l8 = loop * 12.0;
	float l4 = loop * 2.0;

	float l = l4 - exp( -( mod(loop, 8.0) / 4.0 ) * 11.8 ) * 8.0;

	float w = smoothstep( 0.0, 0.01, ssin( l ) );

	for( int i = 0; i < 3; i ++ ) {

		float scale = TACODE[ int(loop / 4.0) + 4 * i ];
		float freq = s2f(scale - 24.0 ); 

		o += saw( time * freq ) * w ; 

	}

	o *= 0.03;

	return o;
	
}

/*-------------------------------
	Try
-------------------------------*/

const float KODAMA_CODE[] = float[](
	-24.0, 0.0, 0.0, 0.0,
	-5.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0,
	3.0, 0.0, 0.0, 0.0
);

vec2 kodama( float time, float loop ) {

	int index = int( loop );

	vec2 o = vec2( 0.0 );

	float w = smoothstep( 0.0, 1.0, ssin( mod(loop, 8.0) * 4.0 ) );

	for( int i = 0; i < 4; i ++ ) {

		float scale = KODAMA_CODE[ int(0.0 / 4.0) + 4 * i ];

		float freq = s2f(scale - 12.0 - 3.0 ); 
		o += ssin( (time) * freq ) * w ; 

	}

	o *= 0.03;

	return o;
	
}

/*-------------------------------
	Try
-------------------------------*/

const float CODE[] = float[](
	-24.0, 2.0, 0.0, 2.0,
	-5.0, 6.0, 4.0, 6.0,
	0.0, 11.0, 9.0, 11.0,
	3.0, 11.0, 9.0, 11.0
);

vec2 justDoIt( float time, float loop ) {

	int index = int( loop );

	vec2 o = vec2( 0.0 );

	float w = smoothstep( 0.0, 1.0, ssin( mod(loop, 8.0) * 4.0 ) );

	for( int i = 0; i < 4; i ++ ) {



	}

	o *= 0.03;

	return o;
	
}


vec2 music( float time ) {

	float t = time * (uBPM / 60.0);
	t = max( 0.0, t - 0.0 );

	float loop1 = fract( t );
	
	float loop4 = mod( t, 4.0 );
	float loop4Phase = floor( loop4 );

	float loop8 = mod( t, 8.0 );
	float loop8Phase = floor( loop8 );

	float loop16 = mod( t, 16.0 ); 
	float loop16Phase = loop16 / 16.0;
	
	float loop32 = mod( t, 32.0 );
	float loop32Phase = t / 32.0;

	vec2 o = vec2( 0.0 );

	// click -------

	// o += step( fract( loop4 ), 0.1 ) * ssin( time * s2f(3.0) * 2.0 ) * 0.03;
	// o += step( fract( loop4 / 4.0 ), 0.05 ) * ssin( time * s2f(12.0) * 2.0 ) * 0.02;

	// -------------

	o += kick1( t, loop8 );

	// o += bass1( t, loop8 );

	o += moistclap( t, loop16 );

	// o += dada( t, loop8 );

	// o += hihat1( t, loop8 );

	// o += turnAround( t, loop16 );

	// o += kodama( t, loop16 );

	o += justDoIt( t, loop16 );

	return o;
	
}

void main( void ) {

	float time = (aTime / uSampleRate ) + uTimeOffset;

	vec2 o = music( time );

	o_left = o.x;
	o_right = o.y;

}