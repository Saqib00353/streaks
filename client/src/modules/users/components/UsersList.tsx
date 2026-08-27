import { useState } from "react"
import { login } from "../service"

export default function UsersList() {
    const [data, setData] = useState({ username: '', password: '' })

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await login(data)
        console.log(res)
    }


    return <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <input value={data.username} onChange={e => setData(p => ({ ...p, username: e.target.value }))} />
        <input value={data.password} onChange={e => setData(p => ({ ...p, password: e.target.value }))} />
        <button type="submit">Login</button>
    </form>
}