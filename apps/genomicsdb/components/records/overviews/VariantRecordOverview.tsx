import { Card, CardBody, CardHeader } from "@niagads/ui";
import { RecordOverview, renderRecordTitle } from "./RecordOverview";

import { VariantRecord } from "@/lib/types";
import { genomicLocationToSpan } from "@/lib/utils";
import styles from "../styles/record.module.css";
import variantStyles from "../styles/variant-record.module.css";

const VariantRecordOverview = (record: VariantRecord) => {
    console.log(record);
    const span = genomicLocationToSpan(record.location, false);

    return <RecordOverview>test</RecordOverview>;
};

export default VariantRecordOverview;
