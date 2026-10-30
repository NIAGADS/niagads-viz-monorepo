## chat error alert

is ignoring the API response and asking for either emailing help or posting github. big problem, updated backend to give hint.
need (report-as).  Need to review this ASAP and fix.

```javascript
<ErrorAlert error={error}>
    <p>
        Please contact <a href="mailto:help@niagads.org">help@niagads.org</a> or{" "}
        <a
            href="https://github.com/NIAGADS/open-access-client/issues"
            target="_blank"
            rel="noopener noreferrer"
        >
            report an issue on GitHub
        </a>
        . Include the error details below and the request reference, if shown, so we can investigate.
    </p>
</ErrorAlert>
```
