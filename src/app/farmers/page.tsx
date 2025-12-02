"use client"

import { createFarmer, getFarmers, updateFarmer } from "@/app/actions"
import { useEffect, useState } from "react"

type Farmer = {
    id: number
    code: string
    name: string
    phone: string
    address: string
}

export default function FarmersPage() {
    const [farmers, setFarmers] = useState<Farmer[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null)
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        phone: "",
        address: "",
    })

    useEffect(() => {
        loadFarmers()
    }, [])

    async function loadFarmers() {
        const data = await getFarmers()
        setFarmers(data)
    }

    function handleEdit(farmer: Farmer) {
        setEditingFarmer(farmer)
        setFormData({
            code: farmer.code,
            name: farmer.name,
            phone: farmer.phone,
            address: farmer.address,
        })
        setIsFormOpen(true)
    }

    function handleCancel() {
        setIsFormOpen(false)
        setEditingFarmer(null)
        setFormData({ code: "", name: "", phone: "", address: "" })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (editingFarmer) {
            await updateFarmer(editingFarmer.id, formData)
        } else {
            await createFarmer(formData)
        }

        handleCancel()
        loadFarmers()
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Farmers</h1>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        + Add Farmer
                    </button>
                </div>

                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {editingFarmer ? "Edit Farmer" : "Add New Farmer"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farmer Code
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., F001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Farmer name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Full address"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        {editingFarmer ? "Update" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {farmers.length === 0 ? (
                        <p className="text-gray-500 text-center py-12">No farmers added yet</p>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Code</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Phone</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Address</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {farmers.map((farmer) => (
                                    <tr key={farmer.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-blue-600">{farmer.code}</td>
                                        <td className="py-4 px-6">{farmer.name}</td>
                                        <td className="py-4 px-6">{farmer.phone}</td>
                                        <td className="py-4 px-6">{farmer.address}</td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleEdit(farmer)}
                                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </td>
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
