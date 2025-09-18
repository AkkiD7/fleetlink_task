export function windowsOverlap(startA, endA, startB, endB) {
    const a1 = new Date(startA).getTime();
    const a2 = new Date(endA).getTime();
    const b1 = new Date(startB).getTime();
    const b2 = new Date(endB).getTime();
    return a1 < b2 && b1 < a2;
}


