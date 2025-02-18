import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [lostPosts, setLostPosts] = useState([]);
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${id}`);
        if (response.data.success) {
          setUser(response.data.user);
          setLostPosts(response.data.lostPosts);
          setFoundPosts(response.data.foundPosts);
        } else {
          console.error("Failed to fetch profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg font-semibold py-20">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center text-lg font-semibold py-20">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture */}
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"} // Default placeholder image
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#088178]"
          />

          {/* User Details */}
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.mobile}</p>
          <p className="text-gray-600">{user.address}</p>
        </div>
      </div>

      {/* Lost Posts Section */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lost Posts</h2>
        {lostPosts.length > 0 ? (
          lostPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-6 mb-6"
            >
              <img
                src={`http://localhost:3000/${post.photo}`}
                alt={post.item}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mt-4">{post.item}</h3>
              <p className="text-gray-600">{post.description}</p>
              <p className="text-gray-600">{post.location}</p>
              <p className="text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
              <p className="text-gray-600">{post.contact}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No lost posts found.</p>
        )}
      </div>

      {/* Found Posts Section */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Found Posts</h2>
        {foundPosts.length > 0 ? (
          foundPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-6 mb-6"
            >
              <img
                src={`http://localhost:3000/${post.photo}`}
                alt={post.item}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mt-4">{post.item}</h3>
              <p className="text-gray-600">{post.description}</p>
              <p className="text-gray-600">{post.location}</p>
              <p className="text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
              <p className="text-gray-600">{post.contact}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No found posts found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;