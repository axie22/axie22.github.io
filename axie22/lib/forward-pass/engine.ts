import * as THREE from "three";
import { COLORS, CUBE, DX, DZ, L, LOGIT_Y, MAX_PROMPT_TOKENS, MOBILE_BREAKPOINT, S, TIMING, TOP_Y, levelY, type Candidate } from "./config";
import { makeLabel } from "./labels";
import { HEADS, clamp, computeModel, genSteps, getCandidates, isDefaultPrompt, sstep, type Model } from "./model";
import { disp, tokenize } from "./tokenize";

export type StageInfo = { title: string; detail: string };

export type EngineEvents = {
  onStageChange(stage: StageInfo): void; // fires only when the string changes
  onTokenEmitted(token: string): void; // append to tagline
  onRunStart(prompt: string): void; // reset tagline
  onDone(): void;
  onProgress?(p01: number): void; // for the scrub slider; throttled to ~10 Hz
  onPlayingChange?(playing: boolean): void;
  onHudVisibleChange?(visible: boolean): void;
  onContextLost?(): void;
};

export type EngineOptions = {
  /** Element whose box the canvas fills; observed for resize and visibility. */
  container: HTMLElement;
  /** Mobile only: the band (inside container) the scene should be centered on, below the text. */
  stageEl?: HTMLElement | null;
  fontFamily: string;
  dims: number;
  maxDpr: number;
  reducedMotion: boolean;
  /** Fine pointer: enables drag-to-rotate and mouse parallax. */
  finePointer: boolean;
  /** Start every run in its final state (used for poster screenshots). */
  finalOnly?: boolean;
};

type Inst = { i: number; s: number; v: number; x: number; y: number; z: number };
type Arc = { m: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>; w: number; sOut: number; isNew: boolean; N: number };
type Slab = { edges: THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>; fill: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>; sOut: number; isNew: boolean };
type Bar = { bar: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>; lab: THREE.Sprite; x: number; h: number };
type Pass = {
  group: THREE.Group;
  mesh: THREE.InstancedMesh;
  inst: Inst[];
  plates: THREE.LineLoop<THREE.BufferGeometry, THREE.LineBasicMaterial>[];
  spines: { ln: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>; x: number; i: number }[];
  arcs: Arc[];
  slabs: Slab[];
  unembed: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  bars: Bar[];
  cands: readonly Candidate[];
  xl: number;
  T: number;
  emitted: boolean;
  model: Model;
};

const C = {
  amber: new THREE.Color(COLORS.amber),
  cyan: new THREE.Color(COLORS.cyan),
  violet: new THREE.Color(COLORS.violet),
  dim: new THREE.Color(COLORS.cubeDim),
  plate: new THREE.Color(COLORS.plate),
  plateHi: new THREE.Color(COLORS.plateHi),
  slate: new THREE.Color(COLORS.slate),
};

const m4 = new THREE.Matrix4();
const q = new THREE.Quaternion();
const vs = new THREE.Vector3();
const vp = new THREE.Vector3();

