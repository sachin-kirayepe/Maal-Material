(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4883],{6535:function(e,t,r){"use strict";r.d(t,{j:function(){return c}});var n=r(17610),i=r(7653),a=r(86995),o=r(35758);let s={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},l={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},c=i.forwardRef(({scale:e=10,frames:t=1/0,opacity:r=1,width:c=1,height:u=1,blur:d=1,near:f=0,far:h=10,resolution:p=512,smooth:m=!0,color:v="#000000",depthWrite:g=!1,renderOrder:y,...w},b)=>{let x,E;let M=i.useRef(null),_=(0,o.C)(e=>e.scene),S=(0,o.C)(e=>e.gl),P=i.useRef(null);c*=Array.isArray(e)?e[0]:e||1,u*=Array.isArray(e)?e[1]:e||1;let[A,C,T,O,U,L,R]=i.useMemo(()=>{let e=new a.dd2(p,p),t=new a.dd2(p,p);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new a._12(c,u).rotateX(Math.PI/2),n=new a.Kj0(r),i=new a.lRF;i.depthTest=i.depthWrite=!1,i.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new a.Ilk(v)}},e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let o=new a.jyz(s),d=new a.jyz(l);return d.depthTest=o.depthTest=!1,[e,r,i,n,o,d,t]},[p,c,u,e,v]),z=e=>{O.visible=!0,O.material=U,U.uniforms.tDiffuse.value=A.texture,U.uniforms.h.value=1*e/256,S.setRenderTarget(R),S.render(O,P.current),O.material=L,L.uniforms.tDiffuse.value=R.texture,L.uniforms.v.value=1*e/256,S.setRenderTarget(A),S.render(O,P.current),O.visible=!1},D=0;return(0,o.D)(()=>{P.current&&(t===1/0||D<t)&&(D++,x=_.background,E=_.overrideMaterial,M.current.visible=!1,_.background=null,_.overrideMaterial=T,S.setRenderTarget(A),S.render(_,P.current),z(d),m&&z(.4*d),S.setRenderTarget(null),M.current.visible=!0,_.overrideMaterial=E,_.background=x)}),i.useImperativeHandle(b,()=>M.current,[]),i.createElement("group",(0,n.Z)({"rotation-x":Math.PI/2},w,{ref:M}),i.createElement("mesh",{renderOrder:y,geometry:C,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},i.createElement("meshBasicMaterial",{transparent:!0,map:A.texture,opacity:r,depthWrite:g})),i.createElement("orthographicCamera",{ref:P,args:[-c/2,c/2,u/2,-u/2,f,h]}))})},61070:function(e,t,r){"use strict";let n,i;r.d(t,{w:function(){return z}});var a=r(17610),o=r(7653),s=r(86995),l=r(35758);let c=new s.ZzF,u=new s.Pa4;class d extends s.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new s.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new s.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new s.$TI(t,6,1);return this.setAttribute("instanceStart",new s.kB5(r,3,0)),this.setAttribute("instanceEnd",new s.kB5(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let n=new s.$TI(r,2*t,1);return this.setAttribute("instanceColorStart",new s.kB5(n,t,0)),this.setAttribute("instanceColorEnd",new s.kB5(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new s.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new s.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new s.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let n=0;for(let i=0,a=e.count;i<a;i++)u.fromBufferAttribute(e,i),n=Math.max(n,r.distanceToSquared(u)),u.fromBufferAttribute(t,i),n=Math.max(n,r.distanceToSquared(u));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=r(78813),h=r(55379);class p extends s.jyz{constructor(e){super({type:"LineMaterial",uniforms:s.rDY.clone(s.rDY.merge([f.UniformsLib.common,f.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${h.i>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let m=h.i>=125?"uv1":"uv2",v=new s.Ltg,g=new s.Pa4,y=new s.Pa4,w=new s.Ltg,b=new s.Ltg,x=new s.Ltg,E=new s.Pa4,M=new s.yGw,_=new s.Zzh,S=new s.Pa4,P=new s.ZzF,A=new s.aLr,C=new s.Ltg;function T(e,t,r){return C.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),C.multiplyScalar(1/C.w),C.x=i/r.width,C.y=i/r.height,C.applyMatrix4(e.projectionMatrixInverse),C.multiplyScalar(1/C.w),Math.abs(Math.max(C.x,C.y))}class O extends s.Kj0{constructor(e=new d,t=new p({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)g.fromBufferAttribute(t,e),y.fromBufferAttribute(r,e),n[i]=0===i?0:n[i-1],n[i+1]=n[i]+g.distanceTo(y);let i=new s.$TI(n,2,1);return e.setAttribute("instanceDistanceStart",new s.kB5(i,1,0)),e.setAttribute("instanceDistanceEnd",new s.kB5(i,1,1)),this}raycast(e,t){let r,a;let o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;n=e.ray;let u=this.matrixWorld,d=this.geometry,f=this.material;if(i=f.linewidth+c,null===d.boundingSphere&&d.computeBoundingSphere(),A.copy(d.boundingSphere).applyMatrix4(u),o)r=.5*i;else{let e=Math.max(l.near,A.distanceToPoint(n.origin));r=T(l,e,f.resolution)}if(A.radius+=r,!1!==n.intersectsSphere(A)){if(null===d.boundingBox&&d.computeBoundingBox(),P.copy(d.boundingBox).applyMatrix4(u),o)a=.5*i;else{let e=Math.max(l.near,P.distanceToPoint(n.origin));a=T(l,e,f.resolution)}P.expandByScalar(a),!1!==n.intersectsBox(P)&&(o?function(e,t){let r=e.matrixWorld,a=e.geometry,o=a.attributes.instanceStart,l=a.attributes.instanceEnd,c=Math.min(a.instanceCount,o.count);for(let a=0;a<c;a++){_.start.fromBufferAttribute(o,a),_.end.fromBufferAttribute(l,a),_.applyMatrix4(r);let c=new s.Pa4,u=new s.Pa4;n.distanceSqToSegment(_.start,_.end,u,c),u.distanceTo(c)<.5*i&&t.push({point:u,pointOnLine:c,distance:n.origin.distanceTo(u),object:e,face:null,faceIndex:a,uv:null,[m]:null})}}(this,t):function(e,t,r){let a=t.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,d=c.attributes.instanceEnd,f=Math.min(c.instanceCount,u.count),h=-t.near;n.at(1,x),x.w=1,x.applyMatrix4(t.matrixWorldInverse),x.applyMatrix4(a),x.multiplyScalar(1/x.w),x.x*=o.x/2,x.y*=o.y/2,x.z=0,E.copy(x),M.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<f;t++){if(w.fromBufferAttribute(u,t),b.fromBufferAttribute(d,t),w.w=1,b.w=1,w.applyMatrix4(M),b.applyMatrix4(M),w.z>h&&b.z>h)continue;if(w.z>h){let e=w.z-b.z,t=(w.z-h)/e;w.lerp(b,t)}else if(b.z>h){let e=b.z-w.z,t=(b.z-h)/e;b.lerp(w,t)}w.applyMatrix4(a),b.applyMatrix4(a),w.multiplyScalar(1/w.w),b.multiplyScalar(1/b.w),w.x*=o.x/2,w.y*=o.y/2,b.x*=o.x/2,b.y*=o.y/2,_.start.copy(w),_.start.z=0,_.end.copy(b),_.end.z=0;let c=_.closestPointToPointParameter(E,!0);_.at(c,S);let f=s.M8C.lerp(w.z,b.z,c),p=f>=-1&&f<=1,v=E.distanceTo(S)<.5*i;if(p&&v){_.start.fromBufferAttribute(u,t),_.end.fromBufferAttribute(d,t),_.start.applyMatrix4(l),_.end.applyMatrix4(l);let i=new s.Pa4,a=new s.Pa4;n.distanceSqToSegment(_.start,_.end,a,i),r.push({point:a,pointOnLine:i,distance:n.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,[m]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class U extends d{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let n=0;n<t;n+=3)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,n=new Float32Array(2*r);if(3===t)for(let i=0;i<r;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];else for(let i=0;i<r;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5],n[2*i+6]=e[i+6],n[2*i+7]=e[i+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class L extends O{constructor(e=new U,t=new p({color:16777215*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let R=o.forwardRef(function({points:e,color:t=16777215,vertexColors:r,linewidth:n,lineWidth:i,segments:c,dashed:u,...f},h){var m,v;let g=(0,l.C)(e=>e.size),y=o.useMemo(()=>c?new O:new L,[c]),[w]=o.useState(()=>new p),b=(null==r||null==(m=r[0])?void 0:m.length)===4?4:3,x=o.useMemo(()=>{let n=c?new d:new U,i=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Pa4||e instanceof s.Ltg?[e.x,e.y,e.z]:e instanceof s.FM8?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(i.flat()),r){t=16777215;let e=r.map(e=>e instanceof s.Ilk?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,r,b]);return o.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),o.useLayoutEffect(()=>{u?w.defines.USE_DASH="":delete w.defines.USE_DASH,w.needsUpdate=!0},[u,w]),o.useEffect(()=>()=>{x.dispose(),w.dispose()},[x]),o.createElement("primitive",(0,a.Z)({object:y,ref:h},f),o.createElement("primitive",{object:x,attach:"geometry"}),o.createElement("primitive",(0,a.Z)({object:w,attach:"material",color:t,vertexColors:!!r,resolution:[g.width,g.height],linewidth:null!==(v=null!=n?n:i)&&void 0!==v?v:1,dashed:u,transparent:4===b},f)))}),z=o.forwardRef(({threshold:e=15,geometry:t,...r},n)=>{let i=o.useRef(null);o.useImperativeHandle(n,()=>i.current,[]);let l=o.useMemo(()=>[0,0,0,1,0,0],[]),c=o.useRef(null),u=o.useRef(null);return o.useLayoutEffect(()=>{let r=i.current.parent,n=null!=t?t:null==r?void 0:r.geometry;if(!n||c.current===n&&u.current===e)return;c.current=n,u.current=e;let a=new s.TOt(n,e).attributes.position.array;i.current.geometry.setPositions(a),i.current.geometry.attributes.instanceStart.needsUpdate=!0,i.current.geometry.attributes.instanceEnd.needsUpdate=!0,i.current.computeLineDistances()}),o.createElement(R,(0,a.Z)({segments:!0,points:l,ref:i,raycast:()=>null},r))})},4475:function(e,t,r){"use strict";let n;r.d(t,{qA:function(){return ek}});var i,a=r(17610),o=r(7653),s=r(35758),l=r(86995),c=r(78813),u=r(55379);let d=e=>e&&e.isCubeTexture;class f extends l.Kj0{constructor(e,t){var r,n;let i=d(e),a=Math.floor(Math.log2((null!=(n=i?null==(r=e.image[0])?void 0:r.width:e.image.width)?n:1024)/4)),o=Math.pow(2,a),s=`
        varying vec3 vWorldPosition;
        void main() 
        {
            vec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `,c=[i?"#define ENVMAP_TYPE_CUBE":"",`#define CUBEUV_TEXEL_WIDTH ${1/(3*Math.max(o,112))}`,`#define CUBEUV_TEXEL_HEIGHT ${1/(4*o)}`,`#define CUBEUV_MAX_MIP ${a}.0`].join("\n")+`
        #define ENVMAP_TYPE_CUBE_UV
        varying vec3 vWorldPosition;
        uniform float radius;
        uniform float height;
        uniform float angle;
        #ifdef ENVMAP_TYPE_CUBE
            uniform samplerCube map;
        #else
            uniform sampler2D map;
        #endif
        // From: https://www.shadertoy.com/view/4tsBD7
        float diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) 
        {
            float d = dot ( rd, n );
            
            if( d > 0.0 ) { return 1e6; }
            
            vec3  o = ro - c;
            float t = - dot( n, o ) / d;
            vec3  q = o + rd * t;
            
            return ( dot( q, q ) < r * r ) ? t : 1e6;
        }
        // From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
        float sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) 
        {
            vec3 oc = ro - ce;
            float b = dot( oc, rd );
            float c = dot( oc, oc ) - ra * ra;
            float h = b * b - c;
            
            if( h < 0.0 ) { return -1.0; }
            
            h = sqrt( h );
            
            return - b + h;
        }
        vec3 project() 
        {
            vec3 p = normalize( vWorldPosition );
            vec3 camPos = cameraPosition;
            camPos.y -= height;
            float intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );
            if( intersection > 0.0 ) {
                
                vec3 h = vec3( 0.0, - height, 0.0 );
                float intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );
                p = ( camPos + min( intersection, intersection2 ) * p ) / radius;
            } else {
                p = vec3( 0.0, 1.0, 0.0 );
            }
            return p;
        }
        #include <common>
        #include <cube_uv_reflection_fragment>
        void main() 
        {
            vec3 projectedWorldPosition = project();
            
            #ifdef ENVMAP_TYPE_CUBE
                vec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;
            #else
                vec3 direction = normalize( projectedWorldPosition );
                vec2 uv = equirectUv( direction );
                vec3 outcolor = texture2D( map, uv ).rgb;
            #endif
            gl_FragColor = vec4( outcolor, 1.0 );
            #include <tonemapping_fragment>
            #include <${u.i>=154?"colorspace_fragment":"encodings_fragment"}>
        }
        `;super(new l.cJO(1,16),new l.jyz({uniforms:{map:{value:e},height:{value:(null==t?void 0:t.height)||15},radius:{value:(null==t?void 0:t.radius)||100}},fragmentShader:c,vertexShader:s,side:l.ehD}))}set radius(e){this.material.uniforms.radius.value=e}get radius(){return this.material.uniforms.radius.value}set height(e){this.material.uniforms.height.value=e}get height(){return this.material.uniforms.height.value}}class h extends l.yxD{constructor(e){super(e),this.type=l.cLu}parse(e){let t,r,n;let i=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},a=function(e,t,r){t=t||1024;let n=e.pos,i=-1,a=0,o="",s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(n,n+128)));for(;0>(i=s.indexOf("\n"))&&a<t&&n<e.byteLength;)o+=s,a+=s.length,n+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(n,n+128)));return -1<i&&(!1!==r&&(e.pos+=a+i+1),o+s.slice(0,i))},o=new Uint8Array(e);o.pos=0;let s=function(e){let t,r;let n=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*FORMAT=(\S+)\s*$/,l=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=a(e))||i(1,"no header found"),(r=t.match(/^#\?(\S+)/))||i(3,"bad initial token"),c.valid|=1,c.programtype=r[1],c.string+=t+"\n";!1!==(t=a(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((r=t.match(n))&&(c.gamma=parseFloat(r[1])),(r=t.match(o))&&(c.exposure=parseFloat(r[1])),(r=t.match(s))&&(c.valid|=2,c.format=r[1]),(r=t.match(l))&&(c.valid|=4,c.height=parseInt(r[1],10),c.width=parseInt(r[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||i(3,"missing format specifier"),4&c.valid||i(3,"missing image size specifier"),c}(o),c=s.width,u=s.height,d=function(e,t,r){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&i(3,"wrong scanline width");let n=new Uint8Array(4*t*r);n.length||i(4,"unable to allocate buffer space");let a=0,o=0,s=4*t,l=new Uint8Array(4),c=new Uint8Array(s),u=r;for(;u>0&&o<e.byteLength;){o+4>e.byteLength&&i(1),l[0]=e[o++],l[1]=e[o++],l[2]=e[o++],l[3]=e[o++],(2!=l[0]||2!=l[1]||(l[2]<<8|l[3])!=t)&&i(3,"bad rgbe scanline format");let r=0,d;for(;r<s&&o<e.byteLength;){let t=(d=e[o++])>128;if(t&&(d-=128),(0===d||r+d>s)&&i(3,"bad scanline data"),t){let t=e[o++];for(let e=0;e<d;e++)c[r++]=t}else c.set(e.subarray(o,o+d),r),r+=d,o+=d}for(let e=0;e<t;e++){let r=0;n[a]=c[e+r],r+=t,n[a+1]=c[e+r],r+=t,n[a+2]=c[e+r],r+=t,n[a+3]=c[e+r],a+=4}u--}return n}(o.subarray(o.pos),c,u);switch(this.type){case l.VzW:let f=new Float32Array(4*(n=d.length/4));for(let e=0;e<n;e++)!function(e,t,r,n){let i=Math.pow(2,e[t+3]-128)/255;r[n+0]=e[t+0]*i,r[n+1]=e[t+1]*i,r[n+2]=e[t+2]*i,r[n+3]=1}(d,4*e,f,4*e);t=f,r=l.VzW;break;case l.cLu:let h=new Uint16Array(4*(n=d.length/4));for(let e=0;e<n;e++)!function(e,t,r,n){let i=Math.pow(2,e[t+3]-128)/255;r[n+0]=l.A5E.toHalfFloat(Math.min(e[t+0]*i,65504)),r[n+1]=l.A5E.toHalfFloat(Math.min(e[t+1]*i,65504)),r[n+2]=l.A5E.toHalfFloat(Math.min(e[t+2]*i,65504)),r[n+3]=l.A5E.toHalfFloat(1)}(d,4*e,h,4*e);t=h,r=l.cLu;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:u,data:t,header:s.string,gamma:s.gamma,exposure:s.exposure,type:r}}setDataType(e){return this.type=e,this}load(e,t,r,n){return super.load(e,function(e,r){switch(e.type){case l.VzW:case l.cLu:"colorSpace"in e?e.colorSpace="srgb-linear":e.encoding=3e3,e.minFilter=l.wem,e.magFilter=l.wem,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,r)},r,n)}}var p={},m=Uint8Array,v=Uint16Array,g=Uint32Array,y=new m([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),w=new m([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),b=new m([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),x=function(e,t){for(var r=new v(31),n=0;n<31;++n)r[n]=t+=1<<e[n-1];for(var i=new g(r[30]),n=1;n<30;++n)for(var a=r[n];a<r[n+1];++a)i[a]=a-r[n]<<5|n;return[r,i]},E=x(y,2),M=E[0],_=E[1];M[28]=258,_[258]=28;for(var S=x(w,0),P=S[0],A=S[1],C=new v(32768),T=0;T<32768;++T){var O=(43690&T)>>>1|(21845&T)<<1;O=(61680&(O=(52428&O)>>>2|(13107&O)<<2))>>>4|(3855&O)<<4,C[T]=((65280&O)>>>8|(255&O)<<8)>>>1}for(var U=function(e,t,r){for(var n,i=e.length,a=0,o=new v(t);a<i;++a)++o[e[a]-1];var s=new v(t);for(a=0;a<t;++a)s[a]=s[a-1]+o[a-1]<<1;if(r){n=new v(1<<t);var l=15-t;for(a=0;a<i;++a)if(e[a])for(var c=a<<4|e[a],u=t-e[a],d=s[e[a]-1]++<<u,f=d|(1<<u)-1;d<=f;++d)n[C[d]>>>l]=c}else for(a=0,n=new v(i);a<i;++a)e[a]&&(n[a]=C[s[e[a]-1]++]>>>15-e[a]);return n},L=new m(288),T=0;T<144;++T)L[T]=8;for(var T=144;T<256;++T)L[T]=9;for(var T=256;T<280;++T)L[T]=7;for(var T=280;T<288;++T)L[T]=8;for(var R=new m(32),T=0;T<32;++T)R[T]=5;var z=U(L,9,1),D=U(R,5,1),I=function(e){for(var t=e[0],r=1;r<e.length;++r)e[r]>t&&(t=e[r]);return t},k=function(e,t,r){var n=t/8|0;return(e[n]|e[n+1]<<8)>>(7&t)&r},j=function(e,t){var r=t/8|0;return(e[r]|e[r+1]<<8|e[r+2]<<16)>>(7&t)},F=function(e){return(e/8|0)+(7&e&&1)},N=function(e,t,r){(null==t||t<0)&&(t=0),(null==r||r>e.length)&&(r=e.length);var n=new(e instanceof v?v:e instanceof g?g:m)(r-t);return n.set(e.subarray(t,r)),n},H=function(e,t,r){var n=e.length;if(!n||r&&!r.l&&n<5)return t||new m(0);var i=!t||r,a=!r||r.i;r||(r={}),t||(t=new m(3*n));var o=function(e){var r=t.length;if(e>r){var n=new m(Math.max(2*r,e));n.set(t),t=n}},s=r.f||0,l=r.p||0,c=r.b||0,u=r.l,d=r.d,f=r.m,h=r.n,p=8*n;do{if(!u){r.f=s=k(e,l,1);var v=k(e,l+1,3);if(l+=3,v){if(1==v)u=z,d=D,f=9,h=5;else if(2==v){var g=k(e,l,31)+257,x=k(e,l+10,15)+4,E=g+k(e,l+5,31)+1;l+=14;for(var _=new m(E),S=new m(19),A=0;A<x;++A)S[b[A]]=k(e,l+3*A,7);l+=3*x;for(var C=I(S),T=(1<<C)-1,O=U(S,C,1),A=0;A<E;){var L=O[k(e,l,T)];l+=15&L;var R=L>>>4;if(R<16)_[A++]=R;else{var H=0,B=0;for(16==R?(B=3+k(e,l,3),l+=2,H=_[A-1]):17==R?(B=3+k(e,l,7),l+=3):18==R&&(B=11+k(e,l,127),l+=7);B--;)_[A++]=H}}var W=_.subarray(0,g),G=_.subarray(g);f=I(W),h=I(G),u=U(W,f,1),d=U(G,h,1)}else throw"invalid block type"}else{var R=F(l)+4,V=e[R-4]|e[R-3]<<8,Y=R+V;if(Y>n){if(a)throw"unexpected EOF";break}i&&o(c+V),t.set(e.subarray(R,Y),c),r.b=c+=V,r.p=l=8*Y;continue}if(l>p){if(a)throw"unexpected EOF";break}}i&&o(c+131072);for(var Z=(1<<f)-1,$=(1<<h)-1,X=l;;X=l){var H=u[j(e,l)&Z],q=H>>>4;if((l+=15&H)>p){if(a)throw"unexpected EOF";break}if(!H)throw"invalid length/literal";if(q<256)t[c++]=q;else if(256==q){X=l,u=null;break}else{var K=q-254;if(q>264){var A=q-257,Q=y[A];K=k(e,l,(1<<Q)-1)+M[A],l+=Q}var J=d[j(e,l)&$],ee=J>>>4;if(!J)throw"invalid distance";l+=15&J;var G=P[ee];if(ee>3){var Q=w[ee];G+=j(e,l)&(1<<Q)-1,l+=Q}if(l>p){if(a)throw"unexpected EOF";break}i&&o(c+131072);for(var et=c+K;c<et;c+=4)t[c]=t[c-G],t[c+1]=t[c+1-G],t[c+2]=t[c+2-G],t[c+3]=t[c+3-G];c=et}}r.l=u,r.p=X,r.b=c,u&&(s=1,r.m=f,r.d=d,r.n=h)}while(!s);return c==t.length?t:N(t,0,c)},B=function(e,t,r){r<<=7&t;var n=t/8|0;e[n]|=r,e[n+1]|=r>>>8},W=function(e,t,r){r<<=7&t;var n=t/8|0;e[n]|=r,e[n+1]|=r>>>8,e[n+2]|=r>>>16},G=function(e,t){for(var r=[],n=0;n<e.length;++n)e[n]&&r.push({s:n,f:e[n]});var i=r.length,a=r.slice();if(!i)return[K,0];if(1==i){var o=new m(r[0].s+1);return o[r[0].s]=1,[o,1]}r.sort(function(e,t){return e.f-t.f}),r.push({s:-1,f:25001});var s=r[0],l=r[1],c=0,u=1,d=2;for(r[0]={s:-1,f:s.f+l.f,l:s,r:l};u!=i-1;)s=r[r[c].f<r[d].f?c++:d++],l=r[c!=u&&r[c].f<r[d].f?c++:d++],r[u++]={s:-1,f:s.f+l.f,l:s,r:l};for(var f=a[0].s,n=1;n<i;++n)a[n].s>f&&(f=a[n].s);var h=new v(f+1),p=V(r[u-1],h,0);if(p>t){var n=0,g=0,y=p-t,w=1<<y;for(a.sort(function(e,t){return h[t.s]-h[e.s]||e.f-t.f});n<i;++n){var b=a[n].s;if(h[b]>t)g+=w-(1<<p-h[b]),h[b]=t;else break}for(g>>>=y;g>0;){var x=a[n].s;h[x]<t?g-=1<<t-h[x]++-1:++n}for(;n>=0&&g;--n){var E=a[n].s;h[E]==t&&(--h[E],++g)}p=t}return[new m(h),p]},V=function(e,t,r){return -1==e.s?Math.max(V(e.l,t,r+1),V(e.r,t,r+1)):t[e.s]=r},Y=function(e){for(var t=e.length;t&&!e[--t];);for(var r=new v(++t),n=0,i=e[0],a=1,o=function(e){r[n++]=e},s=1;s<=t;++s)if(e[s]==i&&s!=t)++a;else{if(!i&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(i),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(i);a=1,i=e[s]}return[r.subarray(0,n),t]},Z=function(e,t){for(var r=0,n=0;n<t.length;++n)r+=e[n]*t[n];return r},$=function(e,t,r){var n=r.length,i=F(t+2);e[i]=255&n,e[i+1]=n>>>8,e[i+2]=255^e[i],e[i+3]=255^e[i+1];for(var a=0;a<n;++a)e[i+a+4]=r[a];return(i+4+n)*8},X=function(e,t,r,n,i,a,o,s,l,c,u){B(t,u++,r),++i[256];for(var d,f,h,p,m=G(i,15),g=m[0],x=m[1],E=G(a,15),M=E[0],_=E[1],S=Y(g),P=S[0],A=S[1],C=Y(M),T=C[0],O=C[1],z=new v(19),D=0;D<P.length;++D)z[31&P[D]]++;for(var D=0;D<T.length;++D)z[31&T[D]]++;for(var I=G(z,7),k=I[0],j=I[1],F=19;F>4&&!k[b[F-1]];--F);var N=c+5<<3,H=Z(i,L)+Z(a,R)+o,V=Z(i,g)+Z(a,M)+o+14+3*F+Z(z,k)+(2*z[16]+3*z[17]+7*z[18]);if(N<=H&&N<=V)return $(t,u,e.subarray(l,l+c));if(B(t,u,1+(V<H)),u+=2,V<H){d=U(g,x,0),f=g,h=U(M,_,0),p=M;var X=U(k,j,0);B(t,u,A-257),B(t,u+5,O-1),B(t,u+10,F-4),u+=14;for(var D=0;D<F;++D)B(t,u+3*D,k[b[D]]);u+=3*F;for(var q=[P,T],K=0;K<2;++K)for(var Q=q[K],D=0;D<Q.length;++D){var J=31&Q[D];B(t,u,X[J]),u+=k[J],J>15&&(B(t,u,Q[D]>>>5&127),u+=Q[D]>>>12)}}else d=null,f=L,h=null,p=R;for(var D=0;D<s;++D)if(n[D]>255){var J=n[D]>>>18&31;W(t,u,d[J+257]),u+=f[J+257],J>7&&(B(t,u,n[D]>>>23&31),u+=y[J]);var ee=31&n[D];W(t,u,h[ee]),u+=p[ee],ee>3&&(W(t,u,n[D]>>>5&8191),u+=w[ee])}else W(t,u,d[n[D]]),u+=f[n[D]];return W(t,u,d[256]),u+f[256]},q=new g([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),K=new m(0),Q=function(e){if((15&e[0])!=8||e[0]>>>4>7||(e[0]<<8|e[1])%31)throw"invalid zlib data";if(32&e[1])throw"invalid zlib data: preset dictionaries not supported"};function J(e,t){return H((Q(e),e.subarray(2,-4)),t)}var ee="undefined"!=typeof TextDecoder&&new TextDecoder;try{ee.decode(K,{stream:!0})}catch(e){}let et=u.i>=152;class er extends l.yxD{constructor(e){super(e),this.type=l.cLu}parse(e){let t={l:0,c:0,lc:0};function r(e,r,n,i,a){for(;n<e;)r=r<<8|P(i,a),n+=8;n-=e,t.l=r>>n&(1<<e)-1,t.c=r,t.lc=n}let n=Array(59),i={c:0,lc:0};function a(e,t,r,n){e=e<<8|P(r,n),t+=8,i.c=e,i.lc=t}let o={c:0,lc:0};function s(e,t,r,n,s,l,c,u,d,f){if(e==t){n<8&&(a(r,n,s,c),r=i.c,n=i.lc);var h=r>>(n-=8),h=new Uint8Array([h])[0];if(d.value+h>f)return!1;for(var p=u[d.value-1];h-- >0;)u[d.value++]=p}else{if(!(d.value<f))return!1;u[d.value++]=e}o.c=r,o.lc=n}function c(e){var t=65535&e;return t>32767?t-65536:t}let u={a:0,b:0};function d(e,t){var r=c(e),n=c(t),i=r+(1&n)+(n>>1),a=i-n;u.a=i,u.b=a}function f(e,t){var r=65535&t,n=(65535&e)-(r>>1)&65535;u.a=r+n-32768&65535,u.b=n}function h(e,l,c,u,d,f){var h=c.value,p=S(l,c),m=S(l,c);c.value+=4;var v=S(l,c);if(c.value+=4,p<0||p>=65537||m<0||m>=65537)throw"Something wrong with HUF_ENCSIZE";var g=Array(65537),y=Array(16384);!function(e){for(var t=0;t<16384;t++)e[t]={},e[t].len=0,e[t].lit=0,e[t].p=null}(y);var w=u-(c.value-h);if(!function(e,i,a,o,s,l,c){for(var u=0,d=0;s<=l;s++){if(a.value-a.value>o)return!1;r(6,u,d,e,a);var f=t.l;if(u=t.c,d=t.lc,c[s]=f,63==f){if(a.value-a.value>o)throw"Something wrong with hufUnpackEncTable";r(8,u,d,e,a);var h=t.l+6;if(u=t.c,d=t.lc,s+h>l+1)throw"Something wrong with hufUnpackEncTable";for(;h--;)c[s++]=0;s--}else if(f>=59){var h=f-59+2;if(s+h>l+1)throw"Something wrong with hufUnpackEncTable";for(;h--;)c[s++]=0;s--}}!function(e){for(var t=0;t<=58;++t)n[t]=0;for(var t=0;t<65537;++t)n[e[t]]+=1;for(var r=0,t=58;t>0;--t){var i=r+n[t]>>1;n[t]=r,r=i}for(var t=0;t<65537;++t){var a=e[t];a>0&&(e[t]=a|n[a]++<<6)}}(c)}(e,0,c,w,p,m,g),v>8*(u-(c.value-h)))throw"Something wrong with hufUncompress";!function(e,t,r,n){for(;t<=r;t++){var i=e[t]>>6,a=63&e[t];if(i>>a)throw"Invalid table entry";if(a>14){var o=n[i>>a-14];if(o.len)throw"Invalid table entry";if(o.lit++,o.p){var s=o.p;o.p=Array(o.lit);for(var l=0;l<o.lit-1;++l)o.p[l]=s[l]}else o.p=[,];o.p[o.lit-1]=t}else if(a)for(var c=0,l=1<<14-a;l>0;l--){var o=n[(i<<14-a)+c];if(o.len||o.p)throw"Invalid table entry";o.len=a,o.lit=t,c++}}}(g,p,m,y),function(e,t,r,n,l,c,u,d,f,h){for(var p=0,m=0,v=Math.trunc(l.value+(c+7)/8);l.value<v;)for(a(p,m,r,l),p=i.c,m=i.lc;m>=14;){var g=t[p>>m-14&16383];if(g.len)m-=g.len,s(g.lit,u,p,m,r,n,l,f,h,d),p=o.c,m=o.lc;else{if(!g.p)throw"hufDecode issues";for(y=0;y<g.lit;y++){for(var y,w=63&e[g.p[y]];m<w&&l.value<v;)a(p,m,r,l),p=i.c,m=i.lc;if(m>=w&&e[g.p[y]]>>6==(p>>m-w&(1<<w)-1)){m-=w,s(g.p[y],u,p,m,r,n,l,f,h,d),p=o.c,m=o.lc;break}}if(y==g.lit)throw"hufDecode issues"}}var b=8-c&7;for(p>>=b,m-=b;m>0;){var g=t[p<<14-m&16383];if(g.len)m-=g.len,s(g.lit,u,p,m,r,n,l,f,h,d),p=o.c,m=o.lc;else throw"hufDecode issues"}}(g,y,e,l,c,v,m,f,d,{value:0})}function p(e){for(var t=1;t<e.length;t++){var r=e[t-1]+e[t]-128;e[t]=r}}function m(e,t){for(var r=0,n=Math.floor((e.length+1)/2),i=0,a=e.length-1;!(i>a)&&(t[i++]=e[r++],!(i>a));)t[i++]=e[n++]}function v(e){for(var t=e.byteLength,r=[],n=0,i=new DataView(e);t>0;){var a=i.getInt8(n++);if(a<0){var o=-a;t-=o+1;for(var s=0;s<o;s++)r.push(i.getUint8(n++))}else{var o=a;t-=2;for(var l=i.getUint8(n++),s=0;s<o+1;s++)r.push(l)}}return r}function g(e){return new DataView(e.array.buffer,e.offset.value,e.size)}function y(e){var t=new Uint8Array(v(e.viewer.buffer.slice(e.offset.value,e.offset.value+e.size))),r=new Uint8Array(t.length);return p(t),m(t,r),new DataView(r.buffer)}function w(e){var t=J(e.array.slice(e.offset.value,e.offset.value+e.size)),r=new Uint8Array(t.length);return p(t),m(t,r),new DataView(r.buffer)}function b(e){for(var t=e.viewer,r={value:e.offset.value},n=new Uint16Array(e.width*e.scanlineBlockSize*(e.channels*e.type)),i=new Uint8Array(8192),a=0,o=Array(e.channels),s=0;s<e.channels;s++)o[s]={},o[s].start=a,o[s].end=o[s].start,o[s].nx=e.width,o[s].ny=e.lines,o[s].size=e.type,a+=o[s].nx*o[s].ny*o[s].size;var l=L(t,r),c=L(t,r);if(c>=8192)throw"Something is wrong with PIZ_COMPRESSION BITMAP_SIZE";if(l<=c)for(var s=0;s<c-l+1;s++)i[s+l]=A(t,r);var p=new Uint16Array(65536),m=function(e,t){for(var r=0,n=0;n<65536;++n)(0==n||e[n>>3]&1<<(7&n))&&(t[r++]=n);for(var i=r-1;r<65536;)t[r++]=0;return i}(i,p),v=S(t,r);h(e.array,t,r,v,n,a);for(var s=0;s<e.channels;++s)for(var g=o[s],y=0;y<o[s].size;++y)!function(e,t,r,n,i,a,o){for(var s=o<16384,l=r>i?i:r,c=1;c<=l;)c<<=1;for(c>>=1,h=c,c>>=1;c>=1;){for(var h,p,m,v,g,y=0,w=0+a*(i-h),b=a*c,x=a*h,E=n*c,M=n*h;y<=w;y+=x){for(var _=y,S=y+n*(r-h);_<=S;_+=M){var P=_+E,A=_+b,C=A+E;s?(d(e[_+t],e[A+t]),p=u.a,v=u.b,d(e[P+t],e[C+t]),m=u.a,g=u.b,d(p,m),e[_+t]=u.a,e[P+t]=u.b,d(v,g)):(f(e[_+t],e[A+t]),p=u.a,v=u.b,f(e[P+t],e[C+t]),m=u.a,g=u.b,f(p,m),e[_+t]=u.a,e[P+t]=u.b,f(v,g)),e[A+t]=u.a,e[C+t]=u.b}if(r&c){var A=_+b;s?d(e[_+t],e[A+t]):f(e[_+t],e[A+t]),p=u.a,e[A+t]=u.b,e[_+t]=p}}if(i&c)for(var _=y,S=y+n*(r-h);_<=S;_+=M){var P=_+E;s?d(e[_+t],e[P+t]):f(e[_+t],e[P+t]),p=u.a,e[P+t]=u.b,e[_+t]=p}h=c,c>>=1}}(n,g.start+y,g.nx,g.size,g.ny,g.nx*g.size,m);!function(e,t,r){for(var n=0;n<r;++n)t[n]=e[t[n]]}(p,n,a);for(var w=0,b=new Uint8Array(n.buffer.byteLength),x=0;x<e.lines;x++)for(var E=0;E<e.channels;E++){var g=o[E],M=g.nx*g.size,_=new Uint8Array(n.buffer,2*g.end,2*M);b.set(_,w),w+=2*M,g.end+=M}return new DataView(b.buffer)}function x(e){var t=J(e.array.slice(e.offset.value,e.offset.value+e.size));let r=e.lines*e.channels*e.width,n=1==e.type?new Uint16Array(r):new Uint32Array(r),i=0,a=0,o=[,,,,];for(let r=0;r<e.lines;r++)for(let r=0;r<e.channels;r++){let r=0;switch(e.type){case 1:o[0]=i,o[1]=o[0]+e.width,i=o[1]+e.width;for(let i=0;i<e.width;++i)r+=t[o[0]++]<<8|t[o[1]++],n[a]=r,a++;break;case 2:o[0]=i,o[1]=o[0]+e.width,o[2]=o[1]+e.width,i=o[2]+e.width;for(let i=0;i<e.width;++i)r+=t[o[0]++]<<24|t[o[1]++]<<16|t[o[2]++]<<8,n[a]=r,a++}}return new DataView(n.buffer)}function E(e){var t=e.viewer,r={value:e.offset.value},n=new Uint8Array(e.width*e.lines*(e.channels*e.type*2)),i={version:C(t,r),unknownUncompressedSize:C(t,r),unknownCompressedSize:C(t,r),acCompressedSize:C(t,r),dcCompressedSize:C(t,r),rleCompressedSize:C(t,r),rleUncompressedSize:C(t,r),rleRawSize:C(t,r),totalAcUncompressedCount:C(t,r),totalDcUncompressedCount:C(t,r),acCompression:C(t,r)};if(i.version<2)throw"EXRLoader.parse: "+k.compression+" version "+i.version+" is unsupported";for(var a=[],o=L(t,r)-2;o>0;){var s=M(t.buffer,r),c=A(t,r),u=c>>2&3,d=new Int8Array([(c>>4)-1])[0],f=A(t,r);a.push({name:s,index:d,type:f,compression:u}),o-=s.length+3}for(var p=k.channels,m=Array(e.channels),g=0;g<e.channels;++g){var y=m[g]={},b=p[g];y.name=b.name,y.compression=0,y.decoded=!1,y.type=b.pixelType,y.pLinear=b.pLinear,y.width=e.width,y.height=e.lines}for(var x={idx:[,,,]},E=0;E<e.channels;++E)for(var y=m[E],g=0;g<a.length;++g){var _=a[g];y.name==_.name&&(y.compression=_.compression,_.index>=0&&(x.idx[_.index]=E),y.offset=E)}if(i.acCompressedSize>0)switch(i.acCompression){case 0:var S=new Uint16Array(i.totalAcUncompressedCount);h(e.array,t,r,i.acCompressedSize,S,i.totalAcUncompressedCount);break;case 1:var P=e.array.slice(r.value,r.value+i.totalAcUncompressedCount),T=J(P),S=new Uint16Array(T.buffer);r.value+=i.totalAcUncompressedCount}if(i.dcCompressedSize>0){var O=new Uint16Array(w({array:e.array,offset:r,size:i.dcCompressedSize}).buffer);r.value+=i.dcCompressedSize}if(i.rleRawSize>0){var P=e.array.slice(r.value,r.value+i.rleCompressedSize),T=J(P),R=v(T.buffer);r.value+=i.rleCompressedSize}for(var z=0,D=Array(m.length),g=0;g<D.length;++g)D[g]=[];for(var I=0;I<e.lines;++I)for(var j=0;j<m.length;++j)D[j].push(z),z+=m[j].width*e.type*2;!function(e,t,r,n,i,a){var o=new DataView(a.buffer),s=r[e.idx[0]].width,c=r[e.idx[0]].height,u=Math.floor(s/8),d=Math.ceil(s/8),f=Math.ceil(c/8),h=s-(d-1)*8,p=c-(f-1)*8,m={value:0},v=[,,,],g=[,,,],y=[,,,],w=[,,,],b=[,,,];for(let r=0;r<3;++r)b[r]=t[e.idx[r]],v[r]=r<1?0:v[r-1]+d*f,g[r]=new Float32Array(64),y[r]=new Uint16Array(64),w[r]=new Uint16Array(64*d);for(let t=0;t<f;++t){var x,E,M=8;t==f-1&&(M=p);var _=8;for(let e=0;e<d;++e){e==d-1&&(_=h);for(let e=0;e<3;++e)y[e].fill(0),y[e][0]=i[v[e]++],function(e,t,r){for(var n,i=1;i<64;)65280==(n=t[e.value])?i=64:n>>8==255?i+=255&n:(r[i]=n,i++),e.value++}(m,n,y[e]),x=y[e],(E=g[e])[0]=U(x[0]),E[1]=U(x[1]),E[2]=U(x[5]),E[3]=U(x[6]),E[4]=U(x[14]),E[5]=U(x[15]),E[6]=U(x[27]),E[7]=U(x[28]),E[8]=U(x[2]),E[9]=U(x[4]),E[10]=U(x[7]),E[11]=U(x[13]),E[12]=U(x[16]),E[13]=U(x[26]),E[14]=U(x[29]),E[15]=U(x[42]),E[16]=U(x[3]),E[17]=U(x[8]),E[18]=U(x[12]),E[19]=U(x[17]),E[20]=U(x[25]),E[21]=U(x[30]),E[22]=U(x[41]),E[23]=U(x[43]),E[24]=U(x[9]),E[25]=U(x[11]),E[26]=U(x[18]),E[27]=U(x[24]),E[28]=U(x[31]),E[29]=U(x[40]),E[30]=U(x[44]),E[31]=U(x[53]),E[32]=U(x[10]),E[33]=U(x[19]),E[34]=U(x[23]),E[35]=U(x[32]),E[36]=U(x[39]),E[37]=U(x[45]),E[38]=U(x[52]),E[39]=U(x[54]),E[40]=U(x[20]),E[41]=U(x[22]),E[42]=U(x[33]),E[43]=U(x[38]),E[44]=U(x[46]),E[45]=U(x[51]),E[46]=U(x[55]),E[47]=U(x[60]),E[48]=U(x[21]),E[49]=U(x[34]),E[50]=U(x[37]),E[51]=U(x[47]),E[52]=U(x[50]),E[53]=U(x[56]),E[54]=U(x[59]),E[55]=U(x[61]),E[56]=U(x[35]),E[57]=U(x[36]),E[58]=U(x[48]),E[59]=U(x[49]),E[60]=U(x[57]),E[61]=U(x[58]),E[62]=U(x[62]),E[63]=U(x[63]),function(e){let t=.5*Math.cos(3.14159/16),r=.5*Math.cos(3.14159/8),n=.5*Math.cos(3*3.14159/16),i=.5*Math.cos(3*3.14159/8);for(var a=[,,,,],o=[,,,,],s=[,,,,],l=[,,,,],c=0;c<8;++c){var u=8*c;a[0]=r*e[u+2],a[1]=i*e[u+2],a[2]=r*e[u+6],a[3]=i*e[u+6],o[0]=t*e[u+1]+n*e[u+3]+.2777854612564676*e[u+5]+.09754573032714427*e[u+7],o[1]=n*e[u+1]-.09754573032714427*e[u+3]-t*e[u+5]-.2777854612564676*e[u+7],o[2]=.2777854612564676*e[u+1]-t*e[u+3]+.09754573032714427*e[u+5]+n*e[u+7],o[3]=.09754573032714427*e[u+1]-.2777854612564676*e[u+3]+n*e[u+5]-t*e[u+7],s[0]=.35355362513961314*(e[u+0]+e[u+4]),s[3]=.35355362513961314*(e[u+0]-e[u+4]),s[1]=a[0]+a[3],s[2]=a[1]-a[2],l[0]=s[0]+s[1],l[1]=s[3]+s[2],l[2]=s[3]-s[2],l[3]=s[0]-s[1],e[u+0]=l[0]+o[0],e[u+1]=l[1]+o[1],e[u+2]=l[2]+o[2],e[u+3]=l[3]+o[3],e[u+4]=l[3]-o[3],e[u+5]=l[2]-o[2],e[u+6]=l[1]-o[1],e[u+7]=l[0]-o[0]}for(var d=0;d<8;++d)a[0]=r*e[16+d],a[1]=i*e[16+d],a[2]=r*e[48+d],a[3]=i*e[48+d],o[0]=t*e[8+d]+n*e[24+d]+.2777854612564676*e[40+d]+.09754573032714427*e[56+d],o[1]=n*e[8+d]-.09754573032714427*e[24+d]-t*e[40+d]-.2777854612564676*e[56+d],o[2]=.2777854612564676*e[8+d]-t*e[24+d]+.09754573032714427*e[40+d]+n*e[56+d],o[3]=.09754573032714427*e[8+d]-.2777854612564676*e[24+d]+n*e[40+d]-t*e[56+d],s[0]=.35355362513961314*(e[d]+e[32+d]),s[3]=.35355362513961314*(e[d]-e[32+d]),s[1]=a[0]+a[3],s[2]=a[1]-a[2],l[0]=s[0]+s[1],l[1]=s[3]+s[2],l[2]=s[3]-s[2],l[3]=s[0]-s[1],e[0+d]=l[0]+o[0],e[8+d]=l[1]+o[1],e[16+d]=l[2]+o[2],e[24+d]=l[3]+o[3],e[32+d]=l[3]-o[3],e[40+d]=l[2]-o[2],e[48+d]=l[1]-o[1],e[56+d]=l[0]-o[0]}(g[e]);!function(e){for(var t=0;t<64;++t){var r=e[0][t],n=e[1][t],i=e[2][t];e[0][t]=r+1.5747*i,e[1][t]=r-.1873*n-.4682*i,e[2][t]=r+1.8556*n}}(g);for(let t=0;t<3;++t)!function(e,t,r){for(var n,i=0;i<64;++i)t[r+i]=l.A5E.toHalfFloat((n=e[i])<=1?Math.sign(n)*Math.pow(Math.abs(n),2.2):Math.sign(n)*Math.pow(9.025013291561939,Math.abs(n)-1))}(g[t],w[t],64*e)}let a=0;for(let n=0;n<3;++n){let i=r[e.idx[n]].type;for(let e=8*t;e<8*t+M;++e){a=b[n][e];for(let t=0;t<u;++t){let r=64*t+(7&e)*8;o.setUint16(a+0*i,w[n][r+0],!0),o.setUint16(a+2*i,w[n][r+1],!0),o.setUint16(a+4*i,w[n][r+2],!0),o.setUint16(a+6*i,w[n][r+3],!0),o.setUint16(a+8*i,w[n][r+4],!0),o.setUint16(a+10*i,w[n][r+5],!0),o.setUint16(a+12*i,w[n][r+6],!0),o.setUint16(a+14*i,w[n][r+7],!0),a+=16*i}}if(u!=d)for(let e=8*t;e<8*t+M;++e){let t=b[n][e]+8*u*2*i,r=64*u+(7&e)*8;for(let e=0;e<_;++e)o.setUint16(t+2*e*i,w[n][r+e],!0)}}}for(var S=new Uint16Array(s),o=new DataView(a.buffer),P=0;P<3;++P){r[e.idx[P]].decoded=!0;var A=r[e.idx[P]].type;if(2==r[P].type)for(var C=0;C<c;++C){let e=b[P][C];for(var T=0;T<s;++T)S[T]=o.getUint16(e+2*T*A,!0);for(var T=0;T<s;++T)o.setFloat32(e+2*T*A,U(S[T]),!0)}}}(x,D,m,S,O,n);for(var g=0;g<m.length;++g){var y=m[g];if(!y.decoded){if(2===y.compression)for(var F=0,N=0,I=0;I<e.lines;++I){for(var H=D[g][F],B=0;B<y.width;++B){for(var W=0;W<2*y.type;++W)n[H++]=R[N+W*y.width*y.height];N++}F++}else throw"EXRLoader.parse: unsupported channel compression"}}return new DataView(n.buffer)}function M(e,t){for(var r=new Uint8Array(e),n=0;0!=r[t.value+n];)n+=1;var i=new TextDecoder().decode(r.slice(t.value,t.value+n));return t.value=t.value+n+1,i}function _(e,t){var r=e.getInt32(t.value,!0);return t.value=t.value+4,r}function S(e,t){var r=e.getUint32(t.value,!0);return t.value=t.value+4,r}function P(e,t){var r=e[t.value];return t.value=t.value+1,r}function A(e,t){var r=e.getUint8(t.value);return t.value=t.value+1,r}let C=function(e,t){let r;return"getBigInt64"in DataView.prototype?r=Number(e.getBigInt64(t.value,!0)):r=e.getUint32(t.value+4,!0)+Number(e.getUint32(t.value,!0)<<32),t.value+=8,r};function T(e,t){var r=e.getFloat32(t.value,!0);return t.value+=4,r}function O(e,t){return l.A5E.toHalfFloat(T(e,t))}function U(e){var t=(31744&e)>>10,r=1023&e;return(e>>15?-1:1)*(t?31===t?r?NaN:1/0:Math.pow(2,t-15)*(1+r/1024):r/1024*6103515625e-14)}function L(e,t){var r=e.getUint16(t.value,!0);return t.value+=2,r}function R(e,t){return U(L(e,t))}let z=new DataView(e),D=new Uint8Array(e),I={value:0},k=function(e,t,r){let n={};if(20000630!=e.getUint32(0,!0))throw"THREE.EXRLoader: provided file doesn't appear to be in OpenEXR format.";n.version=e.getUint8(4);let i=e.getUint8(5);n.spec={singleTile:!!(2&i),longName:!!(4&i),deepFormat:!!(8&i),multiPart:!!(16&i)},r.value=8;for(var a=!0;a;){var o=M(t,r);if(0==o)a=!1;else{var s=M(t,r),l=S(e,r),c=function(e,t,r,n,i){var a,o,s,l,c;if("string"===n||"stringvector"===n||"iccProfile"===n)return a=new TextDecoder().decode(new Uint8Array(t).slice(r.value,r.value+i)),r.value=r.value+i,a;if("chlist"===n)return function(e,t,r,n){for(var i=r.value,a=[];r.value<i+n-1;){var o=M(t,r),s=_(e,r),l=A(e,r);r.value+=3;var c=_(e,r),u=_(e,r);a.push({name:o,pixelType:s,pLinear:l,xSampling:c,ySampling:u})}return r.value+=1,a}(e,t,r,i);if("chromaticities"===n)return o=T(e,r),s=T(e,r),l=T(e,r),c=T(e,r),{redX:o,redY:s,greenX:l,greenY:c,blueX:T(e,r),blueY:T(e,r),whiteX:T(e,r),whiteY:T(e,r)};if("compression"===n)return["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"][A(e,r)];if("box2i"===n)return{xMin:S(e,r),yMin:S(e,r),xMax:S(e,r),yMax:S(e,r)};if("lineOrder"===n)return["INCREASING_Y"][A(e,r)];if("float"===n)return T(e,r);else if("v2f"===n)return[T(e,r),T(e,r)];else if("v3f"===n)return[T(e,r),T(e,r),T(e,r)];else if("int"===n)return _(e,r);else if("rational"===n)return[_(e,r),S(e,r)];else if("timecode"===n)return[S(e,r),S(e,r)];else return"preview"===n?(r.value+=i,"skipped"):void(r.value+=i)}(e,t,r,s,l);void 0===c?console.warn(`EXRLoader.parse: skipped unknown header attribute type '${s}'.`):n[o]=c}}if((-5&i)!=0)throw console.error("EXRHeader:",n),"THREE.EXRLoader: provided file is currently unsupported.";return n}(z,e,I),j=function(e,t,r,n,i){let a={size:0,viewer:t,array:r,offset:n,width:e.dataWindow.xMax-e.dataWindow.xMin+1,height:e.dataWindow.yMax-e.dataWindow.yMin+1,channels:e.channels.length,bytesPerLine:null,lines:null,inputSize:null,type:e.channels[0].pixelType,uncompress:null,getter:null,format:null,[et?"colorSpace":"encoding"]:null};switch(e.compression){case"NO_COMPRESSION":a.lines=1,a.uncompress=g;break;case"RLE_COMPRESSION":a.lines=1,a.uncompress=y;break;case"ZIPS_COMPRESSION":a.lines=1,a.uncompress=w;break;case"ZIP_COMPRESSION":a.lines=16,a.uncompress=w;break;case"PIZ_COMPRESSION":a.lines=32,a.uncompress=b;break;case"PXR24_COMPRESSION":a.lines=16,a.uncompress=x;break;case"DWAA_COMPRESSION":a.lines=32,a.uncompress=E;break;case"DWAB_COMPRESSION":a.lines=256,a.uncompress=E;break;default:throw"EXRLoader.parse: "+e.compression+" is unsupported"}if(a.scanlineBlockSize=a.lines,1==a.type)switch(i){case l.VzW:a.getter=R,a.inputSize=2;break;case l.cLu:a.getter=L,a.inputSize=2}else if(2==a.type)switch(i){case l.VzW:a.getter=T,a.inputSize=4;break;case l.cLu:a.getter=O,a.inputSize=4}else throw"EXRLoader.parse: unsupported pixelType "+a.type+" for "+e.compression+".";a.blockCount=(e.dataWindow.yMax+1)/a.scanlineBlockSize;for(var o=0;o<a.blockCount;o++)C(t,n);a.outputChannels=3==a.channels?4:a.channels;let s=a.width*a.height*a.outputChannels;switch(i){case l.VzW:a.byteArray=new Float32Array(s),a.channels<a.outputChannels&&a.byteArray.fill(1,0,s);break;case l.cLu:a.byteArray=new Uint16Array(s),a.channels<a.outputChannels&&a.byteArray.fill(15360,0,s);break;default:console.error("THREE.EXRLoader: unsupported type: ",i)}return a.bytesPerLine=a.width*a.inputSize*a.channels,4==a.outputChannels?a.format=l.wk1:a.format=l.hEm,et?a.colorSpace="srgb-linear":a.encoding=3e3,a}(k,z,D,I,this.type),F={value:0},N={R:0,G:1,B:2,A:3,Y:0};for(let e=0;e<j.height/j.scanlineBlockSize;e++){let t=S(z,I);j.size=S(z,I),j.lines=t+j.scanlineBlockSize>j.height?j.height-t:j.scanlineBlockSize;let r=j.size<j.lines*j.bytesPerLine?j.uncompress(j):g(j);I.value+=j.size;for(let t=0;t<j.scanlineBlockSize;t++){let n=t+e*j.scanlineBlockSize;if(n>=j.height)break;for(let e=0;e<j.channels;e++){let i=N[k.channels[e].name];for(let a=0;a<j.width;a++){F.value=(j.channels*j.width*t+e*j.width+a)*j.inputSize;let o=(j.height-1-n)*(j.width*j.outputChannels)+a*j.outputChannels+i;j.byteArray[o]=j.getter(r,F)}}}}return{header:k,width:j.width,height:j.height,data:j.byteArray,format:j.format,[et?"colorSpace":"encoding"]:j[et?"colorSpace":"encoding"],type:this.type}}setDataType(e){return this.type=e,this}load(e,t,r,n){return super.load(e,function(e,r){et?e.colorSpace=r.colorSpace:e.encoding=r.encoding,e.minFilter=l.wem,e.magFilter=l.wem,e.generateMipmaps=!1,e.flipY=!1,t&&t(e,r)},r,n)}}let en=(e,t,r)=>{let n;switch(e){case l.ywz:n=new Uint8ClampedArray(t*r*4);break;case l.cLu:n=new Uint16Array(t*r*4);break;case l.JQ4:n=new Uint32Array(t*r*4);break;case l.T95:n=new Int8Array(t*r*4);break;case l.iAb:n=new Int16Array(t*r*4);break;case l.Kz5:n=new Int32Array(t*r*4);break;case l.VzW:n=new Float32Array(t*r*4);break;default:throw Error("Unsupported data type")}return n},ei=(e,t,r,i)=>{if(void 0!==n)return n;let a=new l.dd2(1,1,i);t.setRenderTarget(a);let o=new l.Kj0(new l._12,new l.vBJ({color:16777215}));t.render(o,r),t.setRenderTarget(null);let s=en(e,a.width,a.height);return t.readRenderTargetPixels(a,0,0,a.width,a.height,s),a.dispose(),o.geometry.dispose(),o.material.dispose(),n=0!==s[0]};class ea{_renderer;_rendererIsDisposable=!1;_material;_scene;_camera;_quad;_renderTarget;_width;_height;_type;_colorSpace;_supportsReadPixels=!0;constructor(e){this._width=e.width,this._height=e.height,this._type=e.type,this._colorSpace=e.colorSpace;let t={format:l.wk1,depthBuffer:!1,stencilBuffer:!1,type:this._type,colorSpace:this._colorSpace,anisotropy:e.renderTargetOptions?.anisotropy!==void 0?e.renderTargetOptions?.anisotropy:1,generateMipmaps:e.renderTargetOptions?.generateMipmaps!==void 0&&e.renderTargetOptions?.generateMipmaps,magFilter:e.renderTargetOptions?.magFilter!==void 0?e.renderTargetOptions?.magFilter:l.wem,minFilter:e.renderTargetOptions?.minFilter!==void 0?e.renderTargetOptions?.minFilter:l.wem,samples:e.renderTargetOptions?.samples!==void 0?e.renderTargetOptions?.samples:void 0,wrapS:e.renderTargetOptions?.wrapS!==void 0?e.renderTargetOptions?.wrapS:l.uWy,wrapT:e.renderTargetOptions?.wrapT!==void 0?e.renderTargetOptions?.wrapT:l.uWy};if(this._material=e.material,e.renderer?this._renderer=e.renderer:(this._renderer=ea.instantiateRenderer(),this._rendererIsDisposable=!0),this._scene=new l.xsS,this._camera=new l.iKG,this._camera.position.set(0,0,10),this._camera.left=-.5,this._camera.right=.5,this._camera.top=.5,this._camera.bottom=-.5,this._camera.updateProjectionMatrix(),!ei(this._type,this._renderer,this._camera,t)){let e;this._type===l.cLu&&(e=this._renderer.extensions.has("EXT_color_buffer_float")?l.VzW:void 0),void 0!==e?(console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${l.VzW}`),this._type=e):(this._supportsReadPixels=!1,console.warn("This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown"))}this._quad=new l.Kj0(new l._12,this._material),this._quad.geometry.computeBoundingBox(),this._scene.add(this._quad),this._renderTarget=new l.dd2(this.width,this.height,t),this._renderTarget.texture.mapping=e.renderTargetOptions?.mapping!==void 0?e.renderTargetOptions?.mapping:l.xfE}static instantiateRenderer(){let e=new c.WebGLRenderer;return e.setSize(128,128),e}render=()=>{this._renderer.setRenderTarget(this._renderTarget);try{this._renderer.render(this._scene,this._camera)}catch(e){throw this._renderer.setRenderTarget(null),e}this._renderer.setRenderTarget(null)};toArray(){if(!this._supportsReadPixels)throw Error("Can't read pixels in this browser");let e=en(this._type,this._width,this._height);return this._renderer.readRenderTargetPixels(this._renderTarget,0,0,this._width,this._height,e),e}toDataTexture(e){let t=new l.IEO(this.toArray(),this.width,this.height,l.wk1,this._type,e?.mapping||l.xfE,e?.wrapS||l.uWy,e?.wrapT||l.uWy,e?.magFilter||l.wem,e?.minFilter||l.wem,e?.anisotropy||1,l.GUF);return t.generateMipmaps=e?.generateMipmaps!==void 0&&e?.generateMipmaps,t}disposeOnDemandRenderer(){this._renderer.setRenderTarget(null),this._rendererIsDisposable&&(this._renderer.dispose(),this._renderer.forceContextLoss())}dispose(e){this.disposeOnDemandRenderer(),e&&this.renderTarget.dispose(),this.material instanceof l.jyz&&Object.values(this.material.uniforms).forEach(e=>{e.value instanceof l.xEZ&&e.value.dispose()}),Object.values(this.material).forEach(e=>{e instanceof l.xEZ&&e.dispose()}),this.material.dispose(),this._quad.geometry.dispose()}get width(){return this._width}set width(e){this._width=e,this._renderTarget.setSize(this._width,this._height)}get height(){return this._height}set height(e){this._height=e,this._renderTarget.setSize(this._width,this._height)}get renderer(){return this._renderer}get renderTarget(){return this._renderTarget}set renderTarget(e){this._renderTarget=e,this._width=e.width,this._height=e.height}get material(){return this._material}get type(){return this._type}get colorSpace(){return this._colorSpace}}class eo extends Error{}class es extends Error{}let el=(e,t,r)=>{let n=RegExp(`${t}="([^"]*)"`,"i").exec(e);if(n)return n[1];let i=RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`,"i").exec(e);if(i){let e=i[1].match(/<rdf:li>([^<]*)<\/rdf:li>/g);return e&&3===e.length?e.map(e=>e.replace(/<\/?rdf:li>/g,"")):i[1].trim()}if(void 0!==r)return r;throw Error(`Can't find ${t} in gainmap metadata`)},ec=e=>{let t;"undefined"!=typeof TextDecoder?t=new TextDecoder().decode(e):t=e.toString();let r=t.indexOf("<x:xmpmeta");for(;-1!==r;){let e=t.indexOf("x:xmpmeta>",r),n=t.slice(r,e+10);try{let e=el(n,"hdrgm:GainMapMin","0"),t=el(n,"hdrgm:GainMapMax"),r=el(n,"hdrgm:Gamma","1"),i=el(n,"hdrgm:OffsetSDR","0.015625"),a=el(n,"hdrgm:OffsetHDR","0.015625"),o=/hdrgm:HDRCapacityMin="([^"]*)"/.exec(n),s=o?o[1]:"0",l=/hdrgm:HDRCapacityMax="([^"]*)"/.exec(n);if(!l)throw Error("Incomplete gainmap metadata");let c=l[1];return{gainMapMin:Array.isArray(e)?e.map(e=>parseFloat(e)):[parseFloat(e),parseFloat(e),parseFloat(e)],gainMapMax:Array.isArray(t)?t.map(e=>parseFloat(e)):[parseFloat(t),parseFloat(t),parseFloat(t)],gamma:Array.isArray(r)?r.map(e=>parseFloat(e)):[parseFloat(r),parseFloat(r),parseFloat(r)],offsetSdr:Array.isArray(i)?i.map(e=>parseFloat(e)):[parseFloat(i),parseFloat(i),parseFloat(i)],offsetHdr:Array.isArray(a)?a.map(e=>parseFloat(e)):[parseFloat(a),parseFloat(a),parseFloat(a)],hdrCapacityMin:parseFloat(s),hdrCapacityMax:parseFloat(c)}}catch(e){}r=t.indexOf("<x:xmpmeta",e)}};class eu{options;constructor(e){this.options={debug:!!e&&void 0!==e.debug&&e.debug,extractFII:!e||void 0===e.extractFII||e.extractFII,extractNonFII:!e||void 0===e.extractNonFII||e.extractNonFII}}extract(e){return new Promise((t,r)=>{let n;let i=this.options.debug,a=new DataView(e.buffer);if(65496!==a.getUint16(0)){r(Error("Not a valid jpeg"));return}let o=a.byteLength,s=2,l=0;for(;s<o;){if(++l>250){r(Error(`Found no marker after ${l} loops 😵`));return}if(255!==a.getUint8(s)){r(Error(`Not a valid marker at offset 0x${s.toString(16)}, found: 0x${a.getUint8(s).toString(16)}`));return}if(n=a.getUint8(s+1),i&&console.log(`Marker: ${n.toString(16)}`),226===n){i&&console.log("Found APP2 marker (0xffe2)");let e=s+4;if(1297106432===a.getUint32(e)){let n;let i=e+4;if(18761===a.getUint16(i))n=!1;else if(19789===a.getUint16(i))n=!0;else{r(Error("No valid endianness marker found in TIFF header"));return}if(42!==a.getUint16(i+2,!n)){r(Error("Not valid TIFF data! (no 0x002A marker)"));return}let o=a.getUint32(i+4,!n);if(o<8){r(Error("Not valid TIFF data! (First offset less than 8)"));return}let s=i+o,l=a.getUint16(s,!n),c=s+2,u=0;for(let e=c;e<c+12*l;e+=12)45057===a.getUint16(e,!n)&&(u=a.getUint32(e+8,!n));let d=s+2+12*l+4,f=[];for(let e=d;e<d+16*u;e+=16){let t={MPType:a.getUint32(e,!n),size:a.getUint32(e+4,!n),dataOffset:a.getUint32(e+8,!n),dependantImages:a.getUint32(e+12,!n),start:-1,end:-1,isFII:!1};t.dataOffset?(t.start=i+t.dataOffset,t.isFII=!1):(t.start=0,t.isFII=!0),t.end=t.start+t.size,f.push(t)}if(this.options.extractNonFII&&f.length){let e=new Blob([a]),r=[];for(let t of f){if(t.isFII&&!this.options.extractFII)continue;let n=e.slice(t.start,t.end+1,"image/jpeg");r.push(n)}t(r)}}}s+=2+a.getUint16(s+2)}})}}let ed=async e=>{let t=ec(e);if(!t)throw new es("Gain map XMP metadata not found");let r=new eu({extractFII:!0,extractNonFII:!0}),n=await r.extract(e);if(2!==n.length)throw new eo("Gain map recovery image not found");return{sdr:new Uint8Array(await n[0].arrayBuffer()),gainMap:new Uint8Array(await n[1].arrayBuffer()),metadata:t}},ef=e=>new Promise((t,r)=>{let n=document.createElement("img");n.onload=()=>{t(n)},n.onerror=e=>{r(e)},n.src=URL.createObjectURL(e)});class eh extends l.aNw{_renderer;_renderTargetOptions;_internalLoadingManager;_config;constructor(e,t){super(t),this._config=e,e.renderer&&(this._renderer=e.renderer),this._internalLoadingManager=new l.lLk}setRenderer(e){return this._renderer=e,this}setRenderTargetOptions(e){return this._renderTargetOptions=e,this}prepareQuadRenderer(){this._renderer||console.warn("WARNING: A Renderer was not passed to this Loader constructor or in setRenderer, the result of this Loader will need to be converted to a Data Texture with toDataTexture() before you can use it in your renderer.");let e=this._config.createMaterial({gainMapMax:[1,1,1],gainMapMin:[0,0,0],gamma:[1,1,1],offsetHdr:[1,1,1],offsetSdr:[1,1,1],hdrCapacityMax:1,hdrCapacityMin:0,maxDisplayBoost:1,gainMap:new l.xEZ,sdr:new l.xEZ});return this._config.createQuadRenderer({width:16,height:16,type:l.cLu,colorSpace:l.GUF,material:e,renderer:this._renderer,renderTargetOptions:this._renderTargetOptions})}async processImages(e,t,r){let n,i;let a=t?new Blob([t],{type:"image/jpeg"}):void 0,o=new Blob([e],{type:"image/jpeg"}),s=!1;if("undefined"==typeof createImageBitmap){let e=await Promise.all([a?ef(a):Promise.resolve(void 0),ef(o)]);i=e[0],n=e[1],s="flipY"===r}else{let e=await Promise.all([a?createImageBitmap(a,{imageOrientation:r||"flipY"}):Promise.resolve(void 0),createImageBitmap(o,{imageOrientation:r||"flipY"})]);i=e[0],n=e[1]}return{sdrImage:n,gainMapImage:i,needsFlip:s}}createTextures(e,t,r){let n=new l.xEZ(t||new ImageData(2,2),l.xfE,l.uWy,l.uWy,l.wem,l.FDw,l.wk1,l.ywz,1,l.GUF);n.flipY=r,n.needsUpdate=!0;let i=new l.xEZ(e,l.xfE,l.uWy,l.uWy,l.wem,l.FDw,l.wk1,l.ywz,1,l.KI_);return i.flipY=r,i.needsUpdate=!0,{gainMap:n,sdr:i}}updateQuadRenderer(e,t,r,n,i){e.width=t.width,e.height=t.height,e.material.gainMap=r,e.material.sdr=n,e.material.gainMapMin=i.gainMapMin,e.material.gainMapMax=i.gainMapMax,e.material.offsetHdr=i.offsetHdr,e.material.offsetSdr=i.offsetSdr,e.material.gamma=i.gamma,e.material.hdrCapacityMin=i.hdrCapacityMin,e.material.hdrCapacityMax=i.hdrCapacityMax,e.material.maxDisplayBoost=Math.pow(2,i.hdrCapacityMax),e.material.needsUpdate=!0}}let ep=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,em=`
// min half float value
#define HALF_FLOAT_MIN vec3( -65504, -65504, -65504 )
// max half float value
#define HALF_FLOAT_MAX vec3( 65504, 65504, 65504 )

uniform sampler2D sdr;
uniform sampler2D gainMap;
uniform vec3 gamma;
uniform vec3 offsetHdr;
uniform vec3 offsetSdr;
uniform vec3 gainMapMin;
uniform vec3 gainMapMax;
uniform float weightFactor;

varying vec2 vUv;

void main() {
  vec3 rgb = texture2D( sdr, vUv ).rgb;
  vec3 recovery = texture2D( gainMap, vUv ).rgb;
  vec3 logRecovery = pow( recovery, gamma );
  vec3 logBoost = gainMapMin * ( 1.0 - logRecovery ) + gainMapMax * logRecovery;
  vec3 hdrColor = (rgb + offsetSdr) * exp2( logBoost * weightFactor ) - offsetHdr;
  vec3 clampedHdrColor = max( HALF_FLOAT_MIN, min( HALF_FLOAT_MAX, hdrColor ));
  gl_FragColor = vec4( clampedHdrColor , 1.0 );
}
`;class ev extends l.jyz{_maxDisplayBoost;_hdrCapacityMin;_hdrCapacityMax;constructor({gamma:e,offsetHdr:t,offsetSdr:r,gainMapMin:n,gainMapMax:i,maxDisplayBoost:a,hdrCapacityMin:o,hdrCapacityMax:s,sdr:c,gainMap:u}){super({name:"GainMapDecoderMaterial",vertexShader:ep,fragmentShader:em,uniforms:{sdr:{value:c},gainMap:{value:u},gamma:{value:new l.Pa4(1/e[0],1/e[1],1/e[2])},offsetHdr:{value:new l.Pa4().fromArray(t)},offsetSdr:{value:new l.Pa4().fromArray(r)},gainMapMin:{value:new l.Pa4().fromArray(n)},gainMapMax:{value:new l.Pa4().fromArray(i)},weightFactor:{value:(Math.log2(a)-o)/(s-o)}},blending:l.jFi,depthTest:!1,depthWrite:!1}),this._maxDisplayBoost=a,this._hdrCapacityMin=o,this._hdrCapacityMax=s,this.needsUpdate=!0,this.uniformsNeedUpdate=!0}get sdr(){return this.uniforms.sdr.value}set sdr(e){this.uniforms.sdr.value=e}get gainMap(){return this.uniforms.gainMap.value}set gainMap(e){this.uniforms.gainMap.value=e}get offsetHdr(){return this.uniforms.offsetHdr.value.toArray()}set offsetHdr(e){this.uniforms.offsetHdr.value.fromArray(e)}get offsetSdr(){return this.uniforms.offsetSdr.value.toArray()}set offsetSdr(e){this.uniforms.offsetSdr.value.fromArray(e)}get gainMapMin(){return this.uniforms.gainMapMin.value.toArray()}set gainMapMin(e){this.uniforms.gainMapMin.value.fromArray(e)}get gainMapMax(){return this.uniforms.gainMapMax.value.toArray()}set gainMapMax(e){this.uniforms.gainMapMax.value.fromArray(e)}get gamma(){let e=this.uniforms.gamma.value;return[1/e.x,1/e.y,1/e.z]}set gamma(e){let t=this.uniforms.gamma.value;t.x=1/e[0],t.y=1/e[1],t.z=1/e[2]}get hdrCapacityMin(){return this._hdrCapacityMin}set hdrCapacityMin(e){this._hdrCapacityMin=e,this.calculateWeight()}get hdrCapacityMax(){return this._hdrCapacityMax}set hdrCapacityMax(e){this._hdrCapacityMax=e,this.calculateWeight()}get maxDisplayBoost(){return this._maxDisplayBoost}set maxDisplayBoost(e){this._maxDisplayBoost=Math.max(1,Math.min(65504,e)),this.calculateWeight()}calculateWeight(){let e=(Math.log2(this._maxDisplayBoost)-this._hdrCapacityMin)/(this._hdrCapacityMax-this._hdrCapacityMin);this.uniforms.weightFactor.value=Math.max(0,Math.min(1,e))}}i={renderer:c.WebGLRenderer,createMaterial:e=>new ev(e),createQuadRenderer:e=>new ea(e)},e=>{let{sdr:t,gainMap:r,renderer:n}=e;t.colorSpace!==l.KI_&&(console.warn("SDR Colorspace needs to be *SRGBColorSpace*, setting it automatically"),t.colorSpace=l.KI_),t.needsUpdate=!0,r.colorSpace!==l.GUF&&(console.warn("Gainmap Colorspace needs to be *LinearSRGBColorSpace*, setting it automatically"),r.colorSpace=l.GUF),r.needsUpdate=!0;let a=i.createMaterial({...e,sdr:t,gainMap:r});return i.createQuadRenderer({width:t.image.width,height:t.image.height,type:l.cLu,colorSpace:l.GUF,material:a,renderer:n,renderTargetOptions:e.renderTargetOptions})};class eg extends eh{constructor(e,t){super({renderer:e,createMaterial:e=>new ev(e),createQuadRenderer:e=>new ea(e)},t)}async render(e,t,r,n){let{sdrImage:i,gainMapImage:a,needsFlip:o}=await this.processImages(r,n,"flipY"),{gainMap:s,sdr:l}=this.createTextures(i,a,o);this.updateQuadRenderer(e,i,s,l,t),e.render()}}class ey extends eg{load([e,t,r],n,i,a){let o,s,c;let u=this.prepareQuadRenderer(),d=async()=>{if(o&&s&&c){try{await this.render(u,c,o,s)}catch(n){this.manager.itemError(e),this.manager.itemError(t),this.manager.itemError(r),"function"==typeof a&&a(n),u.disposeOnDemandRenderer();return}"function"==typeof n&&n(u),this.manager.itemEnd(e),this.manager.itemEnd(t),this.manager.itemEnd(r),u.disposeOnDemandRenderer()}},f=!0,h=0,p=0,m=!0,v=0,g=0,y=!0,w=0,b=0,x=()=>{"function"==typeof i&&i(new ProgressEvent("progress",{lengthComputable:f&&m&&y,loaded:p+g+b,total:h+v+w}))};this.manager.itemStart(e),this.manager.itemStart(t),this.manager.itemStart(r);let E=new l.hH6(this._internalLoadingManager);E.setResponseType("arraybuffer"),E.setRequestHeader(this.requestHeader),E.setPath(this.path),E.setWithCredentials(this.withCredentials),E.load(e,async e=>{if("string"==typeof e)throw Error("Invalid sdr buffer");o=e,await d()},e=>{f=e.lengthComputable,p=e.loaded,h=e.total,x()},t=>{this.manager.itemError(e),"function"==typeof a&&a(t)});let M=new l.hH6(this._internalLoadingManager);M.setResponseType("arraybuffer"),M.setRequestHeader(this.requestHeader),M.setPath(this.path),M.setWithCredentials(this.withCredentials),M.load(t,async e=>{if("string"==typeof e)throw Error("Invalid gainmap buffer");s=e,await d()},e=>{m=e.lengthComputable,g=e.loaded,v=e.total,x()},e=>{this.manager.itemError(t),"function"==typeof a&&a(e)});let _=new l.hH6(this._internalLoadingManager);return _.setRequestHeader(this.requestHeader),_.setPath(this.path),_.setWithCredentials(this.withCredentials),_.load(r,async e=>{if("string"!=typeof e)throw Error("Invalid metadata string");c=JSON.parse(e),await d()},e=>{y=e.lengthComputable,b=e.loaded,w=e.total,x()},e=>{this.manager.itemError(r),"function"==typeof a&&a(e)}),u}}class ew extends eg{load(e,t,r,n){let i=this.prepareQuadRenderer(),a=new l.hH6(this._internalLoadingManager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(this.withCredentials),this.manager.itemStart(e),a.load(e,async r=>{let a,o,s;if("string"==typeof r)throw Error("Invalid buffer, received [string], was expecting [ArrayBuffer]");let l=new Uint8Array(r);try{let e=await ed(l);a=e.sdr,o=e.gainMap,s=e.metadata}catch(t){if(t instanceof es||t instanceof eo)console.warn(`Failure to reconstruct an HDR image from ${e}: Gain map metadata not found in the file, HDRJPGLoader will render the SDR jpeg`),s={gainMapMin:[0,0,0],gainMapMax:[1,1,1],gamma:[1,1,1],hdrCapacityMin:0,hdrCapacityMax:1,offsetHdr:[0,0,0],offsetSdr:[0,0,0]},a=l;else throw t}try{await this.render(i,s,a.buffer,o?.buffer)}catch(t){this.manager.itemError(e),"function"==typeof n&&n(t),i.disposeOnDemandRenderer();return}"function"==typeof t&&t(i),this.manager.itemEnd(e),i.disposeOnDemandRenderer()},r,t=>{this.manager.itemError(e),"function"==typeof n&&n(t)}),i}}let eb={apartment:"lebombo_1k.hdr",city:"potsdamer_platz_1k.hdr",dawn:"kiara_1_dawn_1k.hdr",forest:"forest_slope_1k.hdr",lobby:"st_fagans_interior_1k.hdr",night:"dikhololo_night_1k.hdr",park:"rooitou_park_1k.hdr",studio:"studio_small_03_1k.hdr",sunset:"venice_sunset_1k.hdr",warehouse:"empty_warehouse_01_1k.hdr"},ex="https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/",eE=e=>Array.isArray(e),eM=["/px.png","/nx.png","/py.png","/ny.png","/pz.png","/nz.png"];function e_({files:e=eM,path:t="",preset:r,colorSpace:n,extensions:i}={}){r&&(eA(r),e=eb[r],t=ex);let a=eE(e),{extension:c,isCubemap:u}=eC(e),d=eT(c);if(!d)throw Error("useEnvironment: Unrecognized file extension: "+e);let f=(0,s.C)(e=>e.gl);(0,o.useLayoutEffect)(()=>{("webp"===c||"jpg"===c||"jpeg"===c)&&f.domElement.addEventListener("webglcontextlost",function(){s.G.clear(d,a?[e]:e)},{once:!0})},[e,f.domElement]);let h=(0,s.G)(d,a?[e]:e,e=>{("webp"===c||"jpg"===c||"jpeg"===c)&&e.setRenderer(f),null==e.setPath||e.setPath(t),i&&i(e)}),p=a?h[0]:h;if("jpg"===c||"jpeg"===c||"webp"===c){var m;p=null==(m=p.renderTarget)?void 0:m.texture}return p.mapping=u?l.fY$:l.dSO,p.colorSpace=null!=n?n:u?"srgb":"srgb-linear",p}let eS={files:eM,path:"",preset:void 0,extensions:void 0};e_.preload=e=>{let t={...eS,...e},{files:r,path:n=""}=t,{preset:i,extensions:a}=t;i&&(eA(i),r=eb[i],n=ex);let{extension:o}=eC(r);if("webp"===o||"jpg"===o||"jpeg"===o)throw Error("useEnvironment: Preloading gainmaps is not supported");let l=eT(o);if(!l)throw Error("useEnvironment: Unrecognized file extension: "+r);s.G.preload(l,eE(r)?[r]:r,e=>{null==e.setPath||e.setPath(n),a&&a(e)})};let eP={files:eM,preset:void 0};function eA(e){if(!(e in eb))throw Error("Preset must be one of: "+Object.keys(eb).join(", "))}function eC(e){var t;let r=eE(e)&&6===e.length,n=eE(e)&&3===e.length&&e.some(e=>e.endsWith("json")),i=eE(e)?e[0]:e;return{extension:r?"cube":n?"webp":i.startsWith("data:application/exr")?"exr":i.startsWith("data:application/hdr")?"hdr":i.startsWith("data:image/jpeg")?"jpg":null==(t=i.split(".").pop())||null==(t=t.split("?"))||null==(t=t.shift())?void 0:t.toLowerCase(),isCubemap:r,isGainmap:n}}function eT(e){return"cube"===e?l.cBK:"hdr"===e?h:"exr"===e?er:"jpg"===e||"jpeg"===e?ew:"webp"===e?ey:null}e_.clear=e=>{let t={...eP,...e},{files:r}=t,{preset:n}=t;n&&(eA(n),r=eb[n]);let{extension:i}=eC(r),a=eT(i);if(!a)throw Error("useEnvironment: Unrecognized file extension: "+r);s.G.clear(a,eE(r)?[r]:r)};let eO=e=>e.current&&e.current.isScene,eU=e=>eO(e)?e.current:e;function eL(e,t,r,n,i={}){var a,o,l,c;i={backgroundBlurriness:0,backgroundIntensity:1,backgroundRotation:[0,0,0],environmentIntensity:1,environmentRotation:[0,0,0],...i};let u=eU(t||r),d=u.background,f=u.environment,h={backgroundBlurriness:u.backgroundBlurriness,backgroundIntensity:u.backgroundIntensity,backgroundRotation:null!==(a=null==(o=u.backgroundRotation)||null==o.clone?void 0:o.clone())&&void 0!==a?a:[0,0,0],environmentIntensity:u.environmentIntensity,environmentRotation:null!==(l=null==(c=u.environmentRotation)||null==c.clone?void 0:c.clone())&&void 0!==l?l:[0,0,0]};return"only"!==e&&(u.environment=n),e&&(u.background=n),(0,s.s)(u,i),()=>{"only"!==e&&(u.environment=f),e&&(u.background=d),(0,s.s)(u,h)}}function eR({scene:e,background:t=!1,map:r,...n}){let i=(0,s.C)(e=>e.scene);return o.useLayoutEffect(()=>{if(r)return eL(t,e,i,r,n)}),null}function ez({background:e=!1,scene:t,blur:r,backgroundBlurriness:n,backgroundIntensity:i,backgroundRotation:a,environmentIntensity:l,environmentRotation:c,...u}){let d=e_(u),f=(0,s.C)(e=>e.scene);return o.useLayoutEffect(()=>eL(e,t,f,d,{backgroundBlurriness:null!=r?r:n,backgroundIntensity:i,backgroundRotation:a,environmentIntensity:l,environmentRotation:c})),o.useEffect(()=>()=>{d.dispose()},[d]),null}function eD({children:e,near:t=.1,far:r=1e3,resolution:n=256,frames:i=1,map:a,background:u=!1,blur:d,backgroundBlurriness:f,backgroundIntensity:h,backgroundRotation:p,environmentIntensity:m,environmentRotation:v,scene:g,files:y,path:w,preset:b,extensions:x}){let E=(0,s.C)(e=>e.gl),M=(0,s.C)(e=>e.scene),_=o.useRef(null),[S]=o.useState(()=>new l.xsS),P=o.useMemo(()=>{let e=new c.WebGLCubeRenderTarget(n);return e.texture.type=l.cLu,e},[n]);o.useEffect(()=>()=>{P.dispose()},[P]),o.useLayoutEffect(()=>{if(1===i){let e=E.autoClear;E.autoClear=!0,_.current.update(E,S),E.autoClear=e}return eL(u,g,M,P.texture,{backgroundBlurriness:null!=d?d:f,backgroundIntensity:h,backgroundRotation:p,environmentIntensity:m,environmentRotation:v})},[e,S,P.texture,g,M,u,i,E]);let A=1;return(0,s.D)(()=>{if(i===1/0||A<i){let e=E.autoClear;E.autoClear=!0,_.current.update(E,S),E.autoClear=e,A++}}),o.createElement(o.Fragment,null,(0,s.o)(o.createElement(o.Fragment,null,e,o.createElement("cubeCamera",{ref:_,args:[t,r,P]}),y||b?o.createElement(ez,{background:!0,files:y,preset:b,path:w,extensions:x}):a?o.createElement(eR,{background:!0,map:a,extensions:x}):null),S))}function eI(e){var t,r,n,i;let l=e_(e),c=e.map||l;o.useMemo(()=>(0,s.e)({GroundProjectedEnvImpl:f}),[]),o.useEffect(()=>()=>{l.dispose()},[l]);let u=o.useMemo(()=>[c],[c]),d=null==(t=e.ground)?void 0:t.height,h=null==(r=e.ground)?void 0:r.radius,p=null!==(n=null==(i=e.ground)?void 0:i.scale)&&void 0!==n?n:1e3;return o.createElement(o.Fragment,null,o.createElement(eR,(0,a.Z)({},e,{map:c})),o.createElement("groundProjectedEnvImpl",{args:u,scale:p,height:d,radius:h}))}function ek(e){return e.ground?o.createElement(eI,e):e.map?o.createElement(eR,e):e.children?o.createElement(eD,e):o.createElement(ez,e)}},63301:function(e,t,r){"use strict";r.d(t,{r:function(){return h}});var n,i,a,o,s=r(17610),l=r(7653),c=r(86995),u=r(35758);let d=parseInt(c.UZH.replace(/\D+/g,"")),f=(n={cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new c.Ilk,sectionColor:new c.Ilk,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new c.Pa4,worldPlanePosition:new c.Pa4},i=`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,a=`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${d>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `,(o=class extends c.jyz{constructor(e){for(let t in super({vertexShader:i,fragmentShader:a,...e}),n)this.uniforms[t]=new c.xWb(n[t]),Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}});this.uniforms=c.rDY.clone(this.uniforms)}}).key=c.M8C.generateUUID(),o),h=l.forwardRef(({args:e,cellColor:t="#000000",sectionColor:r="#2080ff",cellSize:n=.5,sectionSize:i=1,followCamera:a=!1,infiniteGrid:o=!1,fadeDistance:d=100,fadeStrength:h=1,fadeFrom:p=1,cellThickness:m=.5,sectionThickness:v=1,side:g=c._Li,...y},w)=>{(0,u.e)({GridMaterial:f});let b=l.useRef(null);l.useImperativeHandle(w,()=>b.current,[]);let x=new c.JOQ,E=new c.Pa4(0,1,0),M=new c.Pa4(0,0,0);return(0,u.D)(e=>{x.setFromNormalAndCoplanarPoint(E,M).applyMatrix4(b.current.matrixWorld);let t=b.current.material,r=t.uniforms.worldCamProjPosition,n=t.uniforms.worldPlanePosition;x.projectPoint(e.camera.position,r.value),n.value.set(0,0,0).applyMatrix4(b.current.matrixWorld)}),l.createElement("mesh",(0,s.Z)({ref:b,frustumCulled:!1},y),l.createElement("gridMaterial",(0,s.Z)({transparent:!0,"extensions-derivatives":!0,side:g},{cellSize:n,sectionSize:i,cellColor:t,sectionColor:r,cellThickness:m,sectionThickness:v},{fadeDistance:d,fadeStrength:h,fadeFrom:p,infiniteGrid:o,followCamera:a})),l.createElement("planeGeometry",{args:e}))})},19821:function(e,t,r){"use strict";r.d(t,{z:function(){return w}});var n=r(17610),i=r(35758),a=r(7653),o=r(86995),s=Object.defineProperty,l=(e,t,r)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,c=(e,t,r)=>(l(e,"symbol"!=typeof t?t+"":t,r),r);class u{constructor(){c(this,"_listeners")}addEventListener(e,t){void 0===this._listeners&&(this._listeners={});let r=this._listeners;void 0===r[e]&&(r[e]=[]),-1===r[e].indexOf(t)&&r[e].push(t)}hasEventListener(e,t){if(void 0===this._listeners)return!1;let r=this._listeners;return void 0!==r[e]&&-1!==r[e].indexOf(t)}removeEventListener(e,t){if(void 0===this._listeners)return;let r=this._listeners[e];if(void 0!==r){let e=r.indexOf(t);-1!==e&&r.splice(e,1)}}dispatchEvent(e){if(void 0===this._listeners)return;let t=this._listeners[e.type];if(void 0!==t){e.target=this;let r=t.slice(0);for(let t=0,n=r.length;t<n;t++)r[t].call(this,e);e.target=null}}}var d=Object.defineProperty,f=(e,t,r)=>t in e?d(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,h=(e,t,r)=>(f(e,"symbol"!=typeof t?t+"":t,r),r);let p=new o.zHn,m=new o.JOQ,v=Math.cos(Math.PI/180*70),g=(e,t)=>(e%t+t)%t;class y extends u{constructor(e,t){super(),h(this,"object"),h(this,"domElement"),h(this,"enabled",!0),h(this,"target",new o.Pa4),h(this,"minDistance",0),h(this,"maxDistance",1/0),h(this,"minZoom",0),h(this,"maxZoom",1/0),h(this,"minPolarAngle",0),h(this,"maxPolarAngle",Math.PI),h(this,"minAzimuthAngle",-1/0),h(this,"maxAzimuthAngle",1/0),h(this,"enableDamping",!1),h(this,"dampingFactor",.05),h(this,"enableZoom",!0),h(this,"zoomSpeed",1),h(this,"enableRotate",!0),h(this,"rotateSpeed",1),h(this,"enablePan",!0),h(this,"panSpeed",1),h(this,"screenSpacePanning",!0),h(this,"keyPanSpeed",7),h(this,"zoomToCursor",!1),h(this,"autoRotate",!1),h(this,"autoRotateSpeed",2),h(this,"reverseOrbit",!1),h(this,"reverseHorizontalOrbit",!1),h(this,"reverseVerticalOrbit",!1),h(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),h(this,"mouseButtons",{LEFT:o.RsA.ROTATE,MIDDLE:o.RsA.DOLLY,RIGHT:o.RsA.PAN}),h(this,"touches",{ONE:o.QmN.ROTATE,TWO:o.QmN.DOLLY_PAN}),h(this,"target0"),h(this,"position0"),h(this,"zoom0"),h(this,"_domElementKeyEvents",null),h(this,"getPolarAngle"),h(this,"getAzimuthalAngle"),h(this,"setPolarAngle"),h(this,"setAzimuthalAngle"),h(this,"getDistance"),h(this,"getZoomScale"),h(this,"listenToKeyEvents"),h(this,"stopListenToKeyEvents"),h(this,"saveState"),h(this,"reset"),h(this,"update"),h(this,"connect"),h(this,"dispose"),h(this,"dollyIn"),h(this,"dollyOut"),h(this,"getScale"),h(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>u.phi,this.getAzimuthalAngle=()=>u.theta,this.setPolarAngle=e=>{let t=g(e,2*Math.PI),n=u.phi;n<0&&(n+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-n);2*Math.PI-i<i&&(t<n?t+=2*Math.PI:n+=2*Math.PI),d.phi=t-n,r.update()},this.setAzimuthalAngle=e=>{let t=g(e,2*Math.PI),n=u.theta;n<0&&(n+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-n);2*Math.PI-i<i&&(t<n?t+=2*Math.PI:n+=2*Math.PI),d.theta=t-n,r.update()},this.getDistance=()=>r.object.position.distanceTo(r.target),this.listenToKeyEvents=e=>{e.addEventListener("keydown",ee),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ee),this._domElementKeyEvents=null},this.saveState=()=>{r.target0.copy(r.target),r.position0.copy(r.object.position),r.zoom0=r.object.zoom},this.reset=()=>{r.target.copy(r.target0),r.object.position.copy(r.position0),r.object.zoom=r.zoom0,r.object.updateProjectionMatrix(),r.dispatchEvent(n),r.update(),l=s.NONE},this.update=(()=>{let t=new o.Pa4,i=new o.Pa4(0,1,0),a=new o._fP().setFromUnitVectors(e.up,i),h=a.clone().invert(),g=new o.Pa4,w=new o._fP,b=2*Math.PI;return function(){let x=r.object.position;a.setFromUnitVectors(e.up,i),h.copy(a).invert(),t.copy(x).sub(r.target),t.applyQuaternion(a),u.setFromVector3(t),r.autoRotate&&l===s.NONE&&z(2*Math.PI/60/60*r.autoRotateSpeed),r.enableDamping?(u.theta+=d.theta*r.dampingFactor,u.phi+=d.phi*r.dampingFactor):(u.theta+=d.theta,u.phi+=d.phi);let E=r.minAzimuthAngle,M=r.maxAzimuthAngle;isFinite(E)&&isFinite(M)&&(E<-Math.PI?E+=b:E>Math.PI&&(E-=b),M<-Math.PI?M+=b:M>Math.PI&&(M-=b),E<=M?u.theta=Math.max(E,Math.min(M,u.theta)):u.theta=u.theta>(E+M)/2?Math.max(E,u.theta):Math.min(M,u.theta)),u.phi=Math.max(r.minPolarAngle,Math.min(r.maxPolarAngle,u.phi)),u.makeSafe(),!0===r.enableDamping?r.target.addScaledVector(y,r.dampingFactor):r.target.add(y),r.zoomToCursor&&O||r.object.isOrthographicCamera?u.radius=H(u.radius):u.radius=H(u.radius*f),t.setFromSpherical(u),t.applyQuaternion(h),x.copy(r.target).add(t),r.object.matrixAutoUpdate||r.object.updateMatrix(),r.object.lookAt(r.target),!0===r.enableDamping?(d.theta*=1-r.dampingFactor,d.phi*=1-r.dampingFactor,y.multiplyScalar(1-r.dampingFactor)):(d.set(0,0,0),y.set(0,0,0));let _=!1;if(r.zoomToCursor&&O){let n=null;if(r.object instanceof o.cPb&&r.object.isPerspectiveCamera){let e=t.length();n=H(e*f);let i=e-n;r.object.position.addScaledVector(C,i),r.object.updateMatrixWorld()}else if(r.object.isOrthographicCamera){let e=new o.Pa4(T.x,T.y,0);e.unproject(r.object),r.object.zoom=Math.max(r.minZoom,Math.min(r.maxZoom,r.object.zoom/f)),r.object.updateProjectionMatrix(),_=!0;let i=new o.Pa4(T.x,T.y,0);i.unproject(r.object),r.object.position.sub(i).add(e),r.object.updateMatrixWorld(),n=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),r.zoomToCursor=!1;null!==n&&(r.screenSpacePanning?r.target.set(0,0,-1).transformDirection(r.object.matrix).multiplyScalar(n).add(r.object.position):(p.origin.copy(r.object.position),p.direction.set(0,0,-1).transformDirection(r.object.matrix),Math.abs(r.object.up.dot(p.direction))<v?e.lookAt(r.target):(m.setFromNormalAndCoplanarPoint(r.object.up,r.target),p.intersectPlane(m,r.target))))}else r.object instanceof o.iKG&&r.object.isOrthographicCamera&&(_=1!==f)&&(r.object.zoom=Math.max(r.minZoom,Math.min(r.maxZoom,r.object.zoom/f)),r.object.updateProjectionMatrix());return f=1,O=!1,!!(_||g.distanceToSquared(r.object.position)>c||8*(1-w.dot(r.object.quaternion))>c)&&(r.dispatchEvent(n),g.copy(r.object.position),w.copy(r.object.quaternion),_=!1,!0)}})(),this.connect=e=>{r.domElement=e,r.domElement.style.touchAction="none",r.domElement.addEventListener("contextmenu",et),r.domElement.addEventListener("pointerdown",q),r.domElement.addEventListener("pointercancel",Q),r.domElement.addEventListener("wheel",J)},this.dispose=()=>{var e,t,n,i,a,o;r.domElement&&(r.domElement.style.touchAction="auto"),null==(e=r.domElement)||e.removeEventListener("contextmenu",et),null==(t=r.domElement)||t.removeEventListener("pointerdown",q),null==(n=r.domElement)||n.removeEventListener("pointercancel",Q),null==(i=r.domElement)||i.removeEventListener("wheel",J),null==(a=r.domElement)||a.ownerDocument.removeEventListener("pointermove",K),null==(o=r.domElement)||o.ownerDocument.removeEventListener("pointerup",Q),null!==r._domElementKeyEvents&&r._domElementKeyEvents.removeEventListener("keydown",ee)};let r=this,n={type:"change"},i={type:"start"},a={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},l=s.NONE,c=1e-6,u=new o.$V,d=new o.$V,f=1,y=new o.Pa4,w=new o.FM8,b=new o.FM8,x=new o.FM8,E=new o.FM8,M=new o.FM8,_=new o.FM8,S=new o.FM8,P=new o.FM8,A=new o.FM8,C=new o.Pa4,T=new o.FM8,O=!1,U=[],L={};function R(){return Math.pow(.95,r.zoomSpeed)}function z(e){r.reverseOrbit||r.reverseHorizontalOrbit?d.theta+=e:d.theta-=e}function D(e){r.reverseOrbit||r.reverseVerticalOrbit?d.phi+=e:d.phi-=e}let I=(()=>{let e=new o.Pa4;return function(t,r){e.setFromMatrixColumn(r,0),e.multiplyScalar(-t),y.add(e)}})(),k=(()=>{let e=new o.Pa4;return function(t,n){!0===r.screenSpacePanning?e.setFromMatrixColumn(n,1):(e.setFromMatrixColumn(n,0),e.crossVectors(r.object.up,e)),e.multiplyScalar(t),y.add(e)}})(),j=(()=>{let e=new o.Pa4;return function(t,n){let i=r.domElement;if(i&&r.object instanceof o.cPb&&r.object.isPerspectiveCamera){let a=r.object.position;e.copy(a).sub(r.target);let o=e.length();I(2*t*(o*=Math.tan(r.object.fov/2*Math.PI/180))/i.clientHeight,r.object.matrix),k(2*n*o/i.clientHeight,r.object.matrix)}else i&&r.object instanceof o.iKG&&r.object.isOrthographicCamera?(I(t*(r.object.right-r.object.left)/r.object.zoom/i.clientWidth,r.object.matrix),k(n*(r.object.top-r.object.bottom)/r.object.zoom/i.clientHeight,r.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),r.enablePan=!1)}})();function F(e){r.object instanceof o.cPb&&r.object.isPerspectiveCamera||r.object instanceof o.iKG&&r.object.isOrthographicCamera?f=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),r.enableZoom=!1)}function N(e){if(!r.zoomToCursor||!r.domElement)return;O=!0;let t=r.domElement.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top,a=t.width,o=t.height;T.x=n/a*2-1,T.y=-(i/o*2)+1,C.set(T.x,T.y,1).unproject(r.object).sub(r.object.position).normalize()}function H(e){return Math.max(r.minDistance,Math.min(r.maxDistance,e))}function B(e){w.set(e.clientX,e.clientY)}function W(e){E.set(e.clientX,e.clientY)}function G(){if(1==U.length)w.set(U[0].pageX,U[0].pageY);else{let e=.5*(U[0].pageX+U[1].pageX),t=.5*(U[0].pageY+U[1].pageY);w.set(e,t)}}function V(){if(1==U.length)E.set(U[0].pageX,U[0].pageY);else{let e=.5*(U[0].pageX+U[1].pageX),t=.5*(U[0].pageY+U[1].pageY);E.set(e,t)}}function Y(){let e=U[0].pageX-U[1].pageX,t=U[0].pageY-U[1].pageY;S.set(0,Math.sqrt(e*e+t*t))}function Z(e){if(1==U.length)b.set(e.pageX,e.pageY);else{let t=en(e),r=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);b.set(r,n)}x.subVectors(b,w).multiplyScalar(r.rotateSpeed);let t=r.domElement;t&&(z(2*Math.PI*x.x/t.clientHeight),D(2*Math.PI*x.y/t.clientHeight)),w.copy(b)}function $(e){if(1==U.length)M.set(e.pageX,e.pageY);else{let t=en(e),r=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);M.set(r,n)}_.subVectors(M,E).multiplyScalar(r.panSpeed),j(_.x,_.y),E.copy(M)}function X(e){var t;let n=en(e),i=e.pageX-n.x,a=e.pageY-n.y;P.set(0,Math.sqrt(i*i+a*a)),A.set(0,Math.pow(P.y/S.y,r.zoomSpeed)),t=A.y,F(f/t),S.copy(P)}function q(e){var t,n;!1!==r.enabled&&(0===U.length&&(null==(t=r.domElement)||t.ownerDocument.addEventListener("pointermove",K),null==(n=r.domElement)||n.ownerDocument.addEventListener("pointerup",Q)),U.push(e),"touch"===e.pointerType?function(e){switch(er(e),U.length){case 1:switch(r.touches.ONE){case o.QmN.ROTATE:if(!1===r.enableRotate)return;G(),l=s.TOUCH_ROTATE;break;case o.QmN.PAN:if(!1===r.enablePan)return;V(),l=s.TOUCH_PAN;break;default:l=s.NONE}break;case 2:switch(r.touches.TWO){case o.QmN.DOLLY_PAN:if(!1===r.enableZoom&&!1===r.enablePan)return;r.enableZoom&&Y(),r.enablePan&&V(),l=s.TOUCH_DOLLY_PAN;break;case o.QmN.DOLLY_ROTATE:if(!1===r.enableZoom&&!1===r.enableRotate)return;r.enableZoom&&Y(),r.enableRotate&&G(),l=s.TOUCH_DOLLY_ROTATE;break;default:l=s.NONE}break;default:l=s.NONE}l!==s.NONE&&r.dispatchEvent(i)}(e):function(e){let t;switch(e.button){case 0:t=r.mouseButtons.LEFT;break;case 1:t=r.mouseButtons.MIDDLE;break;case 2:t=r.mouseButtons.RIGHT;break;default:t=-1}switch(t){case o.RsA.DOLLY:if(!1===r.enableZoom)return;N(e),S.set(e.clientX,e.clientY),l=s.DOLLY;break;case o.RsA.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===r.enablePan)return;W(e),l=s.PAN}else{if(!1===r.enableRotate)return;B(e),l=s.ROTATE}break;case o.RsA.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===r.enableRotate)return;B(e),l=s.ROTATE}else{if(!1===r.enablePan)return;W(e),l=s.PAN}break;default:l=s.NONE}l!==s.NONE&&r.dispatchEvent(i)}(e))}function K(e){!1!==r.enabled&&("touch"===e.pointerType?function(e){switch(er(e),l){case s.TOUCH_ROTATE:if(!1===r.enableRotate)return;Z(e),r.update();break;case s.TOUCH_PAN:if(!1===r.enablePan)return;$(e),r.update();break;case s.TOUCH_DOLLY_PAN:if(!1===r.enableZoom&&!1===r.enablePan)return;r.enableZoom&&X(e),r.enablePan&&$(e),r.update();break;case s.TOUCH_DOLLY_ROTATE:if(!1===r.enableZoom&&!1===r.enableRotate)return;r.enableZoom&&X(e),r.enableRotate&&Z(e),r.update();break;default:l=s.NONE}}(e):function(e){if(!1!==r.enabled)switch(l){case s.ROTATE:if(!1===r.enableRotate)return;!function(e){b.set(e.clientX,e.clientY),x.subVectors(b,w).multiplyScalar(r.rotateSpeed);let t=r.domElement;t&&(z(2*Math.PI*x.x/t.clientHeight),D(2*Math.PI*x.y/t.clientHeight)),w.copy(b),r.update()}(e);break;case s.DOLLY:var t,n;if(!1===r.enableZoom)return;(P.set(e.clientX,e.clientY),A.subVectors(P,S),A.y>0)?(t=R(),F(f/t)):A.y<0&&(n=R(),F(f*n)),S.copy(P),r.update();break;case s.PAN:if(!1===r.enablePan)return;M.set(e.clientX,e.clientY),_.subVectors(M,E).multiplyScalar(r.panSpeed),j(_.x,_.y),E.copy(M),r.update()}}(e))}function Q(e){var t,n,i;(function(e){delete L[e.pointerId];for(let t=0;t<U.length;t++)if(U[t].pointerId==e.pointerId){U.splice(t,1);return}})(e),0===U.length&&(null==(t=r.domElement)||t.releasePointerCapture(e.pointerId),null==(n=r.domElement)||n.ownerDocument.removeEventListener("pointermove",K),null==(i=r.domElement)||i.ownerDocument.removeEventListener("pointerup",Q)),r.dispatchEvent(a),l=s.NONE}function J(e){if(!1!==r.enabled&&!1!==r.enableZoom&&(l===s.NONE||l===s.ROTATE)){var t,n;e.preventDefault(),r.dispatchEvent(i),(N(e),e.deltaY<0)?(t=R(),F(f*t)):e.deltaY>0&&(n=R(),F(f/n)),r.update(),r.dispatchEvent(a)}}function ee(e){!1!==r.enabled&&!1!==r.enablePan&&function(e){let t=!1;switch(e.code){case r.keys.UP:j(0,r.keyPanSpeed),t=!0;break;case r.keys.BOTTOM:j(0,-r.keyPanSpeed),t=!0;break;case r.keys.LEFT:j(r.keyPanSpeed,0),t=!0;break;case r.keys.RIGHT:j(-r.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),r.update())}(e)}function et(e){!1!==r.enabled&&e.preventDefault()}function er(e){let t=L[e.pointerId];void 0===t&&(t=new o.FM8,L[e.pointerId]=t),t.set(e.pageX,e.pageY)}function en(e){return L[(e.pointerId===U[0].pointerId?U[1]:U[0]).pointerId]}this.dollyIn=(e=R())=>{F(f*e),r.update()},this.dollyOut=(e=R())=>{F(f/e),r.update()},this.getScale=()=>f,this.setScale=e=>{F(e),r.update()},this.getZoomScale=()=>R(),void 0!==t&&this.connect(t),this.update()}}let w=a.forwardRef(({makeDefault:e,camera:t,regress:r,domElement:o,enableDamping:s=!0,keyEvents:l=!1,onChange:c,onStart:u,onEnd:d,...f},h)=>{let p=(0,i.C)(e=>e.invalidate),m=(0,i.C)(e=>e.camera),v=(0,i.C)(e=>e.gl),g=(0,i.C)(e=>e.events),w=(0,i.C)(e=>e.setEvents),b=(0,i.C)(e=>e.set),x=(0,i.C)(e=>e.get),E=(0,i.C)(e=>e.performance),M=t||m,_=o||g.connected||v.domElement,S=a.useMemo(()=>new y(M),[M]);return(0,i.D)(()=>{S.enabled&&S.update()},-1),a.useEffect(()=>(l&&S.connect(!0===l?_:l),S.connect(_),()=>void S.dispose()),[l,_,r,S,p]),a.useEffect(()=>{let e=e=>{p(),r&&E.regress(),c&&c(e)},t=e=>{u&&u(e)},n=e=>{d&&d(e)};return S.addEventListener("change",e),S.addEventListener("start",t),S.addEventListener("end",n),()=>{S.removeEventListener("start",t),S.removeEventListener("end",n),S.removeEventListener("change",e)}},[c,u,d,S,p,w]),a.useEffect(()=>{if(e){let e=x().controls;return b({controls:S}),()=>b({controls:e})}},[e,S]),a.createElement("primitive",(0,n.Z)({ref:h,object:S,enableDamping:s},f))})},51914:function(e,t,r){"use strict";let n,i;r.d(t,{V:function(){return w}});var a=r(17610),o=r(7653),s=r(42291),l=r(86995),c=r(35758);let u=new l.Pa4,d=new l.Pa4,f=new l.Pa4,h=new l.FM8;function p(e,t,r){let n=u.setFromMatrixPosition(e.matrixWorld);n.project(t);let i=r.width/2,a=r.height/2;return[n.x*i+i,-(n.y*a)+a]}let m=e=>1e-10>Math.abs(e)?0:e;function v(e,t,r=""){let n="matrix3d(";for(let r=0;16!==r;r++)n+=m(t[r]*e.elements[r])+(15!==r?",":")");return r+n}let g=(n=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>v(e,n)),y=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>v(e,i(t),"translate(-50%,-50%)")),w=o.forwardRef(({children:e,eps:t=.001,style:r,className:n,prepend:i,center:v,fullscreen:w,portal:b,distanceFactor:x,sprite:E=!1,transform:M=!1,occlude:_,onOcclude:S,castShadow:P,receiveShadow:A,material:C,geometry:T,zIndexRange:O=[16777271,0],calculatePosition:U=p,as:L="div",wrapperClass:R,pointerEvents:z="auto",...D},I)=>{let{gl:k,camera:j,scene:F,size:N,raycaster:H,events:B,viewport:W}=(0,c.C)(),[G]=o.useState(()=>document.createElement(L)),V=o.useRef(null),Y=o.useRef(null),Z=o.useRef(0),$=o.useRef([0,0]),X=o.useRef(null),q=o.useRef(null),K=(null==b?void 0:b.current)||B.connected||k.domElement.parentNode,Q=o.useRef(null),J=o.useRef(!1),ee=o.useMemo(()=>{var e;return _&&"blending"!==_||Array.isArray(_)&&_.length&&(e=_[0])&&"object"==typeof e&&"current"in e},[_]);o.useLayoutEffect(()=>{let e=k.domElement;_&&"blending"===_?(e.style.zIndex=`${Math.floor(O[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[_]),o.useLayoutEffect(()=>{if(Y.current){let e=V.current=s.createRoot(G);if(F.updateMatrixWorld(),M)G.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=U(Y.current,j,N);G.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return K&&(i?K.prepend(G):K.appendChild(G)),()=>{K&&K.removeChild(G),e.unmount()}}},[K,M]),o.useLayoutEffect(()=>{R&&(G.className=R)},[R]);let et=o.useMemo(()=>M?{position:"absolute",top:0,left:0,width:N.width,height:N.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...w&&{top:-N.height/2,left:-N.width/2,width:N.width,height:N.height},...r},[r,v,w,N,M]),er=o.useMemo(()=>({position:"absolute",pointerEvents:z}),[z]);o.useLayoutEffect(()=>{var t,i;J.current=!1,M?null==(t=V.current)||t.render(o.createElement("div",{ref:X,style:et},o.createElement("div",{ref:q,style:er},o.createElement("div",{ref:I,className:n,style:r,children:e})))):null==(i=V.current)||i.render(o.createElement("div",{ref:I,style:et,className:n,children:e}))});let en=o.useRef(!0);(0,c.D)(e=>{if(Y.current){j.updateMatrixWorld(),Y.current.updateWorldMatrix(!0,!1);let e=M?$.current:U(Y.current,j,N);if(M||Math.abs(Z.current-j.zoom)>t||Math.abs($.current[0]-e[0])>t||Math.abs($.current[1]-e[1])>t){let t=function(e,t){let r=u.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld),i=r.sub(n),a=t.getWorldDirection(f);return i.angleTo(a)>Math.PI/2}(Y.current,j),r=!1;ee&&(Array.isArray(_)?r=_.map(e=>e.current):"blending"!==_&&(r=[F]));let n=en.current;if(r){let e=function(e,t,r,n){let i=u.setFromMatrixPosition(e.matrixWorld),a=i.clone();a.project(t),h.set(a.x,a.y),r.setFromCamera(h,t);let o=r.intersectObjects(n,!0);if(o.length){let e=o[0].distance;return i.distanceTo(r.ray.origin)<e}return!0}(Y.current,j,H,r);en.current=e&&!t}else en.current=!t;n!==en.current&&(S?S(!en.current):G.style.display=en.current?"block":"none");let i=Math.floor(O[0]/2),a=_?ee?[O[0],i]:[i-1,0]:O;if(G.style.zIndex=`${function(e,t,r){if(t instanceof l.cPb||t instanceof l.iKG){let n=u.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld),a=n.distanceTo(i),o=(r[1]-r[0])/(t.far-t.near),s=r[1]-o*t.far;return Math.round(o*a+s)}}(Y.current,j,a)}`,M){let[e,t]=[N.width/2,N.height/2],r=j.projectionMatrix.elements[5]*t,{isOrthographicCamera:n,top:i,left:a,bottom:o,right:s}=j,l=g(j.matrixWorldInverse),c=n?`scale(${r})translate(${m(-(s+a)/2)}px,${m((i+o)/2)}px)`:`translateZ(${r}px)`,u=Y.current.matrixWorld;E&&((u=j.matrixWorldInverse.clone().transpose().copyPosition(u).scale(Y.current.scale)).elements[3]=u.elements[7]=u.elements[11]=0,u.elements[15]=1),G.style.width=N.width+"px",G.style.height=N.height+"px",G.style.perspective=n?"":`${r}px`,X.current&&q.current&&(X.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,q.current.style.transform=y(u,1/((x||10)/400)))}else{let t=void 0===x?1:function(e,t){if(t instanceof l.iKG)return t.zoom;if(!(t instanceof l.cPb))return 1;{let r=u.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(n))}}(Y.current,j)*x;G.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}$.current=e,Z.current=j.zoom}}if(!ee&&Q.current&&!J.current){if(M){if(X.current){let e=X.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=j;if(t||T)D.scale&&(Array.isArray(D.scale)?D.scale instanceof l.Pa4?Q.current.scale.copy(D.scale.clone().divideScalar(1)):Q.current.scale.set(1/D.scale[0],1/D.scale[1],1/D.scale[2]):Q.current.scale.setScalar(1/D.scale));else{let t=(x||10)/400,r=e.clientWidth*t,n=e.clientHeight*t;Q.current.scale.set(r,n,1)}J.current=!0}}}else{let t=G.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/W.factor,r=t.clientWidth*e,n=t.clientHeight*e;Q.current.scale.set(r,n,1),J.current=!0}Q.current.lookAt(e.camera.position)}}});let ei=o.useMemo(()=>({vertexShader:M?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[M]);return o.createElement("group",(0,a.Z)({},D,{ref:Y}),_&&!ee&&o.createElement("mesh",{castShadow:P,receiveShadow:A,ref:Q},T||o.createElement("planeGeometry",null),C||o.createElement("shaderMaterial",{side:l.ehD,vertexShader:ei.vertexShader,fragmentShader:ei.fragmentShader})))})},89323:function(e,t,r){"use strict";r.d(t,{Xz:function(){return f}});var n=r(35758),i=r(7653),a=r(78813);function o(e,t){let r;return(...n)=>{window.clearTimeout(r),r=window.setTimeout(()=>e(...n),t)}}let s=["x","y","top","bottom","left","right","width","height"],l=(e,t)=>s.every(r=>e[r]===t[r]);var c=r(23832),u=r(27573);function d({ref:e,children:t,fallback:r,resize:s,style:c,gl:d,events:f=n.f,eventSource:h,eventPrefix:p,shadows:m,linear:v,flat:g,legacy:y,orthographic:w,frameloop:b,dpr:x,performance:E,raycaster:M,camera:_,scene:S,onPointerMissed:P,onCreated:A,...C}){i.useMemo(()=>(0,n.e)(a),[]);let T=(0,n.u)(),[O,U]=function({debounce:e,scroll:t,polyfill:r,offsetSize:n}={debounce:0,scroll:!1,offsetSize:!1}){var a;let s=r||("undefined"==typeof window?class{}:window.ResizeObserver);if(!s)throw Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");let[c,u]=(0,i.useState)({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),d=(0,i.useRef)({element:null,scrollContainers:null,resizeObserver:null,lastBounds:c,orientationHandler:null}),f=e?"number"==typeof e?e:e.scroll:null,h=e?"number"==typeof e?e:e.resize:null,p=(0,i.useRef)(!1);(0,i.useEffect)(()=>(p.current=!0,()=>void(p.current=!1)));let[m,v,g]=(0,i.useMemo)(()=>{let e=()=>{if(!d.current.element)return;let{left:e,top:t,width:r,height:i,bottom:a,right:o,x:s,y:c}=d.current.element.getBoundingClientRect(),f={left:e,top:t,width:r,height:i,bottom:a,right:o,x:s,y:c};d.current.element instanceof HTMLElement&&n&&(f.height=d.current.element.offsetHeight,f.width=d.current.element.offsetWidth),Object.freeze(f),p.current&&!l(d.current.lastBounds,f)&&u(d.current.lastBounds=f)};return[e,h?o(e,h):e,f?o(e,f):e]},[u,n,f,h]);function y(){d.current.scrollContainers&&(d.current.scrollContainers.forEach(e=>e.removeEventListener("scroll",g,!0)),d.current.scrollContainers=null),d.current.resizeObserver&&(d.current.resizeObserver.disconnect(),d.current.resizeObserver=null),d.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",d.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",d.current.orientationHandler))}function w(){d.current.element&&(d.current.resizeObserver=new s(g),d.current.resizeObserver.observe(d.current.element),t&&d.current.scrollContainers&&d.current.scrollContainers.forEach(e=>e.addEventListener("scroll",g,{capture:!0,passive:!0})),d.current.orientationHandler=()=>{g()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",d.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",d.current.orientationHandler))}return a=!!t,(0,i.useEffect)(()=>{if(a)return window.addEventListener("scroll",g,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",g,!0)},[g,a]),(0,i.useEffect)(()=>(window.addEventListener("resize",v),()=>void window.removeEventListener("resize",v)),[v]),(0,i.useEffect)(()=>{y(),w()},[t,g,v]),(0,i.useEffect)(()=>y,[]),[e=>{e&&e!==d.current.element&&(y(),d.current.element=e,d.current.scrollContainers=function e(t){let r=[];if(!t||t===document.body)return r;let{overflow:n,overflowX:i,overflowY:a}=window.getComputedStyle(t);return[n,i,a].some(e=>"auto"===e||"scroll"===e)&&r.push(t),[...r,...e(t.parentElement)]}(e),w())},c,m]}({scroll:!0,debounce:{scroll:50,resize:0},...s}),L=i.useRef(null),R=i.useRef(null);i.useImperativeHandle(e,()=>L.current);let z=(0,n.a)(P),[D,I]=i.useState(!1),[k,j]=i.useState(!1);if(D)throw D;if(k)throw k;let F=i.useRef(null);(0,n.b)(()=>{let e=L.current;U.width>0&&U.height>0&&e&&(F.current||(F.current=(0,n.c)(e)),async function(){await F.current.configure({gl:d,scene:S,events:f,shadows:m,linear:v,flat:g,legacy:y,orthographic:w,frameloop:b,dpr:x,performance:E,raycaster:M,camera:_,size:U,onPointerMissed:(...e)=>null==z.current?void 0:z.current(...e),onCreated:e=>{null==e.events.connect||e.events.connect(h?(0,n.i)(h)?h.current:h:R.current),p&&e.setEvents({compute:(e,t)=>{let r=e[p+"X"],n=e[p+"Y"];t.pointer.set(r/t.size.width*2-1,-(n/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),null==A||A(e)}}),F.current.render((0,u.jsx)(T,{children:(0,u.jsx)(n.E,{set:j,children:(0,u.jsx)(i.Suspense,{fallback:(0,u.jsx)(n.B,{set:I}),children:null!=t?t:null})})}))}())}),i.useEffect(()=>{let e=L.current;if(e)return()=>(0,n.d)(e)},[]);let N=h?"none":"auto";return(0,u.jsx)("div",{ref:R,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:N,...c},...C,children:(0,u.jsx)("div",{ref:O,style:{width:"100%",height:"100%"},children:(0,u.jsx)("canvas",{ref:L,style:{display:"block"},children:r})})})}function f(e){return(0,u.jsx)(c.Hn,{children:(0,u.jsx)(d,{...e})})}r(19714)},23567:function(e,t){"use strict";function r(e,t){var r=e.length;for(e.push(t);0<r;){var n=r-1>>>1,i=e[n];if(0<a(i,t))e[n]=t,e[r]=i,r=n;else break}}function n(e){return 0===e.length?null:e[0]}function i(e){if(0===e.length)return null;var t=e[0],r=e.pop();if(r!==t){e[0]=r;for(var n=0,i=e.length,o=i>>>1;n<o;){var s=2*(n+1)-1,l=e[s],c=s+1,u=e[c];if(0>a(l,r))c<i&&0>a(u,l)?(e[n]=u,e[c]=r,n=c):(e[n]=l,e[s]=r,n=s);else if(c<i&&0>a(u,r))e[n]=u,e[c]=r,n=c;else break}}return t}function a(e,t){var r=e.sortIndex-t.sortIndex;return 0!==r?r:e.id-t.id}if(t.unstable_now=void 0,"object"==typeof performance&&"function"==typeof performance.now){var o,s=performance;t.unstable_now=function(){return s.now()}}else{var l=Date,c=l.now();t.unstable_now=function(){return l.now()-c}}var u=[],d=[],f=1,h=null,p=3,m=!1,v=!1,g=!1,y=!1,w="function"==typeof setTimeout?setTimeout:null,b="function"==typeof clearTimeout?clearTimeout:null,x="undefined"!=typeof setImmediate?setImmediate:null;function E(e){for(var t=n(d);null!==t;){if(null===t.callback)i(d);else if(t.startTime<=e)i(d),t.sortIndex=t.expirationTime,r(u,t);else break;t=n(d)}}function M(e){if(g=!1,E(e),!v){if(null!==n(u))v=!0,_||(_=!0,o());else{var t=n(d);null!==t&&L(M,t.startTime-e)}}}var _=!1,S=-1,P=5,A=-1;function C(){return!!y||!(t.unstable_now()-A<P)}function T(){if(y=!1,_){var e=t.unstable_now();A=e;var r=!0;try{e:{v=!1,g&&(g=!1,b(S),S=-1),m=!0;var a=p;try{t:{for(E(e),h=n(u);null!==h&&!(h.expirationTime>e&&C());){var s=h.callback;if("function"==typeof s){h.callback=null,p=h.priorityLevel;var l=s(h.expirationTime<=e);if(e=t.unstable_now(),"function"==typeof l){h.callback=l,E(e),r=!0;break t}h===n(u)&&i(u),E(e)}else i(u);h=n(u)}if(null!==h)r=!0;else{var c=n(d);null!==c&&L(M,c.startTime-e),r=!1}}break e}finally{h=null,p=a,m=!1}r=void 0}}finally{r?o():_=!1}}}if("function"==typeof x)o=function(){x(T)};else if("undefined"!=typeof MessageChannel){var O=new MessageChannel,U=O.port2;O.port1.onmessage=T,o=function(){U.postMessage(null)}}else o=function(){w(T,0)};function L(e,r){S=w(function(){e(t.unstable_now())},r)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<e?Math.floor(1e3/e):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_next=function(e){switch(p){case 1:case 2:case 3:var t=3;break;default:t=p}var r=p;p=t;try{return e()}finally{p=r}},t.unstable_requestPaint=function(){y=!0},t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var r=p;p=e;try{return t()}finally{p=r}},t.unstable_scheduleCallback=function(e,i,a){var s=t.unstable_now();switch(a="object"==typeof a&&null!==a&&"number"==typeof(a=a.delay)&&0<a?s+a:s,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return l=a+l,e={id:f++,callback:i,priorityLevel:e,startTime:a,expirationTime:l,sortIndex:-1},a>s?(e.sortIndex=a,r(d,e),null===n(u)&&e===n(d)&&(g?(b(S),S=-1):g=!0,L(M,a-s))):(e.sortIndex=l,r(u,e),v||m||(v=!0,_||(_=!0,o()))),e},t.unstable_shouldYield=C,t.unstable_wrapCallback=function(e){var t=p;return function(){var r=p;p=t;try{return e.apply(this,arguments)}finally{p=r}}}},19714:function(e,t,r){"use strict";e.exports=r(23567)},39449:function(e,t,r){"use strict";r.d(t,{MA:function(){return l},Rq:function(){return s},ZH:function(){return c}});let n=e=>"object"==typeof e&&"function"==typeof e.then,i=[];function a(e,t,r=(e,t)=>e===t){if(e===t)return!0;if(!e||!t)return!1;let n=e.length;if(t.length!==n)return!1;for(let i=0;i<n;i++)if(!r(e[i],t[i]))return!1;return!0}function o(e,t=null,r=!1,o={}){for(let n of(null===t&&(t=[e]),i))if(a(t,n.keys,n.equal)){if(r)return;if(Object.prototype.hasOwnProperty.call(n,"error"))throw n.error;if(Object.prototype.hasOwnProperty.call(n,"response"))return o.lifespan&&o.lifespan>0&&(n.timeout&&clearTimeout(n.timeout),n.timeout=setTimeout(n.remove,o.lifespan)),n.response;if(!r)throw n.promise}let s={keys:t,equal:o.equal,remove:()=>{let e=i.indexOf(s);-1!==e&&i.splice(e,1)},promise:(n(e)?e:e(...t)).then(e=>{s.response=e,o.lifespan&&o.lifespan>0&&(s.timeout=setTimeout(s.remove,o.lifespan))}).catch(e=>s.error=e)};if(i.push(s),!r)throw s.promise}let s=(e,t,r)=>o(e,t,!1,r),l=(e,t,r)=>void o(e,t,!0,r),c=e=>{if(void 0===e||0===e.length)i.splice(0,i.length);else{let t=i.find(t=>a(e,t.keys,t.equal));t&&t.remove()}}},68571:function(e){var t,r,n,i=e.exports={};function a(){throw Error("setTimeout has not been defined")}function o(){throw Error("clearTimeout has not been defined")}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===a||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:a}catch(e){t=a}try{r="function"==typeof clearTimeout?clearTimeout:o}catch(e){r=o}}();var l=[],c=!1,u=-1;function d(){c&&n&&(c=!1,n.length?l=n.concat(l):u=-1,l.length&&f())}function f(){if(!c){var e=s(d);c=!0;for(var t=l.length;t;){for(n=l,l=[];++u<t;)n&&n[u].run();u=-1,t=l.length}n=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===o||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function p(){}i.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];l.push(new h(e,t)),1!==l.length||c||s(f)},h.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=p,i.addListener=p,i.once=p,i.off=p,i.removeListener=p,i.removeAllListeners=p,i.emit=p,i.prependListener=p,i.prependOnceListener=p,i.listeners=function(e){return[]},i.binding=function(e){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw Error("process.chdir is not supported")},i.umask=function(){return 0}},17610:function(e,t,r){"use strict";function n(){return(n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(null,arguments)}r.d(t,{Z:function(){return n}})},50408:function(e,t,r){"use strict";r.d(t,{F:function(){return u}});var n=r(7653),i=r(18678);let a=e=>{let t;let r=new Set,n=(e,n)=>{let i="function"==typeof e?e(t):e;if(!Object.is(i,t)){let e=t;t=(null!=n?n:"object"!=typeof i||null===i)?i:Object.assign({},t,i),r.forEach(r=>r(t,e))}},i=()=>t,a={setState:n,getState:i,getInitialState:()=>o,subscribe:e=>(r.add(e),()=>r.delete(e))},o=t=e(n,i,a);return a},o=e=>e?a(e):a,{useSyncExternalStoreWithSelector:s}=i,l=e=>e,c=(e,t)=>{let r=o(e),i=(e,i=t)=>(function(e,t=l,r){let i=s(e.subscribe,e.getState,e.getInitialState,t,r);return n.useDebugValue(i),i})(r,e,i);return Object.assign(i,r),i},u=(e,t)=>e?c(e,t):c},23832:function(e,t,r){"use strict";r.d(t,{Hn:function(){return c},NN:function(){return u},jn:function(){return h},pc:function(){return o}});var n,i,a=r(7653);function o(e,t,r){if(!e)return;if(!0===r(e))return e;let n=t?e.return:e.child;for(;n;){let e=o(n,t,r);if(e)return e;n=t?null:n.sibling}}function s(e){try{return Object.defineProperties(e,{_currentRenderer:{get:()=>null,set(){}},_currentRenderer2:{get:()=>null,set(){}}})}catch(t){return e}}"undefined"!=typeof window&&((null==(n=window.document)?void 0:n.createElement)||(null==(i=window.navigator)?void 0:i.product)==="ReactNative")?a.useLayoutEffect:a.useEffect;let l=s(a.createContext(null));class c extends a.Component{render(){return a.createElement(l.Provider,{value:this._reactInternals},this.props.children)}}function u(){let e=a.useContext(l);if(null===e)throw Error("its-fine: useFiber must be called within a <FiberProvider />!");let t=a.useId();return a.useMemo(()=>{for(let r of[e,null==e?void 0:e.alternate]){if(!r)continue;let e=o(r,!1,e=>{let r=e.memoizedState;for(;r;){if(r.memoizedState===t)return!0;r=r.next}});if(e)return e}},[e,t])}let d=Symbol.for("react.context"),f=e=>null!==e&&"object"==typeof e&&"$$typeof"in e&&e.$$typeof===d;function h(){let e=function(){let e=u(),[t]=a.useState(()=>new Map);t.clear();let r=e;for(;r;){let e=r.type;f(e)&&e!==l&&!t.has(e)&&t.set(e,a.use(s(e))),r=r.return}return t}();return a.useMemo(()=>Array.from(e.keys()).reduce((t,r)=>n=>a.createElement(t,null,a.createElement(r.Provider,{...n,value:e.get(r)})),e=>a.createElement(c,{...e})),[e])}},55379:function(e,t,r){"use strict";r.d(t,{i:function(){return n}});let n=parseInt(r(86995).UZH.replace(/\D+/g,""))}}]);