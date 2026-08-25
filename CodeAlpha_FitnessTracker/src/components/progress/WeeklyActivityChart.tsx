import { BarChart } from "react-native-gifted-charts";
import { colors } from "@/theme/colors";

// Renders weekly workout counts for the progress dashboard.
export function WeeklyActivityChart({ data }: { data: Array<{ value: number; label: string }> }) {
    return (
        <BarChart
            data={data}
            barBorderTopLeftRadius={5}
            barBorderTopRightRadius={5}
            barWidth={26}
            frontColor={colors.accent}
            hideRules
            yAxisTextStyle={{ color: colors.textFaint }}
            xAxisLabelTextStyle={{ color: colors.textFaint }}
            height={120}
            hideYAxisText
        />
    )
}
