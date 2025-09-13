interface ResultCardProps {
  title: string;
  amount: string;
  variant?: "primary" | "secondary";
  description?: string;
}

export function ResultCard({
  title,
  amount,
  variant = "secondary",
  description,
}: ResultCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`
        rounded-xl p-4 shadow-sm
        ${
          isPrimary
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            : "bg-white border border-gray-200"
        }
      `}
    >
      <p
        className={`text-sm font-medium ${
          isPrimary ? "text-blue-100" : "text-gray-600"
        }`}
      >
        {title}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${
          isPrimary ? "text-white" : "text-gray-900"
        }`}
      >
        {amount}
      </p>
      {description && (
        <p
          className={`mt-1 text-xs ${
            isPrimary ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
