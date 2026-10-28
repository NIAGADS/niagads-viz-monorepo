import { Range, negLog10 } from "@niagads/common";
import { RangeSelectHistogram, ThresholdSelectHistogram } from "@niagads/charts";
import React, { useCallback, useMemo } from "react";

import { DEFAULT_NA_VALUE } from "../../../../types";
import { FilterColumn } from "./types";
import { NoValidValueAlert } from "./NoValidValueAlert";
import styles from "./column-filter.module.css";

export const NUMERIC_CELL_TYPES = ["float", "integer", "pvalue", "percentage_cell"];
const HISTOGRAM_DISPLAY_OPTS = {
    width: "100%",
    aspectRatio: 0.6,
} as const;

export const NumericFilter = ({ column }: FilterColumn) => {
    const naValue = column.columnDef.meta?.naValue || DEFAULT_NA_VALUE;
    const isPvalue = column.columnDef.meta!.type === "pvalue";
    const title = column.columnDef.header!.toString();

    const referenceData = useMemo(() => {
        const values = isPvalue
            ? (column.getAllValues(true, naValue) as number[]).map((v) => negLog10(v))
            : (column.getAllValues(true, naValue) as number[]);

        return {
            values,
            range:
                values.length > 0
                    ? {
                          min: Math.min(...values),
                          max: Math.max(...values),
                      }
                    : undefined,
        };
    }, [column, isPvalue, naValue]);

    if (!referenceData.range) {
        return <NoValidValueAlert columnName={title} />;
    }

    let filterValue: Range | number | undefined = column.getFilterValue() as Range | number | undefined;

    if (filterValue === undefined) {
        filterValue = isPvalue ? referenceData.range.min : referenceData.range;
    }

    const handleRangeFilter = useCallback(
        (range: Range) => {
            if (isPvalue) {
                const threshold = range.min;
                column.setFilterValue(threshold);
            } else {
                // TODO / FIXME: create a filterFn that takes a range
                column.setFilterValue(range);
            }
        },
        [column, isPvalue]
    );

    const filteredValues: number[] = isPvalue
        ? (column.getFilteredValues(true, naValue) as number[]).map((v) => negLog10(v))
        : (column.getFilteredValues(true, naValue) as number[]);

    if (isPvalue) {
        return (
            <ThresholdSelectHistogram
                limit={filterValue as number}
                limitType="max"
                onRangeSelect={handleRangeFilter}
                data={referenceData.values}
                overlayData={filteredValues}
                numBins={50}
                title={title}
                max={50}
                displayOpts={HISTOGRAM_DISPLAY_OPTS}
                yAxisScale="log10"
            />
        );
    }

    return (
        <RangeSelectHistogram
            range={filterValue as Range}
            onRangeSelect={handleRangeFilter}
            data={referenceData.values}
            numBins={50}
            title={title}
            overlayData={filteredValues}
            displayOpts={HISTOGRAM_DISPLAY_OPTS}
        />
    );
};
