// Types and helpers for saved addresses that are safe to import from client components.

export type Address = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

/** What checkout fills in for a signed-in shopper: the name, mobile and address of one saved address. */
export type Defaults = { name: string; phone: string; address: string };

/** With no saved address, the account name alone is still filled in. */
export const toDefaults = (a: Address | undefined, accountName?: string | null): Defaults | undefined =>
  a ? { name: a.fullName, phone: a.phone, address: a.address } : accountName ? { name: accountName, phone: "", address: "" } : undefined;
