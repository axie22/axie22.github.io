// Toy BPE-ish tokenizer: words keep their leading space, common suffixes and long words split.
export function tokenize(text: string): string[] {
  const out: string[] = [];
  const re = /(\s?[A-Za-z]+|\s?\d+|\s?[^\sA-Za-z\d])/g;
  const src = text.trim();
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const w = m[1];
    const lead = w.startsWith(" ") ? " " : "";
    const core = w.trim();
    const suf = ["ing", "tion", "ed", "ly", "er"].find((s) => core.length > 5 && core.toLowerCase().endsWith(s));
    if (suf) {
      out.push(lead + core.slice(0, -suf.length));
      out.push(core.slice(-suf.length));
    } else if (core.length > 9) {
      out.push(lead + core.slice(0, 5));
      out.push(core.slice(5));
    } else out.push(lead + core);
  }
  return out;
}

/** Display form of a token: leading space shown as a middle dot. */
export const disp = (t: string) => (t === "<bos>" ? "<bos>" : t.replace(/^ /, "·"));
