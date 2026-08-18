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
