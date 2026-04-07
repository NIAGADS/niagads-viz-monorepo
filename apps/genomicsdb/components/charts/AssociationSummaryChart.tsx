import { APIResponse, getUrlParam } from "@niagads/common";

import { BarChart } from "@niagads/charts";
import { BaseRecord } from "@/lib/types";
import { LoadingSpinner } from "@niagads/ui";
import useSWR from "swr";

interface AssociationSummaryChartProps {
    record: BaseRecord;
    endpoint: string;
}

const AssociationSummaryChart = ({ record, endpoint }: AssociationSummaryChartProps) => {
    const { data, error, isLoading } = useSWR(buildChartUrl(record, endpoint), (url: string) =>
        fetch(url).then((res) => res.json())
    );

    return isLoading ? (
        <LoadingSpinner />
    ) : error ? (
        <div>Error loading chart</div>
    ) : (
        <div className="flex" style={{ height: "100%", width: "100%" }}>
            <BarChart id={"test"} data={transformData(data)} keys={["upstream", "downstream", "in gene"]} />
        </div>
    );
};

const buildChartUrl = (record: BaseRecord, tableUrl: string) => {
    const base_url = `/api-proxy/record/${record.record_type}/${record.id}/associations`;

    const trait = getUrlParam(tableUrl, "trait")!;
    const source = getUrlParam(tableUrl, "source")!;

    return `${base_url}?content=counts&trait=${trait}&source=${source}`;
};

const transformData = (response: APIResponse): Record<string, any>[] => {
    return response.data.map((rawData: any) => ({
        term: rawData.trait.term,
        ...rawData.num_variants,
    }));
};

export default AssociationSummaryChart;
