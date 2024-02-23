const ESC = '\x1b';
const controls = {
    default: 0,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
};
export const color = new Proxy({}, {
    get: (_, prop) => (...strings) => {
        const color = controls[prop] ?? controls.default;
        return `${ESC}[${color}m${strings.join(' ')}${ESC}[${controls.default}m`;
    },
});
//# sourceMappingURL=consoleStyling.js.map