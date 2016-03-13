let glslify = require('glslify');

class Form extends THREE.Object3D {

	constructor ( opt ) {

		super();

		// params
		this.opt = opt;
		this.frame = 0;
		this.radius = opt.radius || 100;
		this.formColor = '#ff5555';
		this.form = 'Sphere';
		this.noiseSpeed = 2;

		// material
		this.material = new THREE.ShaderMaterial( {
			 uniforms: { 
			 	color: { type: 'c', value: new THREE.Color(this.formColor) },
				time: { type: 'f', value: 0.0 },
				amplitude: { type: 'f', value: 1.0 },
				speed: { type: 'i', value: 0 },
			},
			vertexShader: glslify('../../shaders/fx.vert'),
			fragmentShader: glslify('../../shaders/fx.frag'),
			shading: THREE.SmoothShading
		} );

		// geometry
		this.geometry = new THREE.PlaneGeometry( 300, 200, 300, 200 );

		// mesh
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.mesh.rotation.x = - Math.PI / 2;
		this.mesh.position.z = -50;

		this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 300, 200, 1, 1 ), new THREE.MeshBasicMaterial({ color:0xffffff }) );
		this.plane.rotation.x = - Math.PI / 2;
		this.plane.position.y = -12;
		this.plane.position.z = -50;

		// gui
		// this.initGui();

		this.add( this.mesh );
		this.add( this.plane );

	}

	initGui () {

		let geometry = window.gui.add(this, 'form', [ 'Sphere','Cube','Icosahedron' ] );
		geometry.onChange((geometry) => {
			this.remove(this.mesh);
			switch ( geometry ) {
				case 'Sphere':
					this.geometry = new THREE.SphereGeometry( 150, 32, 32 );
					break;
				case 'Cube':
					this.geometry = new THREE.BoxGeometry( 220, 220, 220 );
					break;
				case 'Icosahedron':
					this.geometry = new THREE.IcosahedronGeometry( 150, 0 );
					break;
			}
			this.mesh = new THREE.Mesh( this.geometry, this.material );
			this.add( this.mesh );
		});

		let color = window.gui.addColor(this, 'formColor');
		color.onChange(() => {
			this.material.uniforms.color.value = new THREE.Color(this.formColor);
		});

		window.gui.add(this, 'noiseSpeed', 1.0, 10.0 );
		window.gui.add(this, 'noiseSize', 0.0, 1.0 );

	}

	slowmo () {

		this.material.uniforms.speed.value = 1;
		window.app.soundManager.player.playbackRate = .5;
		this.noiseSpeed = 0.4;

	}

	normal () {

		this.material.uniforms.speed.value = 0;
		window.app.soundManager.player.playbackRate = 1.0;
		this.noiseSpeed = 2;

	}

	update() {

		this.material.uniforms[ 'time' ].value = this.frame * 0.002;

		this.frame += this.noiseSpeed;

	}
	
}

export default Form;