export function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
}
