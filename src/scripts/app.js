import SoundManager from './managers/soundManager';
import Plane from './modules/plane';

WAGNER.vertexShadersPath = '/Wagner/vertex-shaders';
WAGNER.fragmentShadersPath = '/Wagner/fragment-shaders';

class App {
	
	constructor() {

		// binded
		this.resize = this.resize.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
		this.onKeyup = this.onKeyup.bind(this);
		this.animate = this.animate.bind(this);

		// params
		this.backgroundColor = 0x1a1a1a;
		this.wWidth = window.innerWidth;
		this.wHeight = window.innerHeight;
		this.useNoise = true;
		this.useVignette = true;
		this.useBloom = false;
		this.autoRotate = false;
		this.cameraTarget = new THREE.Vector3(0,0,0);
		this.gui = window.gui = new dat.GUI();

		// wagner passes
		this.noisePass = new WAGNER.NoisePass();
		this.bloomPass = new WAGNER.MultiPassBloomPass();
		this.vignettePass = new WAGNER.VignettePass();

		// noise pass
		this.noisePass.params.amount = 0.05;
		this.noisePass.params.speed = 0.05;

		// vignette pass
		this.vignettePass.params.amount = 1;

		// bloom pass
		this.bloomPass.params.strength = .5;
        this.bloomPass.params.blurAmount = .1;
        this.bloomPass.params.applyZoomBlur = !0;
        this.bloomPass.params.zoomBlurStrength = .3;
		
		// init gui
		this.wagnerGui = this.gui.addFolder('Wagner');
		this.wagnerGui.add(this, 'useNoise');
		this.wagnerGui.add(this, 'useVignette');
		this.wagnerGui.add(this, 'useBloom');

		this.init();
		
		window.addEventListener('resize', this.resize, true);
		document.addEventListener('keydown', this.onKeydown.bind(this));
        document.addEventListener('keyup', this.onKeyup.bind(this));

	}

	init() {

		this.scene = new THREE.Scene();
		// this.scene.fog = new THREE.Fog( this.backgroundColor, 0.1, 1000 );

		this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
		this.renderer.setClearColor(this.backgroundColor, 1);
		this.renderer.autoClearColor = true;
		
		this.camera = new THREE.PerspectiveCamera(45, this.wWidth/this.wHeight, 1, 2000);
		this.camera.position.y = 45;
		this.camera.position.z = 50;

		this.renderer.setSize(this.wWidth, this.wHeight);

		this.container = document.getElementById('container');

		this.canvas = this.renderer.domElement;

		this.container.appendChild( this.canvas );

		this.composer = new WAGNER.Composer( this.renderer );
		this.composer.setSize( this.wWidth, this.wHeight );

		this.addLights();

		// this.addControls();
		
		this.plane = new Plane({ radius:150 });

		this.scene.add( this.plane );

		this.soundManager = new SoundManager();

		this.update();
		
	}

	addLights() {

		let light = new THREE.DirectionalLight(0xffffff, 0.5);
		light.position.set(300,300,300);
		this.scene.add(light);
		
		let pointlight = new THREE.PointLight(0xffffff, 2, 2000);
		this.scene.add(pointlight);

    }

	addControls() {

		this.controls = new THREE.TrackballControls( this.camera );
		this.controls.noZoom = false;
		this.controls.noPan = true;
		this.controls.noRoll = true;
		this.controls.noRotate = false;
		this.controls.dynamicDampingFactor = .15;
		this.controls.minDistance = 0;
		this.controls.maxDistance = 1500;

	}

	update() {

		// this.controls.update();
		
		this.animate()

		requestAnimationFrame(this.update.bind(this))
		
	}

	animate() {

		this.camera.lookAt(this.cameraTarget);

		this.composer.reset();
		this.composer.render( this.scene, this.camera );
		if (this.useNoise) this.composer.pass( this.noisePass );
		if (this.useVignette) this.composer.pass( this.vignettePass );
		if (this.useBloom) this.composer.pass( this.bloomPass );
		
		this.composer.toScreen();

		if (this.soundManager.pause) {
			this.bloomPass.params.zoomBlurStrength = .3;
		} else {
			this.bloomPass.params.zoomBlurStrength = .2 + this.soundManager.drum * 0.6;
		}

		if (this.autoRotate) {
			this.scene.rotation.x += 0.002;
			this.scene.rotation.y += 0.002;
			this.scene.rotation.z += 0.002;
		}

		this.plane.update();
		this.soundManager.update();

	}

	onKeydown ( e ) {

        if (e.keyCode === 32) this.plane.slowmo();

    }

    onKeyup ( e ) {

        if (e.keyCode === 32) this.plane.normal();
        
    }

	resize () {

		this.wWidth = window.innerWidth;
		this.wHeight = window.innerHeight;

		this.camera.aspect = this.wWidth / this.wHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( this.wWidth, this.wHeight );

	}

}

window.app = new App();