import "../../examples/tables/custom_table_cell_styles.css";

import { TableProps as Table } from "@niagads/table";
import { getPvalueStyle } from "./styling_functions";

export const TABLE_DEFINTION: Table = {
    id: "rendering_test",
    columns: [
        {
            header: "Label",
            id: "label",
        },
        {
            header: "State",
            id: "state",
            description: "badge test",
            type: "badge",
        },
        {
            header: "Population",
            id: "population",
            description: "sample population",
        },
        {
            header: "Is Valid?",
            id: "valid",
            description: "boolean test",
            type: "boolean",
            format: { nullValue: "Not Applicable", trueValue: "Yes" },
        },
        {
            header: "Count",
            id: "count",
            description: "integer test",
        },
        {
            header: "Percent",
            id: "percent",
            description: "% bar test",
            type: "percentage_bar",
        },
        {
            header: "p-Value",
            id: "p_value",
            description: "numeric test",
            type: "p_value",
            format: {
                precision: 1,
            },
            styling: {
                getClassName: (pvalue: number) => "pvalue-badge",
                getStyle: getPvalueStyle,
            },
        },
        {
            header: "Website",
            id: "website",
            styling: { getClassName: (value: any) => "link-button" },
            // type: "link"
        },
    ],
    data: [
        {
            label: { className: "blue-text", value: "r1" },
            population: { value: "european", className: "badge-purple" },
            valid: true,
            count: { value: 5, className: "badge-purple" },
            percent: 0.5,
            p_value: { value: 0.000001, className: "red-text" },
            website: { url: "https://amazon.com", value: "Amazon" },
            state: {
                value: "PASS",
                className: "approval-badge",
                icon: "circleCheck",
            },
        },
        {
            label: { value: "r2", info: "my favorite group" },
            population: {
                value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis massa sed elementum tempus. Aenean sed adipiscing diam donec adipiscing tristique. Maecenas sed enim ut sem viverra aliquet.",
                className: "red-text",
            },
            valid: { value: false },
            count: 6,
            p_value: { value: 0.0000510001, precision: 3 },
            percent: 0.2,
            website: null,
            state: { value: "PASS" },
        },
        {
            label: "r3",
            population: null,
            valid: null,
            count: 0,
            percent: { value: 0.9121335 },
            p_value: 0.0000999,
            website: { url: "https://google.com", info: "google!" },
            state: null,
        },
        {
            label: "r4",
            valid: { value: true, icon: "circleCheck", style: { color: "orange" } },
            count: null,
            population: {
                value: "other",
                info: "non-standard population",
            },
            percent: null,
            p_value: { value: 0.222, precision: 2 },
            website: { value: "FedEx" },
            state: {
                value: "FAIL",
                icon: "warning",
                className: "failure-badge",
                info: "This one did't pass :(",
            },
        },
    ],
};
