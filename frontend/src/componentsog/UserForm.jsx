import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAddUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email }]);

    if (error) console.error(error);
    else console.log("✅ User added:", data);
  };

  return (
    <div>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default UserForm;
