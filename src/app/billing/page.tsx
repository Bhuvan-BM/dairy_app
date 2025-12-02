"use client"

import { getFarmerBill, getFarmers } from "@/app/actions"
import { useEffect, useState } from "react"

type Farmer = {
    id: number
    code: string
    name: string
}

type Collection = {
    id: number
    date: Date
    shift: string
    quantity: number
    fat: number
    rate: number
    amount: number
}

type BillSummary = {
    totalQuantity: number
    totalAmount: number
    collections: Collection[]
}

export default function BillingPage() {
    const [farmers, setFarmers] = useState<Farmer[]>([])
    const [selectedFarmer, setSelectedFarmer] = useState<number>(0)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [billSummary, setBillSummary] = useState<BillSummary | null>(null)

    useEffect(() => {
        loadFarmers()
        // Set default dates (first and last day of current month)
        const date = new Date()
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        setStartDate(firstDay.toISOString().split('T')[0])
        setEndDate(lastDay.toISOString().split('T')[0])
    }, [])

    async function loadFarmers() {
        const data = await getFarmers()
        setFarmers(data)
    }

    async function handleGenerateBill() {
        if (!selectedFarmer || !startDate || !endDate) {
            alert("Please select a farmer and date range")
            return
        }

        const summary = await getFarmerBill(selectedFarmer, new Date(startDate), new Date(endDate))
        setBillSummary(summary)
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Generate Bill</h1>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Farmer
                            </label>
                            <select
                                value={selectedFarmer}
                                onChange={(e) => setSelectedFarmer(parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={0}>Select Farmer</option>
                                {farmers.map((farmer) => (
                                    <option key={farmer.id} value={farmer.id}>
                                        {farmer.code} - {farmer.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleGenerateBill}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors h-[42px]"
                        >
                            Generate Bill
                        </button>
                    </div>
                </div>

                {billSummary && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-blue-50 border-b border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bill Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-500 text-sm">Total Collections</p>
                                    <p className="text-2xl font-bold text-blue-600">{billSummary.collections.length}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-500 text-sm">Total Quantity</p>
                                    <p className="text-2xl font-bold text-green-600">{billSummary.totalQuantity.toFixed(2)} L</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-500 text-sm">Total Amount</p>
                                    <p className="text-2xl font-bold text-purple-600">₹{billSummary.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Collection Details</h3>
                            {billSummary.collections.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No collections found for this period</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Shift</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty (L)</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-700">FAT</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {billSummary.collections.map((collection) => (
                                                <tr key={collection.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        {new Date(collection.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${collection.shift === 'MORNING' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'
                                                            }`}>
                                                            {collection.shift}
                                                        </span>
                                                    </td>
                                                    <td className="text-right py-3 px-4">{collection.quantity.toFixed(2)}</td>
                                                    <td className="text-right py-3 px-4">{collection.fat.toFixed(1)}</td>
                                                    <td className="text-right py-3 px-4">₹{collection.rate.toFixed(2)}</td>
                                                    <td className="text-right py-3 px-4 font-semibold text-gray-700">₹{collection.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
