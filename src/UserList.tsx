import React, { useEffect, useState } from "react";
import { requestUsers, requestUsersWithError, User, Query } from "./api";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState<Query>({
    name: "",
    age: "",
    limit: 4, // Default limit per page
    offset: 0 // Default offset
  });
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchTotalUserCount = (params: Query): Promise<number> => {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(10); // Replace with the actual count returned by your API.
      }, 1000);
    });
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate API call to requestUsers
    requestUsers(queryParams)
      .then((data) => {
        setUsers(data);
        setLoading(false);

        // Fetch the total count of users from the API
        return fetchTotalUserCount(queryParams);
      })
      .then((count) => {
        setTotalUsers(count);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [queryParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQueryParams({ ...queryParams, [name]: value });
  };

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * queryParams.limit;
    setQueryParams({ ...queryParams, offset: newOffset });
  };

  const handleLimitChange = (newLimit: number) => {
    setQueryParams({ ...queryParams, limit: newLimit });
  };

  const totalPages = Math.ceil(totalUsers / queryParams.limit) || 1;
  const currentPage = queryParams.offset / queryParams.limit + 1;

  return (
    <div>
      <h1>User List</h1>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={queryParams.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="age"
          placeholder="Filter by age"
          value={queryParams.age}
          onChange={handleFilterChange}
        />
        <select
          name="limit"
          value={queryParams.limit.toString()}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
        >
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="11">11</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name}, {user.age}
              </li>
            ))}
          </ul>
          <div>
            <button
              style={{
                color: "black",
                margin: "10px",
                border: "1px solid black"
              }}
              disabled={currentPage === 1} // Change this line
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              style={{
                color: "black",
                margin: "10px",
                border: "1px solid black"
              }}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
