import { LineChart } from "react-native-gifted-charts";
import { colors } from "@/theme/colors";

// Renders body-weight measurements across their recorded dates.
export function WeightChart({ data }: { data: Array<{ value: number; label: string }> }) {
    return (
        <LineChart
            data={data}
            color={colors.accentDark}
            dataPointsColor={colors.accentDark}
            hideRules
            yAxisTextStyle={{ color: colors.textFaint }}
            xAxisLabelTextStyle={{ color: colors.textFaint }}
            height={120}
            hideYAxisText
        />
    )
}
