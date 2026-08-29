import { LineChart } from "react-native-gifted-charts";
import { colors } from "@/theme/colors";

interface WeightChartProps {
    data: Array<{ value: number; label: string }>;
}

// Renders body weight zoomed to its actual range via yAxisOffset — a
// 0-based axis would flatten realistic week-to-week variation into a
// visually flat line, defeating the point of a trend chart.
export function WeightChart({ data }: WeightChartProps) {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const offset = Math.max(0, Math.floor(min) - 1);
    const maxValue = Math.ceil(max) + 1 - offset;

    return (
        <LineChart
            data={data}
            color={colors.accentDark}
            thickness={2.5}
            curved
            dataPointsColor={colors.accentDark}
            dataPointsRadius={4}
            yAxisOffset={offset}
            maxValue={maxValue}
            noOfSections={4}
            overflowTop={20}
            rulesColor={colors.borderSoft}
            rulesType="solid"
            yAxisColor={colors.border}
            xAxisColor={colors.border}
            yAxisTextStyle={{ color: colors.textFaint, fontSize: 9 }}
            xAxisLabelTextStyle={{ color: colors.textFaint, fontSize: 9 }}
            yAxisLabelSuffix=" kg"
            showValuesAsDataPointsText
            textColor={colors.text}
            textFontSize={10}
            textShiftY={-10}
            height={130}
        />
    );
}