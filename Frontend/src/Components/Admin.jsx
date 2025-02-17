import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("allUsers"); // State to manage active tab
  const [users, setUsers] = useState([]); // State to manage users
  const [lostPosts, setLostPosts] = useState([]); // State to manage lost posts
  const [foundPosts, setFoundPosts] = useState([]); // State to manage found posts
  const [userSearchQuery, setUserSearchQuery] = useState(""); // State for user search
  const [lostPostSearchQuery, setLostPostSearchQuery] = useState(""); // State for lost post search
  const [foundPostSearchQuery, setFoundPostSearchQuery] = useState(""); // State for found post search

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch all lost posts
  useEffect(() => {
    const fetchLostPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/alllostpost");
        const data = await response.json();
        if (data.success) {
          setLostPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching lost posts:", error);
      }
    };

    fetchLostPosts();
  }, []);

  // Fetch all found posts
  useEffect(() => {
    const fetchFoundPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/allfoundpost");
        const data = await response.json();
        if (data.success) {
          setFoundPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching found posts:", error);
      }
    };

    fetchFoundPosts();
  }, []);

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId)); // Update state
        alert("User deleted successfully!");
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Handle deleting a lost post
  const handleDeleteLostPost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/alllostpost/${postId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setLostPosts(lostPosts.filter((post) => post._id !== postId)); // Update state
        alert("Lost post deleted successfully!");
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Failed to delete lost post:", error);
    }
  };

  // Handle deleting a found post
  const handleDeleteFoundPost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/allfoundpost/${postId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setFoundPosts(foundPosts.filter((post) => post._id !== postId)); // Update state
        alert("Found post deleted successfully!");
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Failed to delete found post:", error);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Filter lost posts based on search query
  const filteredLostPosts = lostPosts.filter(
    (post) =>
      post.item.toLowerCase().includes(lostPostSearchQuery.toLowerCase()) ||
      post.name.toLowerCase().includes(lostPostSearchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(lostPostSearchQuery.toLowerCase())
  );

  // Filter found posts based on search query
  const filteredFoundPosts = foundPosts.filter(
    (post) =>
      post.item.toLowerCase().includes(foundPostSearchQuery.toLowerCase()) ||
      post.name.toLowerCase().includes(foundPostSearchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(foundPostSearchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#088178] text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("allUsers")}
              className={`w-full text-left p-2 rounded ${
                activeTab === "allUsers"
                  ? "bg-white text-[#088178]"
                  : "hover:bg-white hover:text-[#088178]"
              }`}
            >
              All Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("allLostPosts")}
              className={`w-full text-left p-2 rounded ${
                activeTab === "allLostPosts"
                  ? "bg-white text-[#088178]"
                  : "hover:bg-white hover:text-[#088178]"
              }`}
            >
              All Lost Posts
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("allFoundPosts")}
              className={`w-full text-left p-2 rounded ${
                activeTab === "allFoundPosts"
                  ? "bg-white text-[#088178]"
                  : "hover:bg-white hover:text-[#088178]"
              }`}
            >
              All Found Posts
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "allUsers" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">All Users</h2>
            {/* Search Bar for Users */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#088178]"
              />
            </div>
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-[#088178] text-white">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.mobile}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "allLostPosts" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">All Lost Posts</h2>
            {/* Search Bar for Lost Posts */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search lost posts by item or owner..."
                value={lostPostSearchQuery}
                onChange={(e) => setLostPostSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#088178]"
              />
            </div>
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-[#088178] text-white">
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-left">Owner</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLostPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{post.item}</td>
                    <td className="p-3">{post.name}</td>
                    <td className="p-3">{post.location}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteLostPost(post._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "allFoundPosts" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">All Found Posts</h2>
            {/* Search Bar for Found Posts */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search found posts by item or owner..."
                value={foundPostSearchQuery}
                onChange={(e) => setFoundPostSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#088178]"
              />
            </div>
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-[#088178] text-white">
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-left">Owner</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoundPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{post.item}</td>
                    <td className="p-3">{post.name}</td>
                    <td className="p-3">{post.location}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteFoundPost(post._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;