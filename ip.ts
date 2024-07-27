const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

/**
 * @param range 0.0.0.0/0
 * @returns
 */
export const ipGernerate = (range: string) => {
  const [_addr, _subnet] = range.split("/");
  const subnet = parseInt(_subnet, 10);
  const startNum = ipToUint32(_addr);

  if (subnet < 0 || subnet > 32) {
    throw new Error(`Wrong subnet ${subnet}`);
  }
  const offset = randInt(1, 2 ** (32 - subnet));
  const endNum = startNum + offset;

  return uint32ToIp(endNum);
};

const randInt = (min: number, max: number) => {
  if (min === max) {
    return min;
  }
  const r = crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1);
  return Math.floor(r * (max - min) + min);
};

/**
 * @param ip 0.0.0.0
 * @returns
 */
const ipToUint32 = (ip: string) => {
  if (!ipRegex.test(ip)) {
    throw new Error(`Wrong IP ${ip}`);
  }
  const u8 = new Uint8Array(ip.split(".", 4).map((s) => parseInt(s, 10)));
  const view = new DataView(u8.buffer);
  return view.getUint32(0, false);
};

/**
 * @param n
 * @returns
 */
const uint32ToIp = (n: number) => {
  const u8 = new Uint8Array(4);
  const view = new DataView(u8.buffer);
  view.setUint32(0, n, false);
  return Array.from(u8).map((n) => String(n)).join(".");
};
