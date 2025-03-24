import LocusZoom from "locuszoom";

import { CustomAssociationAdapter, CustomGeneAdapter, CustomRecombAdapter, CustomLDServerAdapter } from "./adapters";

import {
    standard_association_toolbar,
    standard_association_tooltip,
    standard_genes_tooltip,
    _ldColorScale,
    _ldLegend,
} from "./layouts";

export function initialize(selector, lzState, track, endpoint, width, genomeBuild) {
    // Register Adaptors
    LocusZoom.Adapters.add("NIAGADS_assoc", CustomAssociationAdapter, true); //override if exists
    LocusZoom.Adapters.add("NIAGADS_gene", CustomGeneAdapter, true);
    LocusZoom.Adapters.add("NIAGADS_recomb", CustomRecombAdapter, true);
    LocusZoom.Adapters.add("NIAGADS_ldserver", CustomLDServerAdapter, true);

    // set data sources
    const dataSources = new LocusZoom.DataSources();
    dataSources.add("assoc", ["NIAGADS_assoc", { url: endpoint, initial_state: lzState, track: track }]);
    dataSources.add("ld", ["NIAGADS_ldserver", { url: endpoint, initial_state: lzState }]);
    dataSources.add("gene", ["NIAGADS_gene", { url: endpoint, initial_state: lzState }]);
    dataSources.add("recomb", ["NIAGADS_recomb", { url: endpoint, initial_state: lzState }]);

    // LocusZoomshould ignore if build is GRCh38, will decide later if to host locally for GRCh37
    // see https://statgen.github.io/locuszoom/docs/api/data_adapters.js.html#line403
    dataSources.add("constraint", [
        "GeneConstraintLZ",
        { url: "https://gnomad.broadinstitute.org/api/", build: genomeBuild },
    ]);

    const layout = initializeLayout(lzState, width);

    return LocusZoom.populate(`#${selector}`, dataSources, layout);
}

const initializeLayout = (state, containerWidth) => {
    let layout = LocusZoom.Layouts.get("plot", "standard_association", {
        state: state,
        responsive_resize: true,
        min_region_scale: 20000,
        max_region_scale: 1000000,
        toolbar: standard_association_toolbar,
        panels: [
            LocusZoom.Layouts.get("panel", "association", {
                namespace: { assoc: "assoc" },
                height: 400,
                id: "association_panel", // Give each panel a unique ID
            }),
            LocusZoom.Layouts.get("panel", "genes", {
                height: 225,
            }),
        ],
    });

    // data layer customizations
    for (const [pindex, panel] of layout.panels.entries()) {
        if (panel.id == "association_panel") {
            for (const [dindex, dataLayer] of panel.data_layers.entries()) {
                if (dataLayer.id == "associationpvalues") {
                    layout.panels[pindex].data_layers[dindex].legend = _ldLegend;
                    layout.panels[pindex].data_layers[dindex].tooltip = standard_association_tooltip;
                }
            }
        }

        if (panel.id == "genes") {
            for (const [dindex, dataLayer] of panel.data_layers.entries()) {
                if (dataLayer.id == "genes") {
                    layout.panels[pindex].data_layers[dindex].tooltip = standard_genes_tooltip;
                }
            }
        }
    }

    return layout;
};
