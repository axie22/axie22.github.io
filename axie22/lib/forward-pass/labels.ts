import * as THREE from "three";

export type LabelOptions = { color?: string; h?: number; weight?: number; align?: "center" | "left" | "right" };

/** Text sprite drawn into a 2D canvas texture. The font must already be loaded. */
export function makeLabel(text: string, fontFamily: string, { color = "#8a93a6", h = 0.26, weight = 400, align = "center" }: LabelOptions = {}) {
  const ls = text.split("\n");
  const fs = 64;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  const font = `${weight} ${fs}px ${fontFamily}`;
  ctx.font = font;
  c.width = Math.ceil(Math.max(...ls.map((l) => ctx.measureText(l).width)) + 16);
  c.height = Math.ceil(fs * 1.25 * ls.length) + 8;
  // resizing the canvas resets context state
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  ls.forEach((l, ix) => {
    const lw = ctx.measureText(l).width;
    const x = align === "right" ? c.width - 8 - lw : align === "left" ? 8 : (c.width - lw) / 2;
    ctx.fillText(l, x, 4 + ix * fs * 1.25);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: true }));
  const hh = h * ls.length;
  sp.scale.set((hh * c.width) / c.height, hh, 1);
  if (align === "right") sp.center.set(1, 0.5);
  return sp;
}
