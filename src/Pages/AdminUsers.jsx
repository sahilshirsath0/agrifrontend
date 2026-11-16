import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, Button, Spinner, Form } from "react-bootstrap";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const tableRef = useRef(null);
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";

  // Fetch Users (Ensuring No Duplicate Fetches)
  const fetchUsers = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}`);
      const data = await response.json();
      if (response.ok) {
        // ✅ Prevent duplicates using a Set
        setUsers((prevUsers) => {
          const existingEmails = new Set(prevUsers.map((user) => user.email));
          const newUsers = data.users.filter((user) => !existingEmails.has(user.email));
          return [...prevUsers, ...newUsers];
        });
        setHasMore(data.has_more);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Error fetching users:", data.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchUsers();
  }, []); // ✅ Fetch only once when component mounts

  // Handle Scroll with Debouncing
  const handleScroll = useCallback(() => {
    if (!tableRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchUsers();
    }
  }, [fetchUsers]);

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("scroll", handleScroll);
      return () => tableElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Select/Deselect Users
  const handleSelectUser = (email) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((user) => user !== email)
        : [...prevSelected, email]
    );
  };

  // Apply Changes - Delete Selected Users
  const applyChanges = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: selectedUsers }),
      });

      if (response.ok) {
        setUsers(users.filter((user) => !selectedUsers.includes(user.email)));
        setSelectedUsers([]);
        window.location.reload();
      } else {
        console.error("Error deleting users:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h3 className="mb-3">Admin User Management</h3>

      {/* ✅ Responsive Table Container with Bottom Space */}
      <div
        ref={tableRef}
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
        className="table-responsive"
      >
        <Table striped bordered hover className="table-responsive">
          <thead className="table-dark">
            <tr>
              <th>Select</th>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Date Logged In</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.email}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => handleSelectUser(user.email)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.date_logged_in}</td>
                  <td>{user.last_active}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No users found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ✅ Apply Changes Button with Spacing */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="danger"
          className="px-4 py-2"
          onClick={applyChanges}
          disabled={selectedUsers.length === 0}
        >
          Apply Changes (Delete Selected)
        </Button>
      </div>
    </div>
  );
};

export default AdminUsers;
