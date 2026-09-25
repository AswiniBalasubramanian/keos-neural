// Procedural hand-drawn-style characters (player, mother, NPCs) and the
// third-person CharacterController with collision and orbit camera.
import * as THREE from 'three';
import { toon, glowMat } from '../world/kit.js';
import { resolveCollisions } from './physics.js';
import { clamp } from '../core/noise.js';

const capsule = (r, len, color) => {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 12), toon(color));
  m.castShadow = true;
  return m;
};

export function buildCharacter(opts = {}) {
  const {
    gender = 'female', top = '#5d93c9', bottom = gender === 'female' ? '#f4efe4' : '#3d4358',
    skin = '#f3cfae', hair = '#2a1b17', shoes = '#5b4331', hat = false, beard = false, apron = null,
    backpack = false, child = false, elder = false, scarf = null, robe = null, eyesClosed = false,
  } = opts;
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const P = {};
  const skinMat = toon(skin);

  const hipY = 0.86;
  // legs
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.1, hipY, 0);
    const leg = capsule(0.075, 0.6, gender === 'female' && !robe ? skin : bottom);
    leg.position.y = -0.38;
    pivot.add(leg);
    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), toon(shoes));
    shoe.scale.set(1, 0.65, 1.5);
    shoe.position.set(0, -0.8, 0.04);
    shoe.castShadow = true;
    pivot.add(shoe);
    body.add(pivot);
    P[side < 0 ? 'legL' : 'legR'] = pivot;
  }

  const torsoG = new THREE.Group();
  torsoG.position.y = hipY;
  body.add(torsoG);
  P.torso = torsoG;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 0.56, 16), toon(top));
  torso.position.y = 0.3;
  torso.castShadow = true;
  torsoG.add(torso);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(top));
  shoulders.scale.set(1.25, 0.5, 1);
  shoulders.position.y = 0.56;
  shoulders.castShadow = true;
  torsoG.add(shoulders);

  if (robe) {
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.46, 0.95, 20, 1, true), toon(robe, { side: THREE.DoubleSide }));
    r.position.y = -0.4;
    r.castShadow = true;
    torsoG.add(r);
    P.skirt = r;
  } else if (gender === 'female') {
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.44, 0.72, 20, 1, true), toon(bottom, { side: THREE.DoubleSide }));
    skirt.position.y = -0.3;
    skirt.castShadow = true;
    torsoG.add(skirt);
    P.skirt = skirt;
  } else {
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.08, 16), toon('#3a2a22'));
    belt.position.y = 0.04;
    torsoG.add(belt);
    const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.25, 0.16, 16), toon(top));
    hem.position.y = -0.04;
    torsoG.add(hem);
  }
  if (apron) {
    const a = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.6, 0.02), toon(apron));
    a.position.set(0, 0.05, 0.23);
    torsoG.add(a);
  }
  if (scarf) {
    const s = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.05, 8, 16), toon(scarf));
    s.rotation.x = Math.PI / 2;
    s.position.y = 0.64;
    torsoG.add(s);
  }
  if (backpack) {
    const bp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.16), toon('#6b5a48'));
    bp.position.set(0, 0.32, -0.26);
    bp.castShadow = true;
    torsoG.add(bp);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.02), glowMat('#f2703c', 2.2));
    strip.position.set(0, 0.36, -0.345);
    torsoG.add(strip);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.34, 10), toon('#d9d4c8'));
    tank.position.set(0.19, 0.32, -0.26);
    torsoG.add(tank);
  }

  // arms
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.26, 0.58, 0);
    const arm = capsule(0.058, 0.42, top);
    arm.position.y = -0.24;
    pivot.add(arm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 8), skinMat);
    hand.position.y = -0.5;
    hand.castShadow = true;
    pivot.add(hand);
    pivot.rotation.z = side * 0.08;
    torsoG.add(pivot);
    P[side < 0 ? 'armL' : 'armR'] = pivot;
  }

  // head
  const head = new THREE.Group();
  head.position.y = 0.78;
  torsoG.add(head);
  P.head = head;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 10), skinMat);
  neck.position.y = -0.08;
  head.add(neck);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 18), skinMat);
  skull.scale.set(1, 1.06, 1);
  skull.position.y = 0.12;
  skull.castShadow = true;
  head.add(skull);
  const eyeMat = toon('#1c1512');
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), eyeMat);
    eye.scale.set(0.8, eyesClosed ? 0.18 : 1.25, 0.5);
    eye.position.set(side * 0.068, 0.12, 0.172);
    head.add(eye);
    if (!eyesClosed) {
      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      glint.position.set(side * 0.068 + 0.008, 0.135, 0.186);
      head.add(glint);
    }
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.028, 12), new THREE.MeshBasicMaterial({ color: '#f2a08a', transparent: true, opacity: 0.55 }));
    blush.position.set(side * 0.105, 0.07, 0.162);
    blush.rotation.y = side * 0.5;
    head.add(blush);
  }
  const hairMat = toon(elder ? '#d8d4cc' : hair);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.205, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
  cap.position.set(0, 0.14, -0.012);
  cap.rotation.x = -0.32;
  cap.castShadow = true;
  head.add(cap);
  const back = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), hairMat);
  back.scale.set(1.02, gender === 'female' ? 1.05 : 0.9, 0.9);
  back.position.set(0, 0.11, -0.05);
  head.add(back);
  if (gender === 'female') {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10), hairMat);
    bun.position.set(0, 0.25, -0.16);
    head.add(bun);
    for (const side of [-1, 1]) {
      const lock = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.14, 4, 8), hairMat);
      lock.position.set(side * 0.17, 0.02, 0.06);
      lock.rotation.z = side * 0.15;
      head.add(lock);
    }
  } else {
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), hairMat);
    fringe.scale.set(1.8, 0.5, 0.8);
    fringe.position.set(0.04, 0.27, 0.13);
    fringe.rotation.z = -0.3;
    head.add(fringe);
  }
  if (beard) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), toon(elder ? '#e9e5dc' : '#6d5a4a'));
    b.scale.set(1, 0.9, 0.7);
    b.position.set(0, -0.02, 0.1);
    head.add(b);
  }
  if (hat) {
    const straw = toon(hat === true ? '#e6c77a' : hat);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.025, 28), straw);
    brim.position.y = 0.25;
    brim.castShadow = true;
    head.add(brim);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.16, 20), straw);
    crown.position.y = 0.33;
    head.add(crown);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.04, 20), toon('#a9203e'));
    band.position.y = 0.27;
    head.add(band);
  }

  const scale = child ? 0.66 : elder ? 0.95 : 1;
  root.scale.setScalar(scale);
  if (child) head.scale.setScalar(1.25);
  if (elder) torsoG.rotation.x = 0.12;

  // carried basket (hidden by default)
  const basket = new THREE.Group();
  const bk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.18, 14, 1, true), toon('#a67c4e', { side: THREE.DoubleSide }));
  basket.add(bk);
  const contents = [];
  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), toon('#f28a3c'));
    c.position.set(Math.cos(i) * 0.1, 0.06 + (i % 2) * 0.04, Math.sin(i) * 0.1);
    c.visible = false;
    basket.add(c);
    contents.push(c);
  }
  basket.position.set(0, 0.24, 0.3);
  basket.visible = false;
  torsoG.add(basket);

  let phase = 0;
  const api = {
    group: root,
    parts: P,
    setCarry(n, color) {
      basket.visible = n > 0;
      contents.forEach((c, i) => {
        c.visible = i < n;
        if (color) c.material.color.set(color);
      });
    },
    animate(dt, speed, t) {
      const k = clamp(speed / 3, 0, 2.1);
      if (k > 0.05) {
        phase += dt * (4 + speed * 1.6);
        const sw = Math.sin(phase);
        P.legL.rotation.x = sw * 0.62 * Math.min(k, 1.2);
        P.legR.rotation.x = -sw * 0.62 * Math.min(k, 1.2);
        const carrying = basket.visible;
        P.armL.rotation.x = carrying ? -1.0 : -sw * 0.55 * Math.min(k, 1.2);
        P.armR.rotation.x = carrying ? -1.0 : sw * 0.55 * Math.min(k, 1.2);
        body.position.y = Math.abs(Math.cos(phase)) * 0.05 * Math.min(k, 1.3);
        torsoG.rotation.x = (elder ? 0.12 : 0) + 0.05 * Math.min(k, 1.5);
        if (P.skirt) P.skirt.rotation.z = sw * 0.04;
      } else {
        const damp = Math.min(1, dt * 8);
        P.legL.rotation.x *= 1 - damp;
        P.legR.rotation.x *= 1 - damp;
        const carrying = basket.visible;
        P.armL.rotation.x = carrying ? -1.0 : P.armL.rotation.x * (1 - damp) + Math.sin(t * 1.5) * 0.01;
        P.armR.rotation.x = carrying ? -1.0 : P.armR.rotation.x * (1 - damp) - Math.sin(t * 1.5) * 0.01;
        body.position.y *= 1 - damp;
        torso.scale.y = 1 + Math.sin(t * 2.1) * 0.012;
        torsoG.rotation.x = elder ? 0.12 : 0;
      }
    },
    /** Point the head toward a world position (for NPCs noticing the player). */
    lookAt(target, dt) {
      const local = root.worldToLocal(target.clone());
      const yaw = clamp(Math.atan2(local.x, local.z), -0.9, 0.9);
      head.rotation.y += (yaw - head.rotation.y) * Math.min(1, dt * 4);
    },
  };
  root.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return api;
}

