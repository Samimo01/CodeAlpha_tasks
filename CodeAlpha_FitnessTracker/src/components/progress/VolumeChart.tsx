import { LineChart } from "react-native-gifted-charts";
import { colors } from "@/theme/colors";

interface VolumeChartProps {
    data: Array<{ value: number; label: string }>;
}

// Renders training volume with a labeled, unit-suffixed axis and a value
// on each point — an axis-less line gave no way to read actual tonnage.
export function VolumeChart({ data }: VolumeChartProps) {
    return (
        <LineChart
            data={data}
            color={colors.accent}
            thickness={2.5}
            curved
            dataPointsColor={colors.accent}
            dataPointsRadius={4}
            noOfSections={4}
            overflowTop={20}
            rulesColor={colors.borderSoft}
            rulesType="solid"
            yAxisColor={colors.border}
            xAxisColor={colors.border}
            yAxisTextStyle={{ color: colors.textFaint, fontSize: 9 }}
            xAxisLabelTextStyle={{ color: colors.textFaint, fontSize: 9 }}
            yAxisLabelSuffix=" t"
            showValuesAsDataPointsText
            textColor={colors.text}
            textFontSize={10}
            textShiftY={-10}
            height={130}
        />
    );
}