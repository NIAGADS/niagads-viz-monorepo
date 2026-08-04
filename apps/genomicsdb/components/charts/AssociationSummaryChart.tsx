import { GeneticAssociationStackedBarChart } from "@niagads/charts";
import { RecordType } from "@/lib/types";
import { LoadingSpinner } from "@niagads/ui";
import useSWR from "swr";

interface AssociationSummaryChartProps {
    recordId: string;
    recordType: RecordType;
}

const AssociationSummaryChart = ({ recordId, recordType }: AssociationSummaryChartProps) => {
    const { data, error, isLoading } = useSWR(buildChartUrl(recordId, recordType), (url: string) =>
        fetch(url).then((res) => res.json())
    );

    return isLoading ? (
        <LoadingSpinner />
    ) : error ? (
        <div>Error loading chart</div>
    ) : (
        <div className="flex" style={{ height: "100%", width: "100%" }}>
            <GeneticAssociationStackedBarChart
                data={data}
                displayOpts={{ width: 900, margin: { top: 18, right: 72, bottom: 18, left: 180 } }}
            />
        </div>
    );
};

const buildChartUrl = (recordId: string, recordType: RecordType) => {
    const base_url = `/api-proxy/record/${recordType}/${recordId}/associations`;
    return `${base_url}?content=counts&source=GWAS`;
};

export default AssociationSummaryChart;
