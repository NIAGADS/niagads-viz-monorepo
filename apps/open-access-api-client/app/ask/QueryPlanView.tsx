import ErrorAlert from "./ErrorAlert";
import { parseQueryPlan, type QueryPlan } from "./planning";

export default function QueryPlanView({ value }: { value: unknown }) {
    let plan: QueryPlan;
    try {
        plan = parseQueryPlan(value);
    } catch (error) {
        return <ErrorAlert error={error instanceof Error ? error : new Error(String(error))} />;
    }
    return (
        <details>
            <summary>Interpreted query plan</summary>
            <p>This describes the interpreted request, not retrieved evidence.</p>
            {plan.exclusions.length > 0 && <p>Exclusions are not implemented and have not been applied.</p>}
            <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(plan, null, 2)}</pre>
        </details>
    );
}
