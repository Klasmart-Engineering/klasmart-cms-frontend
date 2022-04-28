function pad(num: number) {
  return ("0" + num).slice(-2);
}
export function hhmmss(secs: number) {
  const _minutes = Math.floor(secs / 60);
  const _secs = Math.floor(secs % 60);
  const _hours = Math.floor(_minutes / 60);
  if (_hours > 0) {
    return `${pad(_hours)}:${pad(_minutes)}:${pad(_secs)}`;
  } else {
    return `${pad(_minutes)}:${pad(_secs)}`;
  }
}
