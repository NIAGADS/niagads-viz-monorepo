# IGVBrowserWithSelector Row Selection Discussion

## User Question

> when `handleTrackRemovedFromBrowser` gets called, I need to toggle the row selected state for the row in the selectortable that corresponds to the trackId (which is the rowId).  Can I do this without saving the selectorTable instance in the IGVBrowserWithSelector component

## Suggestions

### Option 1: Lift the Row Selection State (Recommended)

- Make the Table component controlled by lifting row selection state to IGVBrowserWithSelector.
- Pass rowSelection and onRowSelectionChange as props.
- You can then update selection state directly when tracks are removed.

### Option 2: Use a Ref to the Table Instance

- Pass a ref to the Table component that exposes just the methods you need.
- Store only the function(s) you need, not the whole instance.

### Option 3: Use the `onTableLoad` Callback Pattern (Minimal Change)

- Use Table's onTableLoad to extract and store just the toggleRowSelected function in a ref.
- Use this function to toggle row selection from IGVBrowserWithSelector.

### Option 4: Event-Based Communication

- Use a shared state management solution or event system.
- Likely overkill for this use case.

**Recommendation:** Option 1 is the cleanest and most React-like.

---

## Option 3: Using `onTableLoad` with a Ref (Detailed)

1. In IGVBrowserWithSelector, create a ref to store the toggle function:

   ```ts
   const toggleRowRef = useRef<((rowId: string, value?: boolean) => void) | null>(null);
   ```

2. In the Table's `onTableLoad`, extract and store the toggle function:

   ```ts
   const handleTableLoad = (table: any) => {
       toggleRowRef.current = (rowId: string, value?: boolean) => {
           table.getRow(rowId).toggleSelected(value);
       };
       if (selectorTable.options?.onTableLoad) {
           selectorTable.options.onTableLoad(table);
       }
   };
   ```

3. In `handleTrackRemovedFromBrowser`, use the stored function:

   ```ts
   if (toggleRowRef.current) {
       toggleRowRef.current(trackId, false);
   }
   ```

4. Pass your `handleTableLoad` to the Table's `options.onTableLoad` prop.

**Advantages:**

- Minimal changes
- Only stores the function needed
- Backward compatible

**Optional:** Add better TypeScript types for the toggle function.