/** An idle NPC that turns to face the player when near. */
export function makeNPC(world, opts) {
  const c = buildCharacter(opts);
  c.group.position.copy(opts.position);
  c.group.rotation.y = opts.yaw || 0;
  world.scene.add(c.group);
  world.animate((t, _cam, _p, dt) => {
    c.animate(dt, 0, t + (opts.phase || 0));
    const pl = world.game.player.position;
    if (pl.distanceTo(c.group.position) < 7) c.lookAt(pl.clone().setY(pl.y + 1.4), dt);
    else c.parts.head.rotation.y *= 0.97;
  });
  world.colliders.push({ type: 'circle', x: opts.position.x, z: opts.position.z, r: 0.4 });
  return c;
}

export class CharacterController {
  constructor(game) {
    this.game = game;
    this.position = new THREE.Vector3();
    this.facing = 0;
    this.speed = 0;
    this.radius = 0.32;
    this.model = null;
    this.camYaw = 0;
    this.camPitch = 0.28;
    this.camDist = 5;
    this.camDistTarget = 5;
    this.minPitch = -0.2;
    this.maxPitch = 1.15;
    this._camPos = new THREE.Vector3();
    this._ray = new THREE.Raycaster();
    this.xrSnap = 0;
  }

  build(character) {
    const c = this.game.content;
    const outfit = c.outfits.find((o) => o.id === character.outfit) || c.outfits[0];
    const def = c.characters[character.gender] || c.characters.female;
    this.model = buildCharacter({ gender: character.gender, top: outfit.top, bottom: outfit.bottom, hair: def.hair, skin: def.skin, backpack: true });
    return this.model;
  }

