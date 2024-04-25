import React, { useEffect, useState } from "react";
import "./contactList.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

function ContactList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      handleEditSubmit();
    } else {
      handleAddSubmit();
    }
  };

  const handleAddSubmit = () => {
    const { name, phone } = formData;
    if (!name?.trim() || !phone?.trim()) {
      return;
    }
    const newUser = { ...formData, id: Date.now() };
    setUsers([...users, newUser]);
    setFormData({ name: "", phone: "" });
  };

  const handleEditSubmit = () => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, ...formData } : user
    );
    setUsers(updatedUsers);
    setFormData({ name: "", phone: "" });
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, phone: user.phone });
    setIsEditing(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Contacts List App</h1>

      <form
        className="form-inline"
        onSubmit={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        <div className="input-box">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            id="nameInput"
            placeholder="Name"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            id="phoneInput"
            placeholder="Phone"
          />
          <button type="submit" className="btn btn-primary">
            <i className="fa fa-fw fa-plus"></i>
            {isEditing ? (
              <FontAwesomeIcon icon={faPenToSquare} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
          </button>
        </div>
      </form>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>
              <i className="fa fa-fw fa-user"></i>Name
            </th>
            <th>
              <i className="fa fa-fw fa-phone"></i>Phone
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleUpdate(user)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>{" "}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactList;
