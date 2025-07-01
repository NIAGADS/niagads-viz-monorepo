export function InlineError({ message }: { message: string }) {
  return (
    <div className="inline-error">
      <p style={{ color: "#b91c1c" }}>{message}</p>
    </div>
  )
}

// Usage:
//{error.status === 500 && <InlineError message={error.detail} />}
