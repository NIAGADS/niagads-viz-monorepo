# TODOs and FIXMEs

## `/components/sidebar`

Commented out sidebar navigation button b/c it doesn't work and it hides the whole side bar, including the navigation.
This is an effect of removing the client side-states at the page level.

Review whether media queries are sufficient or if we want to reinstate this.  Will it work w/new record/layout.tsx?

## action button css

resolve action-button.css and record.css

## create genomicsdb issue tracking project on github and update sample.env.local

## is_error_response did not catch: the fast API validation error - need to wrap these

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