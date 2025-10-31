import React, { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBirthday, setEditBirthday] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditName(user.name);
    setEditBirthday(
      user.birthday ? new Date(user.birthday).toISOString().substr(0, 10) : ""
    );
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditName("");
    setEditBirthday("");
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${editUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, birthday: editBirthday }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        // Preserve posts array if missing from update response
        const userWithPosts = {
          ...updatedUser,
          posts:
            users.find((u) => u._id === updatedUser._id)?.posts || [],
        };
        setUsers(users.map((u) => (u._id === updatedUser._id ? userWithPosts : u)));
        handleCancel();
      } else {
        alert("Failed to update user");
      }
    } catch {
      alert("Error updating user");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: "2rem" }}>
      <h2>Admin Dashboard - Users and Posts</h2>
      <table
        border={1}
        cellPadding={10}
        cellSpacing={0}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
            <th>Actions</th>
            <th>Posts</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user._id}>
              {editUserId === user._id ? (
                <>
                  <td>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                  <td>
                    {(user.posts ?? []).length > 0 ? (
                      <ul>
                        {user.posts.map((post, i) => (
                          <li key={i}>
                            <strong>
                              {new Date(post.createdAt).toLocaleString()}:
                            </strong>{" "}
                            {post.message}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No posts"
                    )}
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                  </td>
                  <td>
                    {(user.posts ?? []).length > 0 ? (
                      <ul>
                        {user.posts.map((post, i) => (
                          <li key={i}>
                            <strong>
                              {new Date(post.createdAt).toLocaleString()}:
                            </strong>{" "}
                            {post.message}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No posts"
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
