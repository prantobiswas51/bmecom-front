import Link from "next/link";
import { Price } from "../../components/Price";
import { imageUrl } from "../../lib/catalog";
import { orderDate, STATUS, type OrderSummary } from "../../lib/orders";

export function StatusBadge({ status }: { status: OrderSummary["status"] }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS[status].tone}`}>{STATUS[status].label}</span>;
}

/** One order in a list; the whole row opens the order. */
export function OrderRow({ order }: { order: OrderSummary }) {
  return (
    <li>
      <Link href={`/account/orders/${order.orderNumber}`} className="flex flex-wrap items-center gap-x-5 gap-y-3 p-4 transition hover:bg-soft sm:p-5">
        <div className="flex -space-x-3">
          {order.images.length === 0 && <span className="h-12 w-12 rounded-[var(--radius-btn)] border border-line bg-soft" />}
          {order.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host
            <img key={i} src={imageUrl(src)} alt="" className="h-12 w-12 rounded-[var(--radius-btn)] border-2 border-white object-cover" />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-brand">{order.orderNumber}</p>
          <p className="text-sm text-muted">
            {orderDate(order.createdAt)} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
          </p>
        </div>
        <StatusBadge status={order.status} />
        <p className="w-24 text-right font-extrabold text-brand">
          <Price value={order.total} />
        </p>
      </Link>
    </li>
  );
}
