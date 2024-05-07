import timeUtil from "./timeUtil";

class NumUtil {
    public format(value: number | string, formatType: string, decimal: number = 2): string {
        const valueStr = String(value).trim().toLowerCase();

        if (
            value === null ||
            value === undefined ||
            value === "" ||
            isNaN(Number(value)) ||
            valueStr === "null" ||
            valueStr === "nan"
        )
            return "";
        if (!formatType || !formatType.trim()) return valueStr;

        const valueNumber = Number(value);

        switch (formatType) {
            case "Percent":
                return valueNumber >= 0
                    ? (Number.isInteger(valueNumber) ? valueNumber : valueNumber.toFixed(2)) + "%"
                    : "";
            case "Bytes":
                return this.formatBytes(valueNumber, "B", decimal);
            case "MemoryKB":
                return this.formatBytes(valueNumber, "KB", decimal);
            case "DiskMB":
                return this.formatBytes(valueNumber, "MB", decimal);
            case "BitsPerSec":
                return this.formatBps(valueNumber, "b", "", decimal);
            case "BytesPerSec":
                return this.formatBps(valueNumber, "B", "", decimal);
            case "KBytesPerSec":
                return this.formatBps(valueNumber, "B", "K", decimal);
            case "DurationMSec":
                return timeUtil.formatDuring(valueNumber);
            case "DurationSec":
                return timeUtil.formatDuring(valueNumber * 1000);
            case "DurationDay":
                return timeUtil.formatDuring(valueNumber * 8640000);
            case "Int":
            case "Integer":
            default:
                return valueStr;
        }
    }

    public formatBytes(bytes: number, unit: string = "", decimal: number = 0): string {
        const rate = Math.pow(10, decimal),
            thresholds = [1024 / rate, 1048576 / rate, 1073741824 / rate, 1099511627776 / rate],
            unitBase = [1024, 1048576, 1073741824, 1099511627776],
            units = ["KB", "MB", "GB", "TB"];

        let unitIndex = -1;

        if (unit) {
            unitIndex = units.indexOf(unit);
            if (unitIndex !== -1) {
                bytes *= unitBase[unitIndex];
            }
        }

        if (bytes === 0) {
            if (unitIndex !== -1) return String(bytes) + " " + units[unitIndex];
            else return "0";
        }

        for (let i = 4; i > unitIndex; i--) {
            if (bytes > unitBase[i]) {
                return String(Math.floor(bytes / thresholds[i]) / rate) + " " + units[i];
            }
        }

        return String(bytes) + " B";
    }

    public formatBps(bps: number, unit: string, base: string, decimal: number = 0): string {
        const k = 1000,
            thresholds = [k, k * k, Math.pow(k, 3), Math.pow(k, 4)],
            unitBase = ["K", "M", "G", "T"];

        let units = ["Kbps", "Mbps", "Gbps", "Tbps"],
            baseIndex = -1,
            i,
            num,
            defaultUnit = "bps";

        if (unit == "B") {
            units = ["KBps", "MBps", "GBps", "TBps"];
            defaultUnit = "Bps";
        }
        if (base) {
            baseIndex = unitBase.indexOf(base);
            if (baseIndex != -1) {
                bps *= thresholds[baseIndex];
            }
        }
        if (bps == 0) {
            if (baseIndex != -1) {
                return "0" + units[baseIndex];
            } else {
                return "0Bps";
            }
        }
        for (i = 3; i >= 0; i--) {
            num = thresholds[i];
            if (bps > num) {
                return String(parseFloat(String(bps / num)).toFixed(decimal)) + units[i];
            }
        }
        return String(parseFloat(String(bps)).toFixed(decimal)) + defaultUnit;
    }

    public trimZeroAndNineTail(val: number | string): number | string {
        const zeroRegex = /^(\d+\.\d+?)0+\d$/g;
        const nineRegex = /^(\d+\.\d+?)9+\d$/g;

        if (isNaN(Number(val))) {
            return val;
        }
        const str = String(val),
            num = Number(val);
        if (zeroRegex.test(str)) {
            return Number(str.replace(zeroRegex, "$1"));
        } else if (nineRegex.test(str)) {
            const validDigStr = str.replace(nineRegex, "$1"),
                dig = validDigStr.length - validDigStr.indexOf(".") - 1,
                exp = Math.pow(10, dig);
            return Math.round(num * exp) / exp;
        } else {
            return val;
        }
    }

    public distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    public randNum(min: number = 0, max: number = 1, decimal: number = 2): number {
        return Math.round((min + Math.random() * (max - min)) * (decimal * 10)) / (decimal * 10);
    }

    public randInt(max: number): number {
        return Math.round(Math.random() * max);
    }
}

const numUtil = new NumUtil();
export default numUtil;
