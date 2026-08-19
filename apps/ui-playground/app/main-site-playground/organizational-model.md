# NIAGADS Resource Visualization Organizational Model

## Summary

The homepage visualization should distinguish core genomic concepts from contextual, evidence, and access concepts. The central visual field is reserved for genomic biology. Non-core concepts remain part of the ecosystem, but are placed in a peripheral frame with two visually distinct zones.

## Core Genomic Landscape

These concepts belong in the central biological/genomic landscape:

- Genes
- Variants
- Genomic regions
- Genetic associations
- Linkage disequilibrium
- Variant effects
- Molecular QTLs
- Regulatory elements

## Peripheral Context Zone

These concepts provide biological or clinical context and should not be drawn as genomic features:

- Tissues / cells
- Harmonized phenotypes

## Peripheral Evidence & Access Zone

These concepts describe evidence, delivery, or access affordances and should not be drawn as biological features:

- Curated evidence
- Downloads
- Programmatic / cloud access

## Terminology Changes

- `publications` becomes **Curated evidence**
- `phenotypes` becomes **Harmonized phenotypes**
- `datasets/files` becomes **Downloads**
- `programmatic` becomes **Programmatic / cloud access**
- The visual label **file set** should be dropped

## Interaction Model

- Hovering or focusing a resource highlights all mapped concepts across the genomic landscape and peripheral zones.
- Hovering or focusing a concept highlights all relevant resources.
- Connector lines remain hidden by default and appear only for the active hover/focus relationship.
- Unrelated resources and concepts recede but remain visible.

## Visual Structure

- Resources remain horizontally aligned across the top.
- The central genomic landscape stays visually dominant but compact.
- The peripheral zones should be lightweight groupings, not large dashboard panels.
- Context and Evidence & Access are visually segregated from the genomic layer and from each other.

## Original Prompt (for reference)

Build a new, focused prototype of only the NIAGADS homepage resource visualization component.

Do not create:

site navigation
page headers or hero copy
statistics
dashboard cards
explanatory panels
footer/content outside the visualization
generic marketing-page structure

The component must fit horizontally above the fold.

Across the top, show these resources as names/logos:

NIAGADS

DSS Portal
GenomicsDB
xQTL Browser
FILER
Open Access API

Partners

ADVP
PHC

Partner resources should be visually distinguishable but remain part of the same ecosystem.

Beneath the resources, create a coherent graphical representation of biological/data concepts, not a row of independent icon buttons.

Concepts include genes, variants, genomic regions, genetic associations, LD, variant effects, molecular QTLs, regulatory elements, tissues/cell types, publications, phenotypes, datasets/files, and programmatic access.

The biological layer should visually feel like an interconnected biological/genomic landscape or system. Explore stronger visual metaphors than circles connected by spaghetti arcs.

Interaction is bidirectional:

Hovering/focusing a resource highlights the biological concepts relevant to it.
Hovering/focusing a biological concept highlights all relevant resources.
Unrelated elements recede but remain visible.
Clicking a resource is reserved for navigation.

Preserve the resource-to-concept mappings from the existing prototype unless there is a clear reason to improve their representation. The mappings are currently defined in the CONCEPTS and RESOURCES arrays.

First develop 3 materially different visualization concepts. They must differ in information architecture and graphical metaphor, not just styling.

For each, briefly explain:

the visual metaphor,
how resource → concept highlighting works,
how concept → resource highlighting works,
why it works in a shallow horizontal homepage area.

Then choose the strongest concept and implement it as a standalone HTML/CSS/JavaScript prototype.

Prefer CSS/SVG for straightforward interaction. Use D3 only where it provides genuine value for geometry, layout, or interaction.

Keep the implementation compact and component-like so it can later be translated into React/Next.js.

The desired aesthetic is scientific, contemporary, restrained, and visually distinctive. Avoid generic AI-generated dashboard/card design.
