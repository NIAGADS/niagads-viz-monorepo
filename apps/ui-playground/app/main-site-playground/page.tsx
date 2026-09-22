import { ResourceEcosystemViewer, type Resource, type ResourceGroup } from "./ResourceEcosystemViewer";
import { RESOURCE_ECOSYSTEM_OVERVIEW, RESOURCE_GROUPS, RESOURCES } from "./resources";

export default function MainSitePlayground() {
    return (
        <ResourceEcosystemViewer
            overview={RESOURCE_ECOSYSTEM_OVERVIEW}
            resourceGroups={RESOURCE_GROUPS as ResourceGroup[]}
            resources={RESOURCES as Resource[]}
        />
    );
}
