import { useEffect, useState } from "react";
import FriendCard from "../components/FriendCard";
import NewLearnerCard from "../components/NewLearnerCard";
import { 
  getUserFriends, 
  getRecommendedUsers,
  sendFriendRequest 
} from "../lib/api.js";
import { Link } from "react-router-dom";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch friends
      const friendsData = await getUserFriends();  
      console.log("Friends Response:", friendsData);
      
      // Fetch recommended users
      const learnersData = await getRecommendedUsers();
      console.log("Learners Response:", learnersData);
      
      setFriends(Array.isArray(friendsData) ? friendsData : []);
      setLearners(Array.isArray(learnersData) ? learnersData : []);
      
    } catch (error) {
      console.error("Error loading friends:", error);
      setFriends([]);
      setLearners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      setSendingRequest(prev => ({ ...prev, [userId]: true }));
      await sendFriendRequest(userId);
      alert('Friend request sent successfully!');
      
      // Remove from suggestions after sending request
      setLearners(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      alert(error.message || 'Failed to send friend request');
    } finally {
      setSendingRequest(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Your Language Circle</h1>
          <p className="text-gray-600 mt-2">Connect, converse, and grow together</p>
        </div>
        <Link 
          to="/notifications" 
          className="btn btn-outline btn-primary gap-2"
        >
          <span>👥</span>
          Friend Requests
        </Link>
      </div>

      {/* Friends List */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Friends</h2>
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map(friend => (
              <FriendCard 
                key={friend._id} 
                friend={friend} 
                onReload={loadData}
              />
            ))}
          </div>
        ) : (
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center py-12">
              <div className="text-6xl mb-4">👋</div>
              <h3 className="text-xl font-bold">No friends yet</h3>
              <p className="text-gray-600 mb-4">Start connecting with other learners below!</p>
            </div>
          </div>
        )}
      </div>

      {/* Discover New Partners */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Discover New Partners</h2>
        <p className="text-gray-600 mb-6">Hand picked matches for your learning journey</p>
        
        {learners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learners.map(user => (
              <div key={user._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-16">
                        <span className="text-2xl">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="card-title text-lg">{user.username}</h3>
                      <div className="badge badge-outline mt-1">
                        {user.language || 'English'}
                      </div>
                      {user.interests?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {user.interests.slice(0, 3).map((interest, idx) => (
                            <span key={idx} className="badge badge-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => handleConnect(user._id)}
                      disabled={sendingRequest[user._id]}
                      className="btn btn-primary btn-sm md:btn-md"
                    >
                      {sendingRequest[user._id] ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Sending...
                        </>
                      ) : (
                        'Connect Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-base-200">
            <div className="card-body items-center text-center py-8">
              <p className="text-gray-600">No new learners to show right now.</p>
              <button onClick={loadData} className="btn btn-link mt-2">
                Refresh suggestions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;