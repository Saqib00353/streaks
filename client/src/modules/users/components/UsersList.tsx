import { useEffect, useState } from "react"
import { fetchUsers } from "../service"

export default function UsersList() {
    const [users, setUsers] = useState([])

    useEffect(()=> {
        fetchUsers().then(resUsers => {
            setUsers(resUsers)
        })

    }, [])
    return <div>
        {users.map(user => <div key={user.username}>{user.username}</div>)}
    </div>
}