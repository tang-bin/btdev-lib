import timeUtil from "../utils/timeUtil";

describe("timeUtil", () => {
    const now = new Date().getTime();
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
    const d = h * 24;
    const mon = d * 30;
    const y = d * 365;

    const aTime = 1 * y + 2 * mon + 3 * d + 4 * h + 5 * m + 6 * s;
    const bTime = 1 * y + 5 * m;

    beforeEach(() => {});

    test("format to duration", () => {
        expect(timeUtil.formatDuring(aTime, { round: "mon", useLabel: true, separator: "<br>" })).toBe(
            "1 Year<br>2 Months"
        );
        expect(timeUtil.formatDuring(aTime)).toBe("1y 2mon 3d 4h 5m 6s");
        expect(timeUtil.formatDuring(aTime, { useLabel: true })).toBe(
            "1 Year 2 Months 3 Days 4 Hours 5 Minutes 6 Seconds"
        );
        expect(timeUtil.formatDuring(aTime, { takeHighest: true })).toBe("1y");

        expect(timeUtil.formatDuring(bTime, { round: "mon", useLabel: true })).toBe("1 Year");
    });
});