export class ForwardPassEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  private grid: THREE.GridHelper;
  private cubeGeo = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
  private cubeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  private pass: Pass | null = null;

  private prompt = "";
  private tokens: string[] = [];
  private genCount = 0; // index of the current decode step
  private cached = 0; // columns computed in earlier passes (KV cache)
  private isDefault = true;
  private p = -1;
  private playing = false;
  private done = false;

  // camera + input
  private mx = 0;
  private my = 0;
  private userAz = 0;
  private dragging = false;
  private lastX = 0;
  private focusY = 0;
  private dist = 18;
  private elapsed = 0;

  // loop + visibility
  private rafId = 0;
  private stillId = 0;
  private lastNow = 0;
  private inView = true;
  private pageVisible = typeof document === "undefined" || !document.hidden;
  private faded = false;
  private hudVisible = true;
  private disposed = false;
  private lastStageKey = "";
  private lastProgressAt = 0;
  private cleanups: (() => void)[] = [];

  constructor(private canvas: HTMLCanvasElement, private events: EngineEvents, private opts: EngineOptions) {
    // Throws if WebGL is unavailable; the caller shows the poster instead.
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });

    const bg = new THREE.Color(COLORS.bg);
    this.scene.background = bg;
    this.scene.fog = new THREE.Fog(bg, 22, 55);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const dl = new THREE.DirectionalLight(0xffffff, 2.2);
    dl.position.set(6, 12, 8);
    this.scene.add(dl);
    this.grid = new THREE.GridHelper(60, 60, COLORS.gridCenter, COLORS.grid);
    this.grid.position.y = -1.3;
    this.scene.add(this.grid);

    this.bindInput();
    this.resize();
  }

  /* ---------- public API ---------- */

  /** Run a new forward pass on `promptText`. Returns false for an empty prompt. */
  start(promptText: string): boolean {
    const toks = tokenize(promptText).slice(0, MAX_PROMPT_TOKENS);
    if (!toks.length || this.disposed) return false;
    const trimmed = promptText.trim();
    this.isDefault = isDefaultPrompt(trimmed);
    // What the model actually saw (prompt may have been truncated).
    this.prompt = this.isDefault ? trimmed : toks.join("");
    this.tokens = ["<bos>", ...toks];
    this.genCount = 0;
    this.cached = 0;
    this.done = false;
    this.events.onRunStart(this.prompt);
    if (this.opts.reducedMotion || this.opts.finalOnly) {
      this.jumpToFinal();
      return true;
    }
    this.buildPass();
    this.p = -1;
    this.setPlaying(true);
    this.syncLoop();
    return true;
  }

  play() {
    if (this.done || !this.pass) {
      this.start(this.prompt);
      return;
    }
    if (this.opts.reducedMotion) return;
    this.setPlaying(true);
  }

  pause() {
    this.setPlaying(false);
  }

  /** Scrub within the current pass. Pauses; never triggers the next decode step. */
  seek(p01: number) {
    if (!this.pass) return;
    this.done = false;
    this.setPlaying(false);
    this.p = clamp(p01 * (S + 1) - 1, -1, S);
    this.emitProgress(true);
    this.requestRender();
  }

  setReducedMotion(reduce: boolean) {
    if (reduce === this.opts.reducedMotion) return;
    this.opts.reducedMotion = reduce;
    if (this.prompt) this.start(this.prompt);
    this.syncLoop();
  }

  /** Render immediately and return the canvas as a PNG data URL (dev screenshots). */
  snapshot(): string {
    this.tick(0, true);
    return this.canvas.toDataURL("image/png");
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.stillId) cancelAnimationFrame(this.stillId);
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
    if (this.pass) this.disposePass(this.pass);
    this.pass = null;
    this.cubeGeo.dispose();
    this.cubeMat.dispose();
    this.grid.geometry.dispose();
    (this.grid.material as THREE.Material).dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  /* ---------- control flow ---------- */

  private setPlaying(v: boolean) {
    if (v === this.playing) return;
    this.playing = v;
    this.events.onPlayingChange?.(v);
  }

  private jumpToFinal() {
    const n = genSteps();
    for (let g = 0; g < n - 1; g++) {
      const tok = getCandidates(this.tokens, g, this.isDefault)[0][0];
      this.events.onTokenEmitted(tok);
      this.tokens.push(tok);
    }
    this.genCount = n - 1;
    this.cached = n > 1 ? this.tokens.length - 1 : 0;
    this.buildPass();
    this.events.onTokenEmitted(this.pass!.cands[0][0]);
    this.pass!.emitted = true;
    this.p = S;
    this.setPlaying(false);
    this.done = true;
    this.events.onDone();
    this.emitProgress(true);
    this.requestRender(true);
  }

  private onPassDone() {
    if (this.genCount + 1 < genSteps()) {
      this.genCount++;
      this.cached = this.tokens.length;
      this.tokens.push(this.pass!.cands[0][0]);
      this.buildPass();
      this.p = -1;
    } else {
      this.done = true;
      this.setPlaying(false);
      this.p = S + TIMING.hold;
      this.events.onDone();
    }
  }

  private stageDur(x: number) {
    if (x < 0) return TIMING.embed;
    if (x >= S - 1) return TIMING.logits;
    return (Math.floor(x) + 1) % 2 === 1 ? TIMING.attn : TIMING.mlp;
  }

  /* ---------- scene build ---------- */

  private disposePass(P: Pass) {
    this.scene.remove(P.group);
    P.group.traverse((o) => {
      const obj = o as THREE.Mesh;
      // Sprites share one module-level geometry in three.js; leave it alone.
      if (obj.geometry && obj.geometry !== this.cubeGeo && !(o instanceof THREE.Sprite)) obj.geometry.dispose();
      const mat = obj.material as THREE.Material & { map?: THREE.Texture | null };
      if (mat && mat !== this.cubeMat) {
        mat.map?.dispose();
        mat.dispose();
      }
    });
    if (P.mesh) P.mesh.dispose();
  }

  private label(text: string, o: Parameters<typeof makeLabel>[2]) {
    return makeLabel(text, this.opts.fontFamily, o);
  }

  private buildPass() {
    if (this.pass) this.disposePass(this.pass);
    const D = this.opts.dims;
    const { tokens, cached, genCount } = this;
    const model = computeModel(tokens, D);
    const T = model.T;
    const group = new THREE.Group();
    const xs = (i: number) => (i - (T - 1) / 2) * DX;
    const zFront = (D * DZ) / 2;
    this.scene.add(group);

    // activation cubes (instanced)
    const mesh = new THREE.InstancedMesh(this.cubeGeo, this.cubeMat, T * S * D);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const inst: Inst[] = [];
    const col = new THREE.Color();
    for (let i = 0; i < T; i++)
      for (let s = 0; s < S; s++)
        for (let k = 0; k < D; k++) {
          const v = model.V[i][s][k];
          col.copy(C.dim).lerp(v > 0 ? C.amber : C.cyan, 0.12 + 0.88 * sstep(0, 0.75, Math.abs(v)));
          mesh.setColorAt(inst.length, col);
          inst.push({ i, s, v, x: xs(i), y: levelY(s), z: (k - (D - 1) / 2) * DZ });
        }
    mesh.instanceColor!.needsUpdate = true;
    group.add(mesh);

    // level plates + labels
    const plates: Pass["plates"] = [];
    const pw = T * DX - 0.3;
    const pd = D * DZ + 0.35;
    for (let s = 0; s < S; s++) {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-pw / 2, 0, -pd / 2),
        new THREE.Vector3(pw / 2, 0, -pd / 2),
        new THREE.Vector3(pw / 2, 0, pd / 2),
        new THREE.Vector3(-pw / 2, 0, pd / 2),
      ]);
      const m = new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: C.plate.clone(), transparent: true, opacity: 0.9 }));
      m.position.y = levelY(s) - 0.02;
      group.add(m);
      plates.push(m);
      const name = s === 0 ? "embed" : s % 2 ? `attn ${(s + 1) / 2}` : `mlp ${s / 2}`;
      const lab = this.label(name, { h: 0.24, align: "right" });
      lab.position.set(-pw / 2 - 0.25, levelY(s), pd / 2);
      group.add(lab);
    }

    // token labels
    for (let i = 0; i < T; i++) {
      const isNew = i >= cached && genCount > 0 && i === T - 1;
      const lab = this.label(disp(tokens[i]), { h: 0.3, color: isNew ? COLORS.amber : COLORS.tokenLabel, weight: 500 });
      lab.center.set(0.5, 1);
      lab.position.set(xs(i), -0.45, zFront + 0.35);
      group.add(lab);
    }

    // residual stream spines
    const spines: Pass["spines"] = [];
    for (let i = 0; i < T; i++) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const ln = new THREE.Line(g, new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
      ln.frustumCulled = false;
      group.add(ln);
      spines.push({ ln, x: xs(i), i });
    }

    // attention arcs (causal: dest i attends to source j <= i)
    const arcs: Arc[] = [];
    const N = 40;
    for (let b = 0; b < L; b++) {
      const yIn = levelY(2 * b) + 0.18;
      const yOut = levelY(2 * b + 1) - 0.18;
      const zA = zFront + 0.15;
      for (let i = 0; i < T; i++)
        for (let j = 0; j <= i; j++) {
          const w = model.W[b][i][j];
          if (w < 0.035) continue;
          const a = new THREE.Vector3(xs(j), yIn, zA);
          const c = new THREE.Vector3(xs(i), yOut, zA);
          const ctrl = new THREE.Vector3((a.x + c.x) / 2, (yIn + yOut) / 2 + 0.1, zA + 0.55 + 0.4 * (i - j));
          const g = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, ctrl, c), N, 0.012 + 0.03 * w, 5, false);
          const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: C.violet, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
          group.add(m);
          arcs.push({ m, w, sOut: 2 * b + 1, isNew: i >= cached, N: g.index!.count });
        }
    }

    // MLP slabs (4x wider than the residual stream)
    const slabs: Slab[] = [];
    for (let b = 0; b < L; b++)
      for (let i = 0; i < T; i++) {
        const sOut = 2 * b + 2;
        const y = (levelY(sOut - 1) + levelY(sOut)) / 2;
        const bg = new THREE.BoxGeometry(0.75, 0.32, D * DZ * 1.7);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(bg), new THREE.LineBasicMaterial({ color: C.amber, transparent: true, opacity: 0, depthWrite: false }));
        const fill = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ color: C.amber, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
        edges.position.set(xs(i), y, 0);
        fill.position.copy(edges.position);
        group.add(edges, fill);
        slabs.push({ edges, fill, sOut, isNew: i >= cached });
      }

    // unembed -> logits for the last position
    const cands = getCandidates(tokens, genCount, this.isDefault);
    const xl = xs(T - 1);
    const bars: Bar[] = [];
    const ug = new THREE.BufferGeometry();
    ug.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const unembed = new THREE.Line(ug, new THREE.LineBasicMaterial({ color: C.violet, transparent: true, opacity: 0.8 }));
    unembed.frustumCulled = false;
    group.add(unembed);
    cands.forEach(([tok, pr], c) => {
      const win = c === 0;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1, 0.42), new THREE.MeshLambertMaterial({ color: win ? C.amber : C.slate, transparent: true, opacity: 1 }));
      const x = xl - c * 1.05; // winner sits over the last token, runners-up step back toward the stack's center
      const lab = this.label(`${disp(tok)}\n${Math.round(pr * 100)}%`, { h: 0.2, color: win ? COLORS.amber : COLORS.dim, weight: win ? 500 : 400 });
      lab.center.set(0.5, 0);
      group.add(bar, lab);
      bars.push({ bar, lab, x, h: 0.15 + pr * 4 });
    });

    this.pass = { group, mesh, inst, plates, spines, arcs, slabs, unembed, bars, cands, xl, T, emitted: false, model };
  }

  /* ---------- per-frame scene update ---------- */

  private updatePass() {
    const P = this.pass!;
    const { p, cached, done } = this;
    for (let n = 0; n < P.inst.length; n++) {
      const it = P.inst[n];
      const a = it.i < cached ? 1 : sstep(it.s - 0.45, it.s, p);
      const h = 0.35 + Math.abs(it.v) * 2.6;
      vs.set(Math.max(a, 1e-4), Math.max(a * h, 1e-4), Math.max(a, 1e-4));
      vp.set(it.x, it.y - (1 - a) * 0.3, it.z);
      m4.compose(vp, q, vs);
      P.mesh.setMatrixAt(n, m4);
    }
    P.mesh.instanceMatrix.needsUpdate = true;

    P.plates.forEach((pl, s) => {
      const k = done ? 0 : 1 - Math.min(1, Math.abs(p - s));
      pl.material.color.copy(C.plate).lerp(C.plateHi, k);
    });

    P.spines.forEach(({ ln, x, i }) => {
      const top = i < cached ? TOP_Y : p < 0 ? 0 : levelY(clamp(p, 0, S - 1));
      const attr = ln.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      arr[0] = x; arr[1] = 0; arr[2] = 0; arr[3] = x; arr[4] = top; arr[5] = 0;
      attr.needsUpdate = true;
    });

    P.arcs.forEach((A) => {
      let frac: number, op: number;
      if (!A.isNew) {
        frac = 1;
        op = 0.06 + A.w * 0.3;
      } else {
        frac = clamp((p - (A.sOut - 1)) / 0.65, 0, 1);
        op = 0.06 + A.w * (0.3 + 0.9 * (1 - sstep(A.sOut, A.sOut + 0.8, p)));
      }
      // keep the draw count a multiple of 3 (whole triangles)
      A.m.geometry.setDrawRange(0, Math.floor((A.N * frac) / 3) * 3);
      A.m.material.opacity = frac > 0 ? op : 0;
    });

    P.slabs.forEach((sl) => {
      const o = sl.isNew ? Math.sin(Math.PI * clamp(p - (sl.sOut - 1), 0, 1)) : 0;
      sl.edges.material.opacity = 0.05 + o * 0.7;
      sl.fill.material.opacity = o * 0.1;
    });

    const g = sstep(S - 1, S - 0.25, p);
    const uattr = P.unembed.geometry.attributes.position as THREE.BufferAttribute;
    const ua = uattr.array as Float32Array;
    ua[0] = P.xl; ua[1] = TOP_Y + 0.3; ua[2] = 0;
    ua[3] = P.xl; ua[4] = TOP_Y + 0.3 + (LOGIT_Y - TOP_Y - 0.45) * g; ua[5] = 0;
    uattr.needsUpdate = true;
    P.unembed.material.opacity = g > 0 ? 0.8 : 0;
    P.bars.forEach(({ bar, lab, x, h }) => {
      const hh = Math.max(h * g, 1e-3);
      bar.scale.y = hh;
      bar.position.set(x, LOGIT_Y + hh / 2, 0);
      bar.visible = g > 0;
      lab.position.set(x, LOGIT_Y + hh + 0.12, 0);
      (lab.material as THREE.SpriteMaterial).opacity = sstep(S - 0.6, S - 0.2, p);
    });
  }

  /* ---------- HUD text ---------- */

  private updateStage() {
    const { p, cached, done } = this;
    let title: string, detail: string;
    const cacheNote = cached > 0 ? " KV cache: earlier columns are reused; only the new token is computed." : "";
    const n = genSteps();
    if (done) {
      title = `done · generated ${n} token${n > 1 ? "s" : ""}`;
      detail = `Greedy decoding, ${n} step${n > 1 ? "s" : ""}. Edit the prompt and press Enter to run it again.`;
    } else if (p < 0) {
      title = "embed";
      detail = `token → vector (showing ${this.opts.dims} of d_model dims). Height = |activation|.${cacheNote}`;
    } else if (p >= S - 1) {
      const [t, pr] = this.pass!.cands[0];
      title = "unembed → logits";
      detail = `Last position's residual × W_U → softmax over vocab. Greedy pick: "${disp(t)}" (${Math.round(pr * 100)}%).`;
    } else {
      const s = Math.floor(p) + 1;
      const b = Math.ceil(s / 2);
      if (s % 2 === 1) {
        title = `block ${b} · attention`;
        detail = `${HEADS[b - 1].name}. Causal mask: each token attends only to itself and earlier tokens.${cacheNote}`;
      } else {
        title = `block ${b} · MLP`;
        detail = `Per-token: expand 4× → GELU → project back, added into the residual stream.${cacheNote}`;
      }
    }
    const key = title + "\n" + detail;
    if (key !== this.lastStageKey) {
      this.lastStageKey = key;
      this.events.onStageChange({ title, detail });
    }
  }

  private emitProgress(force = false) {
    if (!this.events.onProgress) return;
    const now = performance.now();
    if (!force && now - this.lastProgressAt < 100) return;
    this.lastProgressAt = now;
    this.events.onProgress(clamp((this.p + 1) / (S + 1), 0, 1));
  }

  /* ---------- loop ---------- */

  private shouldLoop() {
    return !this.disposed && !this.opts.reducedMotion && this.inView && this.pageVisible && !this.faded;
  }

  private syncLoop() {
    if (this.shouldLoop()) {
      if (!this.rafId) {
        this.lastNow = performance.now();
        this.rafId = requestAnimationFrame(this.frame);
      }
    } else if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  /** One frame when the loop isn't running (reduced motion, paused off-screen, resize). */
  private requestRender(snap = false) {
    if (this.rafId || this.stillId || this.disposed) return;
    this.stillId = requestAnimationFrame(() => {
      this.stillId = 0;
      this.tick(0, snap || !!this.opts.reducedMotion);
    });
  }

  private frame = (now: number) => {
    this.rafId = requestAnimationFrame(this.frame);
    const dt = Math.min((now - this.lastNow) / 1000, 0.05);
    this.lastNow = now;
    this.tick(dt, false);
  };

  private tick(dt: number, snap: boolean) {
    this.elapsed += dt;
    const P = this.pass;
    if (this.playing && P) {
      this.p += (dt * (this.cached > 0 ? TIMING.cachedSpeedup : 1)) / this.stageDur(this.p);
      if (!P.emitted && this.p >= S - 0.15) {
        this.events.onTokenEmitted(P.cands[0][0]);
        P.emitted = true;
      }
      if (this.p >= S + TIMING.hold) this.onPassDone();
      this.emitProgress();
    }
    if (this.pass) {
      this.updatePass();
      this.updateStage();
    }

    const T = this.pass ? this.pass.T : 6;
    const { p, done } = this;
    const targetY = done ? LOGIT_Y / 2 + 1.5 : levelY(clamp(p, 0, S - 1)) + (p > S - 1 ? (LOGIT_Y - TOP_Y) * clamp(p - (S - 1), 0, 1) : 0);
    // Back off on narrow (portrait) screens so every column fits horizontally.
    const fitDist = ((T * DX) / 2 + 1) / (Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.aspect);
    const baseDist = (done ? 24 : 17) + T * 1.4;
    const targetDist = Math.max(baseDist, fitDist);
    const k = snap ? 1 : Math.min(1, dt * 2.2);
    this.focusY += (targetY - this.focusY) * k;
    this.dist += (targetDist - this.dist) * k;
    // Push the fog back by whatever extra distance the fit added, so mobile isn't washed out.
    const extra = Math.max(0, this.dist - baseDist);
    const fog = this.scene.fog as THREE.Fog;
    fog.near = 22 + extra;
    fog.far = 55 + extra;
    const sway = this.opts.reducedMotion ? 0 : 0.12 * Math.sin(this.elapsed * 0.12);
    const az = 0.62 + this.userAz + sway + this.mx * 0.18;
    this.camera.position.set(Math.sin(az) * this.dist, this.focusY + 3.2 - this.my * 1.5, Math.cos(az) * this.dist);
    this.camera.lookAt(0, this.focusY, 0);
    this.renderer.render(this.scene, this.camera);
  }

  /* ---------- sizing, input, visibility ---------- */

  private resize() {
    const { container, maxDpr } = this.opts;
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Desktop: scene sits right of the text. Mobile: below it, centered on the stage band.
    const stage = this.opts.stageEl;
    if (w > MOBILE_BREAKPOINT) this.camera.setViewOffset(w, h, -w * 0.15, h * 0.1, w, h);
    else if (stage && stage.offsetHeight > 0) {
      const cr = container.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      this.camera.setViewOffset(w, h, 0, h / 2 - (sr.top + sr.height / 2 - cr.top), w, h);
    } else this.camera.setViewOffset(w, h, 0, -h * 0.22, w, h);
    this.camera.updateProjectionMatrix();
    this.requestRender();
  }

  private on<K extends keyof WindowEventMap>(target: Window, type: K, fn: (e: WindowEventMap[K]) => void, o?: AddEventListenerOptions): void;
  private on<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void, o?: AddEventListenerOptions): void;
  private on<K extends keyof DocumentEventMap>(target: Document, type: K, fn: (e: DocumentEventMap[K]) => void, o?: AddEventListenerOptions): void;
  private on(target: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions): void;
  private on(target: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions) {
    target.addEventListener(type, fn, o);
    this.cleanups.push(() => target.removeEventListener(type, fn, o));
  }

  private bindInput() {
    const { canvas } = this;
    const { container, finePointer } = this.opts;

    if (finePointer) {
      this.on(window, "pointermove", (e) => {
        this.mx = e.clientX / window.innerWidth - 0.5;
        this.my = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
      this.on(canvas, "pointerdown", (e) => {
        this.dragging = true;
        this.lastX = e.clientX;
        canvas.setPointerCapture(e.pointerId);
      });
      this.on(canvas, "pointermove", (e) => {
        if (!this.dragging) return;
        this.userAz -= (e.clientX - this.lastX) * 0.005;
        this.lastX = e.clientX;
        if (!this.rafId) this.requestRender(true);
      });
      this.on(window, "pointerup", () => (this.dragging = false));
    }

    this.on(canvas, "webglcontextlost", (e) => {
      e.preventDefault();
      if (!this.disposed) this.events.onContextLost?.();
    });

    const onScroll = () => {
      const sy = window.scrollY / window.innerHeight;
      const opacity = 1 - clamp(sy * 0.9, 0, 0.8);
      canvas.style.opacity = String(opacity);
      const faded = opacity <= 0.2 + 1e-3;
      const hud = sy <= 0.5;
      if (hud !== this.hudVisible) {
        this.hudVisible = hud;
        this.events.onHudVisibleChange?.(hud);
      }
      if (faded !== this.faded) {
        this.faded = faded;
        this.syncLoop();
      }
    };
    this.on(window, "scroll", onScroll, { passive: true });
    onScroll();

    this.on(document, "visibilitychange", () => {
      this.pageVisible = !document.hidden;
      this.syncLoop();
    });

    const ro = new ResizeObserver(() => this.resize());
    ro.observe(container);
    if (this.opts.stageEl) ro.observe(this.opts.stageEl);
    const io = new IntersectionObserver(([entry]) => {
      this.inView = entry.isIntersecting;
      this.syncLoop();
    });
    io.observe(container);
    this.cleanups.push(() => ro.disconnect(), () => io.disconnect());
  }
}

export const isMobileWidth = () => window.innerWidth <= MOBILE_BREAKPOINT;
