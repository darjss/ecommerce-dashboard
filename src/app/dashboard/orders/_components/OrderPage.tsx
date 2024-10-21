import CreateOrder from "./CreateOrder"
import { OrderDetails } from "./OrderDetails"
import { OrderSummary } from "./OrderSummary"
import { RecentOrders } from "./RecentOrders"

export function OrderPage() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max gap-4 md:gap-8 lg:col-span-2">
        <OrderSummary />
        <RecentOrders />
      </div>
      <div>
        <CreateOrder />
        <OrderDetails />
      </div>
    </div>
  )
}