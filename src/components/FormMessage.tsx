import type { FormState } from "@/app/actions/shared";

export function FormMessage({ state }: { state: FormState }) {
  if (!state?.message) return null;
  return (
    <p role="status" className={`mt-2 text-sm ${state.ok ? "" : "font-semibold text-red-700"}`}>
      {state.message}
    </p>
  );
}
