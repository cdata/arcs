(() => {
  const AFRAME = window.AFRAME;
  const THREE = window.THREE;

  const surfaceMarkers = [];

  const $dolly = Symbol('object3D');
  const $root = Symbol('root');
  const $surfaces = Symbol('surfaces');
  const $rootEl = Symbol('rootEl');
  const $dollyEl = Symbol('dollyEl');

  const radToDeg = (() => {
    const scale = 180 / Math.PI;
    return rad => rad * scale;
  })();

  class Marker {
    get dollyEl() {
      return this[$dollyEl];
    }

    get rootEl() {
      return this[$rootEl];
    }

    get root() {
      return this[$root];
    }

    get dolly() {
      return this[$dolly];
    }

    constructor(config = { debug: false }) {
      const rootElement = document.createElement('a-entity');
      const root = rootElement.object3D;
      const dollyElement = document.createElement('a-entity');
      const dolly = dollyElement.object3D;

      this[$rootEl] = rootElement;
      this[$dollyEl] = dollyElement;

      rootElement.appendChild(dollyElement);

      if (config.debug) {
        const axis = new THREE.AxisHelper(10);
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(5, 5, 5),
            new THREE.MeshBasicMaterial({
              color: 0xff99ff,
              transparent: true,
              opacity: 1.0
            }));
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(32, 32),
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.33,
              side: THREE.DoubleSide
            }));
          axis.add(box);
          axis.add(plane);
          dolly.add(axis);

        axis.scale.multiplyScalar(5);
        axis.material.linewidth = 5;
      }

      //dollyElement.setAttribute('position', `0 0 256`);

      this[$root] = root;
      this[$dolly] = dolly;
      this[$surfaces] = [];
    }

    assignSurface(surface) {
      const { rootEl, dollyEl } = this;
      const dollyPosition = surface.position.clone();
      const dollyRotation = new THREE.Euler();
      const aspect = surface.viewport.width / surface.viewport.height;
      const cameraRotation = rootEl.sceneEl.camera.el.getAttribute('rotation');

      dollyPosition.x *= -3 * aspect;
      dollyPosition.y *= -3;
      dollyPosition.z /= 100;

      dollyRotation.setFromRotationMatrix(surface.orientation);
      dollyRotation.y = dollyRotation.x = 0;
      dollyRotation.z *= -1;

      dollyEl.setAttribute('position',
          `${dollyPosition.x} ${dollyPosition.y} ${dollyPosition.z}`);

      dollyEl.setAttribute('rotation',
          `${radToDeg(dollyRotation.x)} ${radToDeg(dollyRotation.y)} ${radToDeg(dollyRotation.z)}`);

      rootEl.setAttribute('rotation',
          `${-1 * cameraRotation.x} ${cameraRotation.y} ${-1 * cameraRotation.z}`);

      rootEl.id = `${surface.id}Root`;
      dollyEl.id = `${surface.id}Slot`;
    }
  }

  AFRAME.registerSystem('surface', {
    init() {
      this.markers = {};
      this.sceneEl.addEventListener('renderstart', event => {
        const camera = this.sceneEl.camera;
        const cameraEl = camera.el;
        const cameraPosition = cameraEl.getAttribute('position');

        camera.fov = 66;
        camera.far = 10000;
        camera.updateProjectionMatrix();

        this.surfaceContainer = document.createElement('a-entity');
        this.surfaceContainer.setAttribute('rotation', '0 180 0');
        this.surfaceContainer.setAttribute('position', `${cameraPosition.x} ${cameraPosition.y} ${cameraPosition.z}`);
        this.sceneEl.appendChild(this.surfaceContainer);
      });
      console.log('Surface system is go!');
    },

    setSurfaces(surfaces) {
      surfaces.forEach(surface => {
        if (this.markers[surface.id] == null) {
          this.markers[surface.id] = new Marker({ debug: true });
          this.surfaceContainer.appendChild(this.markers[surface.id].rootEl);

          // fire an event each time a surface is added.
          this.sceneEl.dispatchEvent(new CustomEvent('anchor-added', {
            detail: {
              slotContext: this.markers[surface.id].dollyEl,
              anchor: surface
            },
            bubbles: true,
            composed: true
          }));

          console.log(`Created marker for surface "${surface.id}".`);

          const marker = this.markers[surface.id];
          marker.assignSurface(surface);
        }
      });
    }
  });
})();
