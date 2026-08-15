export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F2] p-10">
      <h1 className="font-serif text-4xl text-[#B9897D]">
        NORSEEN COSMATICS
      </h1>

      <p className="mt-2 text-xl">
        Merchant Dashboard
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="mt-2 text-2xl font-bold">0 EGP</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Products</p>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Net Profit</p>
          <p className="mt-2 text-2xl font-bold">0 EGP</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">
          Welcome to Norseen Admin
        </h2>

        <p className="mt-2 text-gray-500">
          Products, orders, inventory, shipping and analytics will appear here.
        </p>
      </div>
    </main>
  );
}
