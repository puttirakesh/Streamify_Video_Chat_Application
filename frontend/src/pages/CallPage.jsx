// Enhanced CallPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css"; // Keep, but suggest custom overrides
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import PageLoader from "../components/PageLoader";
import { Phone, Mic, Video, RotateCcw, X } from "lucide-react"; // For custom controls if needed

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Custom Theme Override (add to global CSS or inline)
const customTheme = {
  "--video-participant-background-color": "hsl(var(--b1))",
  "--video-participant-border-color": "hsl(var(--p))",
  "--video-call-controls-background-color": "hsl(var(--bc) / 0.8)",
  "--video-call-controls-color": "hsl(var(--bc))",
  // Add more for professional look
};

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);

  const { authUser, isLoading: authLoading } = useAuthUser();
  const navigate = useNavigate();

  const { data: tokenData, isLoading: tokenLoading } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId || authLoading || tokenLoading) return;

      try {
        setError(null);
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
          options: { logLevel: "warn" }, // Reduce logs for production
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
        toast.success("Connected to video call! 🎥");
      } catch (err) {
        console.error("Error joining call:", err);
        setError("Failed to join call. Please check your connection.");
        toast.error("Could not join the call. Redirecting...");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId, authLoading, tokenLoading, navigate]);

  if (authLoading || tokenLoading || isConnecting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-primary to-secondary"
      >
        <PageLoader />
      </motion.div>
    );
  }

  if (error || !client || !call) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-100 to-base-200 text-center p-4"
      >
        <div className="max-w-md space-y-4">
          <Phone className="size-16 text-error mx-auto" />
          <h2 className="text-2xl font-bold">Call Unavailable</h2>
          <p className="text-base-content/70">{error || "Unable to initialize video call."}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            <RotateCcw className="size-4 mr-2" />
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen relative bg-black"
    >
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </motion.div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT || callingState === CallingState.FAILED) {
      toast.info("Call ended.");
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <div className="custom-video-wrapper" style={{ height: "100vh" }}> {/* For full-screen */}
        <SpeakerLayout participantsBarPosition="bottom" />
        <CallControls showStats={false} /> {/* Hide stats for cleaner UI */}
      </div>
    </StreamTheme>
  );
};

export default CallPage;