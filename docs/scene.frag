#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uPlate;
uniform sampler2D uFlow;
uniform sampler2D uFoam;
uniform vec4 uCam;      // visible map rect in UV: x0, y0, w, h
uniform vec2 uRes;      // canvas size in pixels
uniform vec2 uMap;      // map size in source pixels (848, 1264)
uniform float uTime;
uniform float uMotion;  // 1 = animated, 0 = calm mode
uniform vec3 uRip[8];   // screen uv x, y (top-left origin), age in seconds

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x), f.y);
}
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.03+vec2(7.1,3.7); a*=0.5; } return v; }

void main(){
  vec2 s = gl_FragCoord.xy / uRes;
  s.y = 1.0 - s.y;
  vec2 uv = uCam.xy + s*uCam.zw;
  vec2 px = uv*uMap;                      // position in source pixels
  vec4 F = texture2D(uFlow, uv);
  vec2 fl = F.rg*2.0 - 1.0;               // direction * speed
  float water = smoothstep(0.15, 0.6, F.b);
  float foam = texture2D(uFoam, uv).r;
  float spd = length(fl);
  vec3 base = texture2D(uPlate, uv).rgb;
  vec3 col = base;

  float t = uTime*uMotion;
  if (water > 0.01) {
    // flow-map advection: two phases cross-faded so the loop never jumps
    float ph = noise(px*0.045)*0.6;
    float p0 = fract(t*0.42 + ph);
    float p1 = fract(t*0.42 + ph + 0.5);
    vec2 d = fl*30.0/uMap;
    vec3 a = texture2D(uPlate, uv - d*p0).rgb;
    vec3 b = texture2D(uPlate, uv - d*p1).rgb;
    vec3 moving = mix(a, b, abs(0.5-p0)/0.5);

    // churning foam that travels with the current
    vec2 q0 = px*0.11 - fl*p0*9.0;
    vec2 q1 = px*0.11 - fl*p1*9.0;
    float churn = mix(fbm(q0), fbm(q1+7.3), abs(0.5-p0)/0.5);
    moving += vec3(0.85,0.97,1.0)*smoothstep(0.52,0.80,churn)*foam*0.22*uMotion;

    // fast vertical streaks on the falls
    float fall = smoothstep(0.75, 0.95, fl.y) * smoothstep(0.7, 0.95, spd) * smoothstep(30.0, 50.0, px.y);
    float st = fbm(vec2(px.x*0.42, px.y*0.035 - t*2.6)) * 0.6 + noise(vec2(px.x*1.1, px.y*0.08 - t*3.8))*0.4;
    moving += vec3(0.9,0.98,1.0)*smoothstep(0.50,0.85,st)*fall*0.32*uMotion;

    // glints on calm water
    float calm = 1.0 - smoothstep(0.2, 0.5, spd);
    float gl = pow(noise(vec2(px.x*0.55, px.y*0.9) + vec2(0.0, -t*0.6)), 24.0);
    moving += vec3(0.9,1.0,1.0)*gl*calm*(1.0-foam)*0.9*uMotion;

    col = mix(base, moving, water);
  }

  // cursor ripples, only on water
  float ring = 0.0;
  float asp = uRes.x/uRes.y;
  for (int i=0;i<8;i++){
    vec3 r = uRip[i];
    if (r.z > 0.0) {
      float dd = length(vec2((s.x-r.x)*asp, s.y-r.y));
      ring += sin(dd*80.0 - r.z*9.0) * exp(-r.z*1.4) * exp(-dd*7.0) * smoothstep(0.0, 0.025, dd);
    }
  }
  col += vec3(0.55,0.85,0.95)*ring*water*0.22;

  // drifting mist at the plunge pool and the lower cascade
  vec2 m1 = (px - vec2(420.0, 255.0))/vec2(230.0, 70.0);
  vec2 m2 = (px - vec2(650.0, 945.0))/vec2(110.0, 55.0);
  float mist = exp(-dot(m1,m1))*0.55 + exp(-dot(m2,m2))*0.40;
  mist *= 0.55 + 0.9*fbm(px*0.012 + vec2(t*0.05, -t*0.11));
  col += vec3(0.80,0.93,0.96)*mist*0.22*(0.6+0.4*uMotion);

  float vg = smoothstep(1.25, 0.35, length((s-0.5)*vec2(1.0,1.1)));
  col *= mix(0.72, 1.0, vg);
  gl_FragColor = vec4(col, 1.0);
}
