# TODOs and FIXMEs

## Group, long-term TODOS

* Assess accessibility
  
> See Card.tsx and Button.tsx in UI for how example of how to allow aria-* and role to be passed to a custom component

* how to handle fonts UI/application

* predicted consequece coloring in report overviews and tables: <https://useast.ensembl.org/info/genome/variation/prediction/predicted_data.html>

## Zile - in order of priority

* Record Table in tabbed-sections are not fitting to enclosing div, no scrolling on x-overflow, instead div (Card?) is growing.  

* `Sidebar`

We redesigned the sidebar, removing all states and hooks to allow pages to render server side.  We can reassess when we have more time.
This breaks: collapsing, keeping current state.

Also with previous design users had to click on every section which could be problematic for sparsely annotated records.

We need some quick fixes: sidebar height, sidebar sticky, navigation offset when jumping to anchors & anything else that catches your eye

* Most Severe Variant Consequence Card for variants: check it out & improve

  * `/record/variant/1:241765187:GA:G` for multiple consequence terms
  * `/record/variant/rs429358` another example

* @niagads/Table TableExportControl form formatting

* UI Tooltip styling: wrap long ones to max of two lines and give a max-width (see one over ADSP badge in variant overview for a long tooltip)

## Emily

* create genomicsdb issue tracking project on github and update sample.env.local

* is_error_response did not catch: the fast API validation error - need to wrap these

* colocated variants in genetic variation section?

```json
{
  type: "enum",
  loc: [
    "query",
    "source",
  ],
  msg: "Input should be 'GWAS', 'CURATED' or 'ALL'",
  input: "GWASview=table",
  ctx: {
    expected: "'GWAS', 'CURATED' or 'ALL'",
  },
}
```

