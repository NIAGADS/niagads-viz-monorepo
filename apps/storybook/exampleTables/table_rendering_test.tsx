import { TableProps as Table } from '@bug_sam/table'


export const TABLE_DEFINTION: Table = {
    id: 'rendering_test',
    data: [
        {
            label: { color: "blue", value: "r1" },
            population: "european",
            valid: true,
            count: 5,
            percent: 0.5,
            p_value: { value: 0.000001, color: 'red' },
            website: { url: "https://amazon.com", value: "Amazon" },
            state: { value: 'PASS', color: 'white', backgroundColor: 'green', icon: "solidCheck" }
        },
        {
            label: { value: "r2", tooltip: "my favorite group" },
            population: {
                value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis massa sed elementum tempus. Aenean sed adipiscing diam donec adipiscing tristique. Maecenas sed enim ut sem viverra aliquet.",
                color: 'purple'
            },
            valid: { value: false, color: 'green' },
            count: 6,
            p_value: { value: 0.0000510001, precision: 3 },
            percent: 0.2,
            website: null,
            state: { value: 'PASS', backgroundColor: 'green' }
        },
        {
            label: "r3",
            population: null,
            valid: null,
            count: 0,
            percent: { value: 0.9121335 },
            p_value: 0.0000999,
            website: { url: "https://google.com", tooltip: "google!" },
            state: null,
        },
        {
            label: "r4",
            valid: { value: true, icon: "solidCheck", color: "orange" },
            count: null,
            population: {
                color: "teal", value: "other",
                tooltip: "non-standard population"
            },
            percent: null,
            p_value: { value: .222, precision: 2 },
            website: { value: "FedEx" },
            state: { value: 'FAIL', icon: 'xMark', color: 'red', borderColor: 'red', tooltip: "This one did't pass :(" }
        },
    ],

    columns: [
        {
            header: "Label",
            id: "label"
        },
        {
            header: "State",
            id: "state",
            description: "badge test",
            type: "badge"
        },
        {
            header: "Population",
            id: "population",
            description: "sample population",
            format: {
                nullValue: "NA"
            }

        },
        {
            header: "Is Valid?",
            id: "valid",
            description: "boolean test",
            type: "boolean",
            format: { nullValue: 'NA', trueValue: "Yes" }
        },
        {
            header: "Count",
            id: "count",
            description: "integer test"
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
            }
        },
        {
            header: "Website",
            id: "website",
            // type: "link"
        }

    ],


}
