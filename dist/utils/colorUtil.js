class ColorUtil {
    shadeColor(color, percent) {
        color = this.standardColor(color);
        const rate = 1 + percent / 100;
        const R = parseInt(color.substring(1, 3), 16) * rate, G = parseInt(color.substring(3, 5), 16) * rate, B = parseInt(color.substring(5, 7), 16) * rate;
        const RS = Math.round(Math.min(R, 255)).toString(16), GS = Math.round(Math.min(G, 255)).toString(16), BS = Math.round(Math.min(B, 255)).toString(16);
        return ("#" + (RS.length == 1 ? "0" + RS : RS) + (GS.length == 1 ? "0" + GS : GS) + (BS.length == 1 ? "0" + BS : BS));
    }
    standardColor(color) {
        color = String(color || "")
            .trim()
            .toUpperCase();
        if (/^#[\dABCDEF]{6}$/.test(color))
            return color;
        else if (/^[\dABCDEF]{6}$/.test(color))
            return "#" + color;
        else if (/^#[\dABCDEF]{3}$/.test(color)) {
            return "#" + color.charAt(1).repeat(2) + color.charAt(2).repeat(2) + color.charAt(3).repeat(2);
        }
        else if (/^[\dABCDEF]{3}$/.test(color)) {
            return this.standardColor("#" + color);
        }
        else
            return color;
    }
}
const colorUtil = new ColorUtil();
export default colorUtil;
