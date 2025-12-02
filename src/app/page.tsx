import { getDailySummary } from "./actions"

export default async function Home() {
  const today = new Date()
  const summary = await getDailySummary(today)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Collections Today</h3>
            <p className="text-4xl font-bold text-blue-600">{summary.totalCollections}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Quantity (L)</h3>
            <p className="text-4xl font-bold text-green-600">{summary.totalQuantity.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Amount (₹)</h3>
            <p className="text-4xl font-bold text-purple-600">₹{summary.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Collections</h2>
          {summary.collections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No collections recorded today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Farmer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Shift</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty (L)</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">FAT</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.collections.map((collection) => (
                    <tr key={collection.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="py-3 px-4">{collection.farmer.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${collection.shift === 'MORNING' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'
                          }`}>
                          {collection.shift}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">{collection.quantity.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{collection.fat.toFixed(1)}</td>
                      <td className="text-right py-3 px-4">₹{collection.rate.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-green-600">₹{collection.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
