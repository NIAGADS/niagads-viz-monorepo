# Resource detail persistence patch

## Purpose

Keep the resource description card selected until the user activates a different resource. Moving the pointer away from a resource button or losing keyboard focus must not restore the overview card, because that makes it impossible to move from the resource list to the description card or its action.

## Expected behavior

- The overview card is shown initially.
- Hovering, focusing, tapping, or clicking a resource updates the description card.
- Leaving the resource button clears only the temporary visualization highlighting.
- The selected description remains unchanged after blur or mouse leave.
- Hovering, focusing, tapping, or clicking another resource replaces the selected description.
- Pressing outside a resource button or the detail card returns the card to the overview.
- Hovering or pointing at an interactive concept in the SVG returns the card to the overview.
- The resource action remains available from the selected description card.

## Implementation

In `apps/ui-playground/app/main-site-playground/ResourceEcosystemViewer.tsx`:

1. Keep `detailResourceId` as the persistent description selection.
2. Use a single `selectResource(resourceId)` helper from `onFocus`, `onMouseEnter`, and `onPointerDown` on each resource button.
3. Do not clear `detailResourceId` from `onBlur` or `onMouseLeave`.
4. Let `onBlur` and `onMouseLeave` call only `setActive(null)` so connector highlighting remains transient.
5. Remove the old hide timer and any detail-card mouse-leave dismissal logic.
6. Add a shell-level pointer handler that clears both `detailResourceId` and `active` unless the event target is inside a resource button or the detail card.
7. Add an SVG pointer-over handler that clears `detailResourceId` when the target is inside an interactive concept.

## Reapplying on another branch

Port the resource-button handler changes and the removal of the detail hide timer from the viewer component. Preserve the distinction between:

- `active`: transient visual highlighting for connectors and concept relationships.
- `detailResourceId`: persistent resource description selection.

Do not reintroduce a handler that sets `detailResourceId` to `null` on resource blur, resource mouse leave, or detail-card mouse leave.
