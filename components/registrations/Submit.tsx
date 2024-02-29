"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton(props: { className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={props.className ?? ""}
    >
      Submit
    </button>
  );
}
