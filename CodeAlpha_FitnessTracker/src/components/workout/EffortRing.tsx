import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { fmtTimer } from "@/utils/format";

// Visualizes elapsed workout time as a circular effort indicator.
export function EffortRing({ seconds }: { seconds: number }) {
    const r = 46, c = 2 * Math.PI * r, p = Math.min(seconds / (75 * 60), 1);

    return (
        <Svg width={112} height={112}>
            <Circle cx={56} cy={56} r={r} fill="none" stroke={colors.surfaceAlt} strokeWidth={7} />
            <Circle cx={56} cy={56} r={r} fill="none" stroke={colors.accent} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${c} ${c}`} strokeDashoffset={c * (1 - p)} transform="rotate(-90 56 56)" />
            <SvgText x={56} y={61} textAnchor="middle" fontFamily={typography.numeric.fontFamily} fontSize={18} fontWeight={typography.numeric.fontWeight} fill={colors.text}>{fmtTimer(seconds)}</SvgText>
        </Svg>
    )
}
