"use client";

import { useActionState, useState } from "react";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import type { Address } from "../../lib/address";
import { deleteAddressAction, makeDefaultAction, saveAddressAction, type AddressState } from "../addresses/actions";

const initial: AddressState = {};
const panel = "rounded-[var(--radius-card)] border border-line bg-white p-5";

/** Add form, or edit form when `address` is given. Closes itself once saved. */
function AddressForm({ address, onClose, first }: { address?: Address; onClose: () => void; first?: boolean }) {
  const [state, action, pending] = useActionState(
    async (prev: AddressState, data: FormData) => {
      const next = await saveAddressAction(address?.id ?? null, prev, data);
      if (next.done) onClose();
      return next;
    },
    initial,
  );
  const v = state.values ?? { label: address?.label ?? "", fullName: address?.fullName ?? "", phone: address?.phone ?? "", address: address?.address ?? "" };

  return (
    <form action={action} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <Field label="Label (optional)" name="label" maxLength={30} placeholder="Home, Office..." defaultValue={v.label} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *" name="fullName" autoComplete="name" required maxLength={100} defaultValue={v.fullName} />
        <Field label="Mobile *" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="01712345678" defaultValue={v.phone} />
      </div>
      <Field label="Address *" name="address" autoComplete="street-address" required maxLength={500} placeholder="House, road, area" defaultValue={v.address} />
      {!address?.isDefault && !first && (
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="isDefault" /> Make this my default address
        </label>
      )}
      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save address"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AddressCard({ address }: { address: Address }) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <li className={panel}>
        <AddressForm address={address} onClose={() => setEditing(false)} />
      </li>
    );
  }
  return (
    <li className={`${panel} flex flex-col`}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold text-brand">{address.label || "Address"}</p>
        {address.isDefault && <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-bold text-success">Default</span>}
      </div>
      <div className="mt-3 flex-1 text-sm">
        <p className="font-semibold text-ink">{address.fullName}</p>
        <p className="text-ink">{address.address}</p>
        <p className="mt-1 text-muted">{address.phone}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-sm font-semibold">
        <button type="button" onClick={() => setEditing(true)} className="text-brand hover:underline">
          Edit
        </button>
        {!address.isDefault && (
          <form action={makeDefaultAction.bind(null, address.id)}>
            <button type="submit" className="text-brand hover:underline">
              Make default
            </button>
          </form>
        )}
        <form
          action={deleteAddressAction.bind(null, address.id)}
          onSubmit={(e) => {
            if (!confirm("Delete this address?")) e.preventDefault();
          }}
        >
          <button type="submit" className="text-danger hover:underline">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}

export function AddressBook({ addresses }: { addresses: Address[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {addresses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <AddressCard key={a.id} address={a} />
          ))}
        </ul>
      )}

      {adding ? (
        <div className={panel}>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-faint">New address</h2>
          <AddressForm onClose={() => setAdding(false)} first={addresses.length === 0} />
        </div>
      ) : (
        <>
          {addresses.length === 0 && <p className={`${panel} py-10 text-center text-muted`}>You have not saved an address yet.</p>}
          {addresses.length < 10 && (
            <Button type="button" variant="outline" onClick={() => setAdding(true)}>
              + Add a new address
            </Button>
          )}
        </>
      )}
    </div>
  );
}
