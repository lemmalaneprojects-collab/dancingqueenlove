import { isToday, isYesterday, format } from "date-fns";

interface DateSeparatorProps {
  date: string;
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  const d = new Date(date);
  let label: string;

  if (isToday(d)) label = "Today";
  else if (isYesterday(d)) label = "Yesterday";
  else label = format(d, "MMMM d, yyyy");

  return (
    <div className="flex justify-center my-3">
      <span className="bg-muted/60 rounded-full px-3 py-1 text-[10px] font-display font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
