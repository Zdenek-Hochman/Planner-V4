export class MMatrix {
    constructor() {
    }

    Identity() {
        let out = new Array(6);
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = 0;
        out[5] = 0;
        return out;
    }

    FromTranslation({x: x, y: y}) {
        let out = new Array(6);
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = x;
        out[5] = y;
        return out;
    }

    Translate(a, {x: x, y: y}) {
        let out = new Array(6);
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];

        out[0] = a0;
        out[1] = a1;
        out[2] = a2;
        out[3] = a3;
        out[4] = a0 * x + a2 * y + a4;
        out[5] = a1 * x + a3 * y + a5;
        return out;
    }

    Rotate(a, rad) {
        let out = new Array(6);
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];

        let s = Math.sin(rad);
        let c = Math.cos(rad);

        out[0] = a0 * c + a2 * s;
        out[1] = a1 * c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        out[4] = a4;
        out[5] = a5;
        return out;
    }

    Scale(a, v) {
        let out = new Array(6);
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        let v0 = v[0], v1 = v[1];

        out[0] = a0 * v0;
        out[1] = a1 * v0;
        out[2] = a2 * v1;
        out[3] = a3 * v1;
        out[4] = a4;
        out[5] = a5;
        return out;
    }

    Decompose(m) {
        let E = (m[0] + m[3]) / 2
        let F = (m[0] - m[3]) / 2
        let G = (m[2] + m[1]) / 2
        let H = (m[2] - m[1]) / 2

        let Q = Math.sqrt(E * E + H * H);
        let R = Math.sqrt(F * F + G * G);
        let a1 = Math.atan2(G, F);
        let a2 = Math.atan2(H, E);
        let theta = (a2 - a1) / 2;
        let phi = (a2 + a1) / 2;

        return {
            x: m[4],
            y: m[5],
            rotate: -phi * 180 / Math.PI,
            scaleX: Q + R,
            scaleY: Q - R,
            skew: -theta * 180 / Math.PI
        };
    }
}
