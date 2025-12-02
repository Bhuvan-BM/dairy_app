"use client"

import { getRates, updateRate } from "@/app/actions"
import { useEffect, useState } from "react"

type RateChart = {
    id: number
    fat: number
    rate: number
}

export default function RatesPage() {
    const [rates, setRates] = useState<RateChart[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [formData, setFormData] = useState({
        fat: 0,
        rate: 0,
    })

    useEffect(() => {
        loadRates()
    }, [])

    async function loadRates() {
        const data = await getRates()
        setRates(data)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        await updateRate(formData)
        setIsFormOpen(false)
        setFormData({ fat: 0, rate: 0 })
        loadRates()
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Rate Chart</h1>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        + Add/Update Rate
                    </button>
                </div>

                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add/Update Rate</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        FAT %
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formData.fat || ""}
                                        onChange={(e) => setFormData({ ...formData, fat: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 4.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rate (₹/L)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.rate || ""}
                                        onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 35.50"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        📊 Current Rates
                    </h2>
                    {rates.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No rates set</p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">FAT %</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate (₹/L)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rates.map((rate) => (
                                    <tr key={rate.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                        <td className="py-3 px-4">{rate.fat.toFixed(1)}%</td>
                                        <td className="text-right py-3 px-4 font-semibold text-green-600">₹{rate.rate.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    )
}
