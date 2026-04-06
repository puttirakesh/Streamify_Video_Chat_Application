// Enhanced OnboardingPage.jsx
import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { Loader2, MapPinIcon, ShipWheelIcon, ShuffleIcon, Camera } from "lucide-react"; // Fixed: Added Camera import
import { motion } from "framer-motion"; // Optional: Add framer-motion (npm install framer-motion)
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });
  const [isUploading, setIsUploading] = useState(false); // For future file upload

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Welcome aboard! Your profile is ready to sail.");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    },
  });

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.fullName || !formState.nativeLanguage || !formState.learningLanguage) {
      toast.error("Please fill in your name and select languages.");
      return;
    }
    onboardingMutation(formState);
  };

  const handleRandomAvatar = async () => {
    setIsUploading(true);
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    handleInputChange("profilePic", randomAvatar);
    toast.success("Fresh avatar generated! 🌟");
    setIsUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card bg-base-100/80 backdrop-blur-sm w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden border border-primary/20"
      >
        <div className="card-body p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-8"
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShipWheelIcon className="size-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
              Set Sail on Your Journey
            </h1>
            <p className="text-sm opacity-70">Complete your profile to start connecting with global learners</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic Section */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="relative group">
                <div className="size-32 sm:size-40 rounded-full bg-base-200 overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Camera className="size-12 text-base-content/40 group-hover:text-primary/60 transition-colors" />
                    </div>
                  )}
                </div>
                {/* Upload hint overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-medium">Upload or Generate</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleRandomAvatar}
                disabled={isUploading}
                className="btn btn-accent shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShuffleIcon className="size-4" />
                )}
                {isUploading ? "Generating..." : "Generate Avatar"}
              </motion.button>
            </motion.div>

            {/* Form Fields */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="input input-bordered w-full py-3 focus:input-primary transition-all"
                  placeholder="What's your name?"
                  required
                />
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-primary/50" />
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-all"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Native Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Native Language</span>
                </label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) => handleInputChange("nativeLanguage", e.target.value)}
                  className="select select-bordered w-full py-3 focus:select-primary transition-all"
                  required
                >
                  <option value="">Choose your mother tongue</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Language to Learn</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) => handleInputChange("learningLanguage", e.target.value)}
                  className="select select-bordered w-full py-3 focus:select-primary transition-all"
                  required
                >
                  <option value="">What language excites you?</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">About You</span>
                </label>
                <textarea
                  value={formState.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="textarea textarea-bordered h-28 focus:textarea-primary transition-all"
                  placeholder="Share your story, hobbies, or what you're passionate about in language learning..."
                  maxLength={200}
                />
                <p className="text-xs opacity-60 mt-1 text-right">{formState.bio.length}/200</p>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPending}
              className="btn btn-primary w-full py-4 text-base shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-secondary"
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Setting Sail...
                </>
              ) : (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Launch My Profile
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingPage;