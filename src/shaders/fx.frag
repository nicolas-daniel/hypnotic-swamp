precision highp float;

uniform vec3 startColor;
uniform vec3 endColor;
uniform float lineWidth;
uniform float margin;
uniform float iGlobalTime;
uniform int speed;

varying vec3 vPosition;

float rand(vec2 seed) {

    float dotResult = dot(seed.xy, vec2(12.9898,78.233));
    float sin = sin(dotResult) * 43758.5453;
    return fract(sin);

}

void main() {

    vec4 finalColor = vec4(1.0, 1.0, 1.0, 1.0);

    if (speed == 1) {

        float index = mod( floor( vPosition.z ), 8.0 );

        if (index <= 1.0) {
            finalColor = vec4(234.0/255.0, 34.0/255.0, 94.0/255.0, 1.0);
        } else if (index <= 2.0) {
            finalColor = vec4(237.0/255.0, 91.0/255.0, 53.0/255.0, 1.0);
        } else if (index <= 3.0) {
            finalColor = vec4(246.0/255.0, 181.0/255.0, 47.0/255.0, 1.0);
        } else if (index <= 4.0) {
            finalColor = vec4(129.0/255.0, 197.0/255.0, 64.0/255.0, 1.0);
        } else if (index <= 5.0) {
            finalColor = vec4(0.0/255.0, 163.0/255.0, 150.0/255.0, 1.0);
        } else if (index <= 6.0) {
            finalColor = vec4(22.0/255.0, 116.0/255.0, 188.0/255.0, 1.0);
        } else if (index <= 7.0) {
            finalColor = vec4(97.0/255.0, 46.0/255.0, 141.0/255.0, 1.0);
        } else {
            finalColor = vec4(194.0/255.0, 34.0/255.0, 134.0/255.0, 1.0);
        }

    } else {

        vec4 sample = vec4(0,0,0,1);
        vec4 lineColor = vec4(1.0,1.0,1.0,1.0);
        float minFactor = 0.5;
        float maxFactor = 0.2;
        float totalLineNumber = 6.0;

        float y = float(int(vPosition.z * totalLineNumber)) / totalLineNumber;
        float factor = rand(vec2(0,y)) * (maxFactor-minFactor) + minFactor;
        finalColor = mix(sample, lineColor, factor);

    }

    gl_FragColor = finalColor;

}