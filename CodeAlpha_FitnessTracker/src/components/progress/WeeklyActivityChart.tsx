import { BarChart } from "react-native-gifted-charts";
import { colors } from "@/theme/colors";

interface WeeklyActivityChartProps {
    data: Array<{ value: number; label: string }>;
}

// Renders weekly workout counts with a visible scale and a value label on
// each bar — the previous version hid both the axis and the numbers.
export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value), 1) + 1;
    const sections = Math.min(maxValue, 6);

    return (
        <BarChart
            data={data}
            barBorderTopLeftRadius={5}
            barBorderTopRightRadius={5}
            barWidth={26}
            frontColor={colors.accent}
            maxValue={maxValue}
            noOfSections={sections}
            rulesColor={colors.borderSoft}
            rulesType="solid"
            yAxisColor={colors.border}
            xAxisColor={colors.border}
            yAxisTextStyle={{ color: colors.textFaint, fontSize: 9 }}
            xAxisLabelTextStyle={{ color: colors.textFaint, fontSize: 9 }}
            showValuesAsTopLabel
            topLabelTextStyle={{ color: colors.text, fontSize: 10, fontWeight: "700" }}
            height={130}
        />
    );
}