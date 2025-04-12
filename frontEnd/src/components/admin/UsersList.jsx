"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { message, Popconfirm } from "antd"
import { CircleHelp, Plus, Trash2 } from "lucide-react"

function UsersList() {
  // Replace this line:
  // const users = useSelector((state) => state.users)

  // With these lines:
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const source = axios.CancelToken.source()

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users", {
          cancelToken: source.token,
        })
        setUsers(response.data)
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Error fetching users")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()

    return () => {
      source.cancel("Component unmounted, request canceled")
    }
  }, [])

  
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`)
      console.log(setUsers)
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
      message.success("User deleted successfully")
    } catch (error) {
      message.error("Error deleting user")
    }
  }

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4">
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-4xl text-center">User List</h1>
          <span className="badge badge-outline badge-lg m-3 count">{users.length}</span>
        </div>
        
      </div>
      <div className="flex justify-end p-3 gap-3">
        <div className="flex gap-1.5">
          <button
            className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize "btn-active" : ""}`}
          >
            admin
          </button>
          <button
            className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize "btn-active" : ""}`}
          >
            manager
          </button>
          <button
            className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize  "btn-active" : ""}`}
          >
            employee
          </button>
          <button
            className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize "btn-active" : ""}`}
          >
            guest
          </button>
        </div>

        <label className="input input-sm w-1/6">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow" placeholder="Search" />
        </label>
      </div>

      <div className="divider after:bg-gray-700 before:bg-gray-700 my-0 mx-4"></div>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birthday</th>
              <th>Email</th>
              <th>Role</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-base-300">
                <td>
                  <div className="font-bold">{user.id}</div>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Link to={`/users/${user.id}`}>
                          {/* <img src={user.avatar || "/placeholder.svg"} alt="User Avatar" /> */}
                        </Link>
                      </div>
                    </div>
                    <div className="font-bold capitalize">{user.first_name}</div>
                  </div>
                </td>
                <td>
                  <div className="font-bold">{user.last_name}</div>
                </td>
                <td>
                  <div className="font-bold">{user.birth_date}</div>
                </td>
                <td>
                  <div className="font-bold">{user.email}</div>
                </td>
               
                <td>
                  <div className="font-bold capitalize">{user.role}</div>
                </td>

                <th>
                  <div className="join">
                    <Popconfirm
                      placement="topLeft"
                      title="Delete the User?"
                      description={`Are you sure you want to delete this User ID ${user.id}?`}
                      okText="Yes"
                      cancelText="No"
                      icon={<CircleHelp size={16} className="m-1" />}
                    >
                      <button
                        className="join-item btn btn-outline btn-secondary btn-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </Popconfirm>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  )
}

export default UsersList
