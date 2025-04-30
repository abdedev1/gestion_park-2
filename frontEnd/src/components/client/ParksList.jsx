import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchParcs } from "../Redux/slices/parcsSlice"
import { Link } from "react-router-dom"
import { MapPin, Search, Car, Star, Filter } from "lucide-react"

export default function ParksList() {
  const dispatch = useDispatch()
  const { parks, status } = useSelector((state) => state.parks)
  const [filteredParks, setFilteredParks] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minSpots: "",
  })
  const [searchQuery, setSearchQuery] = useState("") 

  useEffect(() => {
    dispatch(fetchParcs())
  }, [dispatch])
  console.log(parks)
  useEffect(() => {
    let result = [...parks]

    // Appliquer les filtres
    if (filters.minPrice) {
      result = result.filter((park) => (park.price || 0) >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter((park) => (park.price || 0) <= Number(filters.maxPrice))
    }
    if (filters.minSpots) {
      result = result.filter((park) => (park.availableSpots || 0) >= Number(filters.minSpots))
    }

    // Appliquer la recherche
    if (searchQuery.trim()) {
      result = result.filter((park) =>
        park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredParks(result)
  }, [parks, filters, searchQuery])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      minSpots: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Available Parking Locations</h1>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search parks..."
              className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Mettre à jour l'état local
              onKeyPress={(e) => e.key === "Enter" && setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <button
            onClick={() => setSearchQuery(searchQuery)} // Appliquer la recherche
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50 transition flex items-center gap-1"
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (MAD)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (MAD)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Available Spots</label>
              <input
                type="number"
                name="minSpots"
                value={filters.minSpots}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min spots"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={resetFilters} className="text-gray-600 hover:text-gray-800 mr-4">
              Reset
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredParks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParks.map((park) => (
            <Link
              key={park.id}
              to={`/parks/${park.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-blue-100 relative flex items-center justify-center">
                <Car size={48} className="text-blue-600" />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="text-yellow-400 mr-1" size={16} />
                  <span>{park.rating || "4.5"}</span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{park.name}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{park.address}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Available spots</p>
                    <p className="font-semibold">
                      {park.availableSpots || park.spots?.filter((s) => s.status === "available").length || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="font-bold text-blue-600">{park.price} MAD/hour</p>
                  </div>
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Car size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">No parking locations found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find available parking spots.</p>
        </div>
      )}
    </div>
  )
}