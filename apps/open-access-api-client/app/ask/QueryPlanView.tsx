import { errorMessage } from "./errors";
import { parseQueryPlan, type QueryPlan } from "./planning";

export default function QueryPlanView({ value }: { value: unknown }) {
    let plan: QueryPlan;
    try {
        plan = parseQueryPlan(value);
    } catch (error) {
        return (
            <p role="alert">
                Invalid request interpretation: {error instanceof Error ? errorMessage(error) : String(error)}
            </p>
        );
    }
    return (
        <details>
            <summary>Request interpretation</summary>
            <p>This describes the goal and constraints. Actions are chosen from retrieved evidence.</p>
            {plan.exclusions.length > 0 && <p>Exclusions are not implemented and have not been applied.</p>}
            <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(plan, null, 2)}</pre>
        </details>
    );
}
