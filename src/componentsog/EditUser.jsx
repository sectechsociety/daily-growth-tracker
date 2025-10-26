import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const EditUser = () => {
  const [email, setEmail] = useState("");
  const [newName, setNewName] = useState("");

  const handleUpdate = async () => {
    const { data, error } = await supabase
      .from("users")
      .update({ name: newName })
      .eq("email", email); // updates where email matches

    if (error) {
      console.error("❌ Update error:", error);
    } else {
      console.log("✅ Updated user:", data);
      alert("User updated successfully!");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>✏️ Edit User</h2>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <input
        type="text"
        placeholder="Enter new name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleUpdate}>Update User</button>
    </div>
  );
};

export default EditUser;
