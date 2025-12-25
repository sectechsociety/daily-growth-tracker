import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Function to fetch data from Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("❌ Error fetching users:", error);
    } else {
      setUsers(data);
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>👥 All Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> — {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default UserList;
