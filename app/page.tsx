"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3034";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
};

const empty = { name: "", description: "", price: "", stock: "0" };

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const load = () => setVersion((v) => v + 1);

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setError("");
      })
      .catch((e: Error) =>
        setError(`Cannot reach API at ${API}: ${e.message}`),
      );
  }, [version]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    const res = await fetch(
      editingId ? `${API}/products/${editingId}` : `${API}/products`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError([data?.message ?? `HTTP ${res.status}`].flat().join(", "));
      return;
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    load();
  }

  function edit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      stock: String(p.stock),
    });
  }

  const input =
    "rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-8 font-sans">
      <h1 className="mb-6 text-2xl font-semibold">Products</h1>

      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</p>
      )}

      <form onSubmit={submit} className="mb-8 grid gap-3 sm:grid-cols-2">
        <input
          className={input}
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={input}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className={input}
          placeholder="Price"
          type="number"
          step="0.01"
          min="0"
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className={input}
          placeholder="Stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <div className="flex gap-2">
          <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-zinc-500">
                {p.description} · ${p.price} · stock {p.stock}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => edit(p)}>Edit</button>
              <button className="text-red-600" onClick={() => remove(p.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {products.length === 0 && !error && (
          <li className="py-3 text-zinc-500">No products yet.</li>
        )}
      </ul>
    </main>
  );
}
