import { Euler } from "three";

export function degreesToRadians(degrees: [number, number, number]) {
    return degrees.map(d => d * Math.PI / 180) as unknown as Euler
}