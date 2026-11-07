export default function TypingIndicator() {
  return (
    <div className="flex gap-1 p-3 w-fit rounded-2xl bg-slate-200 dark:bg-slate-700">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}