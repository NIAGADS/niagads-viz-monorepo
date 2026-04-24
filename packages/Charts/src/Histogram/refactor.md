# Histogram Selection Refactor

## Goal

Refactor histogram selection so it is handled directly in D3 instead of through external React slider components.

Desired behavior:
- use one vertical handle for threshold selection
- use two vertical handles for range selection
- keep the approach generic enough to reuse for bar or line charts later

## Relevant Chat Log

User:
`find the histogram code in chart package`

Assistant:
Found the main files in:
- `packages/Charts/src/Histogram/Histogram.tsx`
- `packages/Charts/src/Histogram/histogramChart.ts`

User:
`I don't like how selection is handled and want to refactor`

User:
`instead of an external component I want to handle it directly in the d3. with one or two vertical handles depending on the type of selector.`

User:
`this is a selection method that could potential be used for any bar or line graph so think about how to implement as generic helper functions`

Assistant:
Confirmed understanding:
- move selection into the D3 layer
- replace external `Slider` / `RangeSlider`
- use one or two draggable vertical handles
- build reusable graph-selection helper logic

User:
`can you implement this the way I like - give me a very brief plan with discrete steps`

Assistant:
1. Extract the selection logic into generic D3 helper(s): scale-aware handle rendering, drag behavior, snapping, clamp rules, and selection callback state.
2. Add two selection modes to the helper: `threshold` with one vertical handle and `range` with two handles plus a shaded selected region.
3. Refactor `histogramChart.ts` to mount that overlay inside the SVG and drive bar highlighting directly from the D3 selection state.
4. Simplify `Histogram.tsx` so React just passes config and receives `onChange`; remove the external `Slider` / `RangeSlider`.
5. Keep the helper generic by making it operate on x-scale + plot bounds, so bar and line charts can reuse it later.
6. Verify behavior: drag, snapping to bin step, min/max constraints, overflow-bin edge case, and initial selection sync.

User:
`sounds good. let's start w/1-3`

Assistant:
Implemented steps 1 to 3 and verified `packages/Charts` builds successfully.

## Image

![Selection refactor concept](./selection-refactor-concept.png)

Source copy:
- `packages/Charts/src/Histogram/selection-refactor-concept.png`

## Code Changes Applied So Far

### New generic helper

Added:
- [selectionOverlay.ts](/home/allenem/projects/genomicsdb-ui/niagads-viz-monorepo/packages/Charts/src/d3/selectionOverlay.ts)

What it does:
- provides reusable D3 selection overlay behavior
- supports `range` mode with two handles
- supports `threshold` mode with one handle
- handles drag behavior, snapping, clamping, and callback updates
- renders a selected band plus draggable vertical handles

### Histogram D3 integration

Updated:
- [histogramChart.ts](/home/allenem/projects/genomicsdb-ui/niagads-viz-monorepo/packages/Charts/src/Histogram/histogramChart.ts)

What changed:
- `HistogramOptions` now accepts a `selection` config
- histogram can mount the generic selection overlay inside the SVG
- D3 selection changes now update highlighted bars directly
- selection overlay state is stored in histogram state for later updates
- `updateHistogramHighlight()` now syncs overlay position when a selected range is pushed in externally

### Histogram React wiring

Updated:
- [Histogram.tsx](/home/allenem/projects/genomicsdb-ui/niagads-viz-monorepo/packages/Charts/src/Histogram/Histogram.tsx)

What changed:
- `RangeSelectHistogram` now passes D3 selection config with `mode: "range"`
- `ThresholdSelectHistogram` now passes D3 selection config with `mode: "threshold"`
- threshold selection now initializes with a real starting range so the handle overlay mounts on first render

## What Is Still Not Done

- external `RangeSlider` is still rendered below `RangeSelectHistogram`
- external `Slider` is still rendered below `ThresholdSelectHistogram`
- `selectedLimit` is still part of threshold React state
- React state is still doing some synchronization work that should likely shrink after slider removal
- generic helper has only been integrated into histogram so far, not bar or line charts

## Next Steps

1. Remove the external `Slider` and `RangeSlider` from `Histogram.tsx`.
2. Simplify histogram React state so D3 is the primary selection UI and React just receives `onRangeSelect`.
3. Clean up threshold state so the current limit is derived from the selected range instead of maintained separately if possible.
4. Verify drag interactions visually:
   - range handles can cross or clamp as intended
   - threshold handle respects `min` vs `max` semantics
   - snapping matches histogram bin size
   - overflow bin behavior still feels correct
5. Decide whether the generic helper should expose optional styling/config hooks before reusing it in bar or line charts.

## Validation So Far

Ran:
- `npm run build` in `packages/Charts`

Result:
- build passed
- warning seen: `dts/PieChart/PieChart.d.ts` overwrites a previously emitted file of the same name
- no new build failure from the selection refactor changes

## Files Touched In This Refactor

- [Histogram.tsx](/home/allenem/projects/genomicsdb-ui/niagads-viz-monorepo/packages/Charts/src/Histogram/Histogram.tsx)
- [histogramChart.ts](/home/allenem/projects/genomicsdb-ui/niagads-viz-monorepo/packages/Charts/src/Histogram/histogramChart.ts)
- [selectionOverlay.ts](/home/allenem/projects/genomicsdb-ui/niagads-viz-monorepo/packages/Charts/src/d3/selectionOverlay.ts)
- [selection-refactor-concept.png](/home/allenem/projects/genomicsdb-ui/niagads-viz-monorepo/packages/Charts/src/Histogram/selection-refactor-concept.png)

