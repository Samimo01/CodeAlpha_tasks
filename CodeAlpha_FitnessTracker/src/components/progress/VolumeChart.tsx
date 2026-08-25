import { LineChart } from "react-native-gifted-charts";
import { colors } from "@/theme/colors";

// Renders the user's training volume as a compact chart.
export function VolumeChart({ data }: { data: Array<{ value: number; label: string }> }) {
    return (
        <LineChart
            data={data}
            color={colors.accent}
            dataPointsColor={colors.accent}
            hideRules
            yAxisTextStyle={{ color: colors.textFaint }}
            xAxisLabelTextStyle={{ color: colors.textFaint }}
            height={120}
            hideYAxisText
        />
    )
}