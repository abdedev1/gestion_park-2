"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { getUsers } from "../../assets/api/admin/users"
import { getParks } from "../../assets/api/parks/park"
import { getSpots } from "../../assets/api/parks/park"
import { getParksTickets } from "../../assets/api/parks/Parktickets"
import { getRoles } from "../../assets/api/roles/roles"

// API functions

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [parks, setParks] = useState([])
  const [spots, setSpots] = useState([])
  const [tickets, setTickets] = useState([])
  const [roles, setRoles] = useState([])
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")


  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const [usersData, parksData, spotsData, ticketsData, rolesData] = await Promise.all([
          getUsers(),
          getParks(),
          getSpots(),
          getParksTickets(),
          getRoles(),
        ])

        setUsers(usersData)
        setParks(parksData)
        setSpots(spotsData)
        setTickets(ticketsData)
        setRoles(rolesData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Calculate statistics
  const totalUsers = users.length
  const totalParks = parks.length
  const totalSpots = spots.length
  const totalTickets = tickets.length
  const reservedSpots = spots.filter((spot) => spot.status === "reserved").length
  const availableSpots = totalSpots - reservedSpots
  const occupancyRate = totalSpots > 0 ? ((reservedSpots / totalSpots) * 100).toFixed(1) : 0

  // Prepare chart data
  const parkOccupancyData = parks.map((park) => ({
    name: park.name,
    reservedSpots: spots.filter((spot) => spot.park_id === park.id && spot.status === "reserved").length,
    totalSpots: spots.filter((spot) => spot.park_id === park.id).length,
  }))

  const ticketsByDayData = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      return {
        name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
        tickets: tickets.filter((ticket) => ticket.createdAt && ticket.createdAt.startsWith(dateString)).length,
      }
    })
    .reverse()

  const pieChartData = [
    { name: "Available", value: availableSpots, color: "#3b82f6" },
    { name: "reserved", value: reservedSpots, color: "#1d4ed8" },
  ]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Parking Analytics Dashboard</h1>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <div className="pb-2">
              <h3 className="text-lg font-medium text-blue-900">Total Users</h3>
              <p className="text-sm text-gray-500">All registered users</p>
            </div>
            <div className="text-3xl font-bold text-blue-700">{totalUsers}</div>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <div className="pb-2">
              <h3 className="text-lg font-medium text-blue-900">Parking Lots</h3>
              <p className="text-sm text-gray-500">Total parking facilities</p>
            </div>
            <div className="text-3xl font-bold text-blue-700">{totalParks}</div>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <div className="pb-2">
              <h3 className="text-lg font-medium text-blue-900">Parking Spots</h3>
              <p className="text-sm text-gray-500">Available / Total</p>
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {availableSpots} / {totalSpots}
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <div className="pb-2">
              <h3 className="text-lg font-medium text-blue-900">Occupancy Rate</h3>
              <p className="text-sm text-gray-500">Current utilization</p>
            </div>
            <div className="text-3xl font-bold text-blue-700">{occupancyRate}%</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                activeTab === "overview"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8 12h8" />
                <path d="M8 16h8" />
                <path d="M8 8h8" />
              </svg>
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                activeTab === "tickets"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              Ticket Trends
            </button>
            <button
              onClick={() => setActiveTab("occupancy")}
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                activeTab === "occupancy"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              Occupancy
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900">Parking Lot Occupancy</h3>
                <p className="text-sm text-gray-500">Current occupancy by parking lot</p>
              </div>
              <div className="p-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parkOccupancyData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reservedSpots" name="reserved Spots" fill="#1d4ed8" />
                      <Bar dataKey="totalSpots" name="Total Spots" fill="#93c5fd" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tickets" && (
            <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900">Ticket Issuance Trend</h3>
                <p className="text-sm text-gray-500">Number of tickets issued over the past week</p>
              </div>
              <div className="p-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ticketsByDayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="tickets"
                        name="Tickets Issued"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "occupancy" && (
            <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900">Current Spot Occupancy</h3>
                <p className="text-sm text-gray-500">Available vs. reserved parking spots</p>
              </div>
              <div className="p-6">
                <div className="h-[400px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium text-blue-900">Recent Parking Activity</h3>
            <p className="text-sm text-gray-500">Latest parking tickets issued</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-100">
                    <th className="px-4 py-3 text-left font-medium text-blue-900">Ticket ID</th>
                    <th className="px-4 py-3 text-left font-medium text-blue-900">User</th>
                    <th className="px-4 py-3 text-left font-medium text-blue-900">Parking Lot</th>
                    <th className="px-4 py-3 text-left font-medium text-blue-900">Spot</th>
                    <th className="px-4 py-3 text-left font-medium text-blue-900">Time</th>
                    <th className="px-4 py-3 text-left font-medium text-blue-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 5).map((ticket, i) => (
                    <tr key={i} className="border-b border-blue-50 hover:bg-blue-50">
                      <td className="px-4 py-3">{ticket.id || `TKT-${1000 + i}`}</td>
                      <td className="px-4 py-3">{ticket.client_first_name || "User " + (i + 1)}</td>
                      <td className="px-4 py-3">
                        {parks.find((p) => p.id === ticket.parkId)?.name || `Park ${i + 1}`}
                      </td>
                      <td className="px-4 py-3">
                        {spots.find((s) => s.id === ticket.spot_id)?.name || `Spot ${i + 1}`}
                      </td>
                      <td className="px-4 py-3">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleString()
                          : new Date(Date.now() - i * 3600000).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ticket.status === "active"
                              ? "bg-green-100 text-green-800"
                              : ticket.status === "expired"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {ticket.status || (i % 2 === 0 ? "Active" : "Completed")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
