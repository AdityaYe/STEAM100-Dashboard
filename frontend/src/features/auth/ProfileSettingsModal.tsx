import { useState } from "react";
import toast from "react-hot-toast";

import {
  updateProfile,
  updatePassword,
} from "../../api/auth";

import { useAuth } from "./AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSettingsModal = ({
  isOpen,
  onClose,
}: Props) => {
  const {
    user,
    setUserData,
    logout,
  } = useAuth();

  const [tab, setTab] =
    useState<
      "profile" | "security"
    >("profile");

  const [username, setUsername] =
    useState(
      user?.username || ""
    );

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const clearStatus = () => {
    setError("");
    setMessage("");
  };

  const handleProfileSave =
    async () => {
      clearStatus();

      if (
        username.trim()
          .length < 3
      ) {
        toast.error(
          "Username must be at least 3 characters",{
            className: "app-toast error"
          }
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await updateProfile(
            username.trim()
          );

        setUserData(
          res.user
        );

        toast.success(
          "Profile updated", {
            className: "app-toast"
          }
        );
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
          "Failed to update profile",
          { className: "app-toast error" }
        );
      } finally {
        setLoading(false);
      }
    };

  const handlePasswordSave =
    async () => {
      clearStatus();

      if (
        !currentPassword
      ) {
        toast.error(
          "Current password required",{
            className: "app-toast error"
          }
        );
        return;
      }

      if (
        newPassword.length <
        6
      ) {
        toast.error(
          "New password must be at least 6 characters",{
            className: "app-toast error"
          }
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        toast.error(
          "Passwords do not match",{
            className: "app-toast error"
          }
        );
        return;
      }

      try {
        setLoading(true);

        await updatePassword(
          currentPassword,
          newPassword
        );

        toast.success(
          "Password updated. Please login again.", {
            className: "app-toast"
          }
        );

        setTimeout(() => {
          logout();
          onClose();
        }, 900);
      } catch {
        toast.error(
          "Failed to update password",{
            className: "app-toast error"
          }
        );
      } finally {
        setLoading(false);
      }
    };

  if (!isOpen) {
    return null;
  }

  const isProfileTab =
    tab === "profile";

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal profile-modal-shell">
        <div className="auth-modal-topbar">
          <button
            onClick={onClose}
            className="auth-close-btn"
          >
            ×
          </button>
        </div>

        <div className="profile-body">
          <h2 className="auth-title">
            Manage Profile
          </h2>

          <div className="profile-tabs">
            <button
              onClick={() =>
                setTab(
                  "profile"
                )
              }
              className={`profile-tab ${
                isProfileTab
                  ? "active"
                  : ""
              }`}
            >
              New Username
            </button>

            <button
              onClick={() =>
                setTab(
                  "security"
                )
              }
              className={`profile-tab ${
                !isProfileTab
                  ? "active"
                  : ""
              }`}
            >
              New Password
            </button>
          </div>

          {isProfileTab ? (
            <>
              <input
                value={
                  username
                }
                onChange={(e) =>
                  setUsername(
                    e.target
                      .value
                  )
                }
                className="auth-input"
                placeholder="Username"
              />

              <button
              onClick={handleProfileSave}
              disabled={loading}
              className="auth-submit-btn"
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <input
                type="password"
                value={
                  currentPassword
                }
                onChange={(e) =>
                  setCurrentPassword(
                    e.target
                      .value
                  )
                }
                className="auth-input"
                placeholder="Current Password"
              />

              <input
                type="password"
                value={
                  newPassword
                }
                onChange={(e) =>
                  setNewPassword(
                    e.target
                      .value
                  )
                }
                className="auth-input"
                placeholder="New Password"
              />

              <input
                type="password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target
                      .value
                  )
                }
                className="auth-input"
                placeholder="Confirm Password"
              />

              {error && (
                <p className="profile-error">
                  {error}
                </p>
              )}

              {message && (
                <p className="profile-success">
                  {message}
                </p>
              )}

              <button
              onClick={handlePasswordSave}
              disabled={loading}
              className="auth-submit-btn"
              >
                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;