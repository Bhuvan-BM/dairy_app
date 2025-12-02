"use client"

import { addCollection, getFarmers, getRate } from "@/app/actions"
import { useEffect, useState } from "react"

type Farmer = {
    id: number
    code: string
    name: string
    phone: string
    address: string
}

export default function CollectionPage() {
    const [farmers, setFarmers] = useState<Farmer[]>([])
    const [formData, setFormData] = useState({
        farmerId: 0,
        date: new Date().toISOString().split('T')[0],
        shift: "MORNING",
        fat: 0,
        quantity: 0,
        rate: 0,
    })
    const [calculatedAmount, setCalculatedAmount] = useState(0)

    useEffect(() => {
        loadFarmers()
    }, [])

    async function loadFarmers() {
        const data = await getFarmers()
        setFarmers(data)
    }

    async function handleFatChange(fat: number) {
        console.log('handleFatChange called with fat:', fat)
        setFormData(prev => ({ ...prev, fat }))

        if (fat > 0) {
            console.log('Fetching rate for fat:', fat)
            const rateData = await getRate(fat)
            console.log('Rate data received:', rateData)
            if (rateData) {
                console.log('Setting rate to:', rateData.rate)
                setFormData(prev => ({ ...prev, rate: rateData.rate }))
            } else {
                console.log('No rate data found for fat:', fat)
            }
        }
    }

    useEffect(() => {
        setCalculatedAmount(formData.quantity * formData.rate)
    }, [formData.quantity, formData.rate])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (formData.farmerId === 0) {
            alert("Please select a farmer")
            return
        }

        const result = await addCollection({
            ...formData,
            date: new Date(formData.date),
        })

        if (result.success) {
            alert("Collection added successfully!")
            setFormData({
                farmerId: 0,
                date: new Date().toISOString().split('T')[0],
                shift: "MORNING",
                fat: 0,
                quantity: 0,
                rate: 0,
            })
            setCalculatedAmount(0)
        } else {
            alert("Failed to add collection")
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Milk Collection Entry</h1>

                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Farmer
                                </label>
                                <select
                                    value={formData.farmerId}
                                    onChange={(e) => setFormData({ ...formData, farmerId: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
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
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shift
                                </label>
                                <select
                                    value={formData.shift}
                                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="MORNING">Morning</option>
                                    <option value="EVENING">Evening</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    FAT %
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.fat || ""}
                                    onChange={(e) => handleFatChange(parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 4.0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity (Liters)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.quantity || ""}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 10.5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rate (₹/L)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.rate || ""}
                                    onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                                    placeholder="Auto-filled from rate chart"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                                <span className="text-3xl font-bold text-green-600">₹{calculatedAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Add Collection
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
