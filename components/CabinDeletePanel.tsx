"use client";

import { useId, useMemo, useState } from "react";

type CabinDeletePanelProps = {
  cabinId: string;
  cabinName: string;
};

export default function CabinDeletePanel({
  cabinId,
  cabinName,
}: CabinDeletePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedName, setTypedName] = useState("");
  const inputId = useId();
  const isMatch = useMemo(
    () => typedName.trim() === cabinName.trim(),
    [typedName, cabinName]
  );

  return (
    <>
      <section className="mt-10 rounded-[2rem] border border-rose-200 bg-[linear-gradient(180deg,rgba(255,245,245,0.96),rgba(255,236,236,0.92))] p-7 shadow-[0_24px_60px_rgba(120,32,32,0.08)]">
        <p className="eyebrow text-rose-700">Danger zone</p>
        <h2 className="font-heading mt-3 text-3xl font-semibold text-rose-900">
          Delete this cabin
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-rose-900/80">
          This permanently removes the cabin listing, its gallery, and its
          public detail page. To avoid accidental deletion, you will need to
          confirm the exact cabin name before continuing.
        </p>
        <button
          type="button"
          onClick={() => {
            setTypedName("");
            setIsOpen(true);
          }}
          className="mt-6 rounded-full bg-rose-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Delete cabin
        </button>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-[rgba(17,12,12,0.7)] px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border border-rose-200 bg-white p-7 shadow-[0_24px_70px_rgba(33,18,18,0.28)]">
            <p className="eyebrow text-rose-700">Delete confirmation</p>
            <h3 className="font-heading mt-3 text-3xl font-semibold text-rose-900">
              Are you sure?
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              Type the cabin name exactly as shown below to confirm deletion.
            </p>
            <div className="mt-5 rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-900">
              {cabinName}
            </div>

            <form
              action={`/api/cabins/${cabinId}/delete`}
              method="POST"
              className="mt-5 space-y-5"
            >
              <div>
                <label
                  htmlFor={inputId}
                  className="block text-sm font-semibold text-stone-700"
                >
                  Type cabin name to confirm
                </label>
                <input
                  id={inputId}
                  name="confirmationName"
                  value={typedName}
                  onChange={(event) => setTypedName(event.target.value)}
                  autoComplete="off"
                  className="mt-2 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
                {!isMatch && typedName.length > 0 ? (
                  <p className="mt-2 text-sm text-rose-700">
                    The name must match exactly before you can delete this cabin.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isMatch}
                  className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-rose-300"
                >
                  Permanently delete
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
