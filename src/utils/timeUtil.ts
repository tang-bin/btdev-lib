class TimeUtil {
    public formatDuring(
        time: number,
        options?: { useLabel?: boolean; takeHighest?: Boolean; round?: string; separator?: string }
    ) {
        if (time === null || time === undefined) return "";
        else if (time === 0) return "0";
        else if (time < 0) return "";

        let ms = 1,
            s = 1000,
            m = s * 60,
            h = m * 60,
            d = h * 24,
            mm = d * 30,
            y = d * 365,
            units = ["y", "mon", "d", "h", "m", "s", "ms"],
            labels = ["Year", "Month", "Day", "Hour", "Minute", "Second", "Millisecond"],
            labelsPlural = ["Years", "Months", "Days", "Hours", "Minutes", "Seconds", "Milliseconds"];

        let ignoreRemains = false; // ignore the remains after the round option
        const timeStrList = [y, mm, d, h, m, s]
            .map((val, index) => {
                // Check if the unit is the round option
                const unit = units[index];
                if (ignoreRemains) return "";
                else if (unit === options?.round) ignoreRemains = true;

                if (time > val || index === 5) {
                    const v = index === 5 ? Math.floor((time * 100) / val) / 100 : Math.floor(time / val);
                    time = time % val;

                    if (options?.useLabel) {
                        if (v === 1) return v + " " + labels[index];
                        else return v + " " + labelsPlural[index];
                    } else return v + unit;
                } else return 0;
            })
            .filter((v) => !!v);

        if (options?.takeHighest) return timeStrList[0] || "";
        else return timeStrList.join(options?.separator || " ");
    }

    public formatDate(time: string | number, formatString: string = "short", dateFormat: string = "LOCAL"): string {
        let date;
        if (time === "now") date = new Date();
        else if (isNaN(Number(time))) {
            if (isNaN(new Date(time).getTime())) return "";
            else return String(time);
        } else {
            time = Number(time);
            if (!time || time <= 0) return "";
            else date = new Date(time);
        }
        const IS_LOCAL_DATE_FORMAT = !dateFormat || dateFormat === "LOCAL";

        if (formatString === "short") {
            if (dateFormat === "ISO8601") formatString = "yyyy-MM-DDThh:mm:ss";
            else if (dateFormat === "UTC") formatString = "DD Mon yyyy hh:mm:ss GMT";
            else formatString = "MM/DD/yyyy hh:mm:ss";
        } else if (formatString === "shortDate") {
            formatString = IS_LOCAL_DATE_FORMAT
                ? "Mon DD yyyy"
                : dateFormat === "ISO8601"
                ? "yyyy-MM-DD"
                : "DD Mon yyyy";
        } else if (!formatString) {
            if (dateFormat === "ISO8601") return date.toISOString();
            else if (dateFormat === "UTC") return date.toUTCString();
            formatString = "Mon DD yyyy, hh:mm:ss AM/PM";
        }

        let str = formatString,
            oneValue: any,
            MONTH_LONG = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (str.indexOf("yyyy") >= 0) {
            str = str.replace("yyyy", String(IS_LOCAL_DATE_FORMAT ? date.getFullYear() : date.getUTCFullYear()));
        }
        if (str.indexOf("Month") >= 0) {
            //getting month string by toLocaleString isn't supported by Safari
            //oneValue = date.toLocaleString("en-us", {month : "long"});
            oneValue = MONTH_LONG[IS_LOCAL_DATE_FORMAT ? date.getMonth() : date.getUTCMonth()];
            str = str.replace("Month", oneValue);
        }
        if (str.indexOf("Mon") >= 0) {
            oneValue = MONTH_SHORT[IS_LOCAL_DATE_FORMAT ? date.getMonth() : date.getUTCMonth()];
            str = str.replace("Mon", oneValue);
        }
        if (str.indexOf("MM") >= 0) {
            oneValue = (IS_LOCAL_DATE_FORMAT ? date.getMonth() : date.getUTCMonth()) + 1;
            str = str.replace("MM", oneValue < 10 ? "0" + oneValue : String(oneValue));
        }
        if (str.indexOf("ddd") >= 0) {
            oneValue = IS_LOCAL_DATE_FORMAT ? date.getDate() : date.getUTCDate();
            if (oneValue === 1 || oneValue === 21 || oneValue === 31) oneValue += "st";
            else if (oneValue === 2 || oneValue === 22) oneValue += "nd";
            else if (oneValue === 3 || oneValue === 23) oneValue += "rd";
            else oneValue += "th";
            str = str.replace("ddd", oneValue);
        }
        if (str.indexOf("DD") >= 0) {
            oneValue = IS_LOCAL_DATE_FORMAT ? date.getDate() : date.getUTCDate();
            str = str.replace("DD", oneValue < 10 ? "0" + oneValue : String(oneValue));
        }
        if (str.indexOf("hh") >= 0) {
            oneValue = IS_LOCAL_DATE_FORMAT ? date.getHours() : date.getUTCHours();
            if (str.indexOf("AM/PM") >= 0) {
                if (oneValue >= 12) {
                    str = str.replace("AM/PM", "PM");
                    if (oneValue > 12) oneValue -= 12;
                } else {
                    str = str.replace("AM/PM", "AM");
                }
            }
            str = str.replace("hh", oneValue < 10 ? "0" + oneValue : String(oneValue));
        }
        if (str.indexOf("mm") >= 0) {
            oneValue = IS_LOCAL_DATE_FORMAT ? date.getMinutes() : date.getUTCMinutes();
            str = str.replace("mm", String(oneValue < 10 ? "0" + oneValue : oneValue));
        }
        if (str.indexOf("ss") >= 0) {
            oneValue = IS_LOCAL_DATE_FORMAT ? date.getSeconds() : date.getUTCSeconds();
            str = str.replace("ss", String(oneValue < 10 ? "0" + oneValue : oneValue));
        }

        return str;
    }
}

const timeUtil = new TimeUtil();
export default timeUtil;
