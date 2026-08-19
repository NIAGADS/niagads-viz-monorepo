import {
    ResourceEcosystemViewer,
    type Resource,
    type ResourceGroup,
} from "./ResourceEcosystem";
import { RESOURCE_GROUPS, RESOURCES } from "./resources";

export default function MainSitePlayground() {
    return (
        <ResourceEcosystemViewer
            resourceGroups={RESOURCE_GROUPS as ResourceGroup[]}
            resources={RESOURCES as Resource[]}
        />
    );
}
