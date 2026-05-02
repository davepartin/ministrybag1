import { AlertTriangle } from "lucide-react";
import { mainSafetyMessage } from "@/lib/utils/safety";

export function SafetyWarning({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-bold">Safety check</p>
          <p className="mt-1 text-sm">{mainSafetyMessage}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
