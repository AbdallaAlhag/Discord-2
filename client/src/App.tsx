import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
}
function App() {
  const [users, setUsers] = useState<User[]>([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    };

    fetchUsers();
  }, [API_URL]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-4">Users</h1>
      <ul className="list-disc pl-8">
        {users.map((user) => (
          <li key={user.id} className="py-2">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
