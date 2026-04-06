import { useEffect, useState } from "react";
import { 
  getFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest 
} from "../lib/api";
import { BellIcon, CheckCircle, XCircle } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState({
    incomingReqs: [],
    acceptedReqs: []
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getFriendRequests();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setProcessing(prev => ({ ...prev, [requestId]: 'accepting' }));
      await acceptFriendRequest(requestId);
      await fetchNotifications(); // Refresh list
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept friend request");
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessing(prev => ({ ...prev, [requestId]: 'rejecting' }));
      await rejectFriendRequest(requestId);
      await fetchNotifications(); // Refresh list
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject friend request");
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  const totalNotifications = notifications.incomingReqs.length + notifications.acceptedReqs.length;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BellIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Notifications</h1>
        {totalNotifications > 0 && (
          <span className="badge badge-primary badge-lg">
            {totalNotifications}
          </span>
        )}
      </div>

      {/* Incoming Friend Requests */}
      {notifications.incomingReqs.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Friend Requests ({notifications.incomingReqs.length})
          </h2>
          
          <div className="space-y-4">
            {notifications.incomingReqs.map(request => (
              <div key={request._id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-14 h-14">
                          <span className="text-xl">
                            {request.sender?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {request.sender?.username || 'Unknown User'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Wants to be your language partner
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="badge badge-outline">
                            {request.sender?.nativeLanguage || 'English'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request._id)}
                        disabled={processing[request._id]}
                        className="btn btn-primary btn-sm md:btn-md"
                      >
                        {processing[request._id] === 'accepting' ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Accepting...
                          </>
                        ) : (
                          'Accept'
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        disabled={processing[request._id]}
                        className="btn btn-outline btn-sm md:btn-md"
                      >
                        {processing[request._id] === 'rejecting' ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Rejecting...
                          </>
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Connections */}
      {notifications.acceptedReqs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-success" />
            Recent Connections
          </h2>
          
          <div className="space-y-4">
            {notifications.acceptedReqs.map(notification => (
              <div key={notification._id} className="card bg-success/10 border-success/20">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-success text-success-content rounded-full w-12 h-12">
                        <span className="text-lg">
                          {notification.recipient?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">
                        {notification.recipient?.username || 'User'}
                      </h3>
                      <p className="text-success text-sm">
                        ✓ Connected! Start chatting now
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Notifications */}
      {totalNotifications === 0 && !loading && (
        <NoNotificationsFound />
      )}
    </div>
  );
};

export default NotificationsPage;