  attach(world) {
    world.scene.add(this.model.group);
    this.model.group.visible = true;
  }

  place(x, y, z, facing = 0, camYaw = facing + Math.PI) {
    this.position.set(x, y, z);
    this.facing = facing;
    this.camYaw = camYaw;
    this.speed = 0;
    this.model.group.position.copy(this.position);
    this.model.group.rotation.y = facing;
    this.snapCamera();
  }

  snapCamera() {
    this.camDist = this.camDistTarget;
    this._computeCam(this._camPos);
    const cam = this.game.engine.camera;
    cam.position.copy(this._camPos);
    cam.lookAt(this.position.x, this.position.y + 1.4, this.position.z);
  }

  update(dt, allowMove = true) {
    const { input, world } = this.game;
    const xr = this.game.engine.renderer.xr.isPresenting;
    const look = input.consumeLook();
    if (!xr) {
      this.camYaw -= look.x * 0.0026;
      this.camPitch = clamp(this.camPitch + look.y * 0.0022, this.minPitch, this.maxPitch);
      const wheel = input.consumeWheel();
      if (wheel) this.camDistTarget = clamp(this.camDistTarget + wheel * 0.6, world.camMin ?? 2.2, world.camMax ?? 9);
    } else {
      // snap-turn on the right stick
      this.xrSnap -= dt;
      if (Math.abs(input.xr.look.x) > 0.7 && this.xrSnap <= 0) {
        this.camYaw -= Math.sign(input.xr.look.x) * (Math.PI / 6);
        this.xrSnap = 0.35;
      }
    }

    let ax = { x: 0, y: 0 };
    if (allowMove) ax = input.axis();
    let yawRef = this.camYaw;
    if (xr) {
      const q = new THREE.Quaternion();
      this.game.engine.camera.getWorldQuaternion(q);
      const e = new THREE.Euler().setFromQuaternion(q, 'YXZ');
      yawRef = e.y;
    }
    const fx = -Math.sin(yawRef), fz = -Math.cos(yawRef);
    const rx = Math.cos(yawRef), rz = -Math.sin(yawRef);
    let mx = fx * ax.y + rx * ax.x, mz = fz * ax.y + rz * ax.x;
    const len = Math.hypot(mx, mz);
    const running = input.run();
    const target = len > 0.01 ? (running ? 6.4 : 3.1) * Math.min(1, len) : 0;
    this.speed += (target - this.speed) * Math.min(1, dt * 8);
    if (len > 0.01) {
      mx /= len; mz /= len;
      const want = Math.atan2(mx, mz);
      let d = want - this.facing;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      this.facing += d * Math.min(1, dt * 10);
    }
    if (this.speed > 0.01) {
      const vx = Math.sin(this.facing) * this.speed * dt;
      const vz = Math.cos(this.facing) * this.speed * dt;
      const p = this.position;
      // axis-separated so we slide along unwalkable edges
      const tryMove = (nx, nz) => {
        const h = world.groundAt(nx, nz);
        if (h === null || h === undefined) return false;
        if (h - p.y > 0.6) return false; // too steep a step
        p.x = nx; p.z = nz;
        return true;
      };
      if (!tryMove(p.x + vx, p.z + vz)) { tryMove(p.x + vx, p.z) || tryMove(p.x, p.z + vz); }
      resolveCollisions(p, this.radius, world.colliders);
      const h = world.groundAt(p.x, p.z);
      if (h === null || h === undefined) { p.x -= vx; p.z -= vz; }
    }
    const gh = world.groundAt(this.position.x, this.position.z) ?? this.position.y;
    this.position.y += (gh - this.position.y) * Math.min(1, dt * 14);

    const g = this.model.group;
    g.position.copy(this.position);
    g.rotation.y = this.facing;
    this.model.animate(dt, this.speed, this.game.time);
    g.visible = !xr;
  }

  _computeCam(out) {
    const p = this.position;
    const cp = Math.cos(this.camPitch), sp = Math.sin(this.camPitch);
    out.set(
      p.x + Math.sin(this.camYaw) * cp * this.camDist,
      p.y + 1.45 + sp * this.camDist,
      p.z + Math.cos(this.camYaw) * cp * this.camDist,
    );
    return out;
  }

  updateCamera(dt) {
    const { engine, world } = this.game;
    const cam = engine.camera;
    if (engine.renderer.xr.isPresenting) {
      engine.rig.position.copy(this.position);
      engine.rig.rotation.set(0, this.camYaw, 0);
      return;
    }
    engine.rig.position.set(0, 0, 0);
    engine.rig.rotation.set(0, 0, 0);
    this.camDist += (this.camDistTarget - this.camDist) * Math.min(1, dt * 5);
    const target = new THREE.Vector3(this.position.x, this.position.y + 1.45, this.position.z);
    this._computeCam(this._camPos);
    // keep the camera out of walls
    if (world.cameraBlockers && world.cameraBlockers.length) {
      const dir = this._camPos.clone().sub(target);
      const dist = dir.length();
      dir.normalize();
      this._ray.set(target, dir);
      this._ray.far = dist;
      const hit = this._ray.intersectObjects(world.cameraBlockers, false)[0];
      if (hit) this._camPos.copy(target).addScaledVector(dir, Math.max(0.35, hit.distance - 0.25));
    }
    const gh = world.groundAt(this._camPos.x, this._camPos.z);
    if (gh !== null && gh !== undefined && this._camPos.y < gh + 0.4) this._camPos.y = gh + 0.4;
    cam.position.lerp(this._camPos, Math.min(1, dt * 12));
    cam.lookAt(target);
  }
}
