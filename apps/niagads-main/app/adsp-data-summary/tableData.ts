import { TableConfig } from "@niagads/table"

export const TABLE: TableConfig = {
    id: "sequence_data_releases",
    columns: [
        {
            id: "phase",
            header: "Phase",
        },
        {
            id: "data_type",
            header: "Data Type",
        },
        {
            id: "what_is_available",
            header: "What is Available",
        },
        {
            id: "release_timeline",
            header: "Release Timeline",
        },
        {
            id: "diagnosis",
            header: "Diagnosis",
        },
        {
            id: "age",
            header: "Age",
        },
        {
            id: "neuropathology",
            header: "Neuropathology",
        },
        {
            id: "cognition",
            header: "Cognition",
        },
        {
            id: "fluid_biomarker",
            header: "Fluid Biomarker",
        },
        {
            id: "vascular_risk_factors",
            header: "Vascular Risk Factors",
        },
        {
            id: "neuroimaging",
            header: "Neuroimaging",
        },
    ],
    data: [
        {
            phase: "R1",
            data_type: "WGS",
            what_is_available: "4788 samples",
            release_timeline: "Released February 2020",
            diagnosis: "basic",
            age: "basic",
            neuropathology: "Select cohorts",
            cognition: "Select cohorts",
            fluid_biomarker: "Select cohorts",
            vascular_risk_factors: "Select cohorts",
            neuroimaging: "Select cohorts",
        },
        {
            phase: "R2",
            data_type: "WES",
            what_is_available: "20,503 samples",
            release_timeline: "Released February 2021",
            diagnosis: "basic",
            age: "basic",
            neuropathology: "Select cohorts",
            cognition: "Select cohorts",
            fluid_biomarker: "Select cohorts",
            vascular_risk_factors: "Select cohorts",
            neuroimaging: "Select cohorts",
        },
        {
            phase: "R3",
            data_type: "WGS",
            what_is_available: "16,905 samples",
            release_timeline: "Released October 2022",
            diagnosis: "basic",
            age: "basic",
            neuropathology: "Select cohorts",
            cognition: "Select cohorts",
            fluid_biomarker: "Select cohorts",
            vascular_risk_factors: "Select cohorts",
            neuroimaging: "Select cohorts",
        },
        {
            phase: "R4",
            data_type: "WGS",
            what_is_available: "36,361 samples",
            release_timeline: "Released November 2024",
            diagnosis: "basic",
            age: "basic",
            neuropathology: "Select cohorts",
            cognition: "Select cohorts",
            fluid_biomarker: "Select cohorts",
            vascular_risk_factors: "Select cohorts",
            neuroimaging: "Select cohorts",
        },
        {
            phase: "R5",
            data_type: "WGS",
            what_is_available: "58,507 samples",
            release_timeline: "Released July 2018",
            diagnosis: "basic",
            age: "basic",
            neuropathology: "Select cohorts",
            cognition: "Select cohorts",
            fluid_biomarker: "Select cohorts",
            vascular_risk_factors: "Select cohorts",
            neuroimaging: "Select cohorts",
        },
    ]
} 