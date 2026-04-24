import {
  useState,
  type ChangeEvent,
} from "react";

import {
  loginUser,
  registerUser,
} from "../../api/auth";

import { useAuth } from "./AuthContext";
import { useAuthModal } from "./AuthModalContext";
import toast from "react-hot-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode =
  | "login"
  | "register";

interface LoginForm {
  username: string;
  email: string;
  password: string;
}

type FormField =
  keyof LoginForm;


const GOOGLE_URL =
  "http://localhost:5000/api/auth/google";

const initialForm: LoginForm = {
  username: "",
  email: "",
  password: "",
};

const LoginModal = ({
  isOpen,
  onClose,
}: LoginModalProps) => {
  const { login } =
    useAuth();

  const {
    mode,
    setMode,
  } =
    useAuthModal();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister =
    mode === "register";

  const [form, setForm] =
    useState<LoginForm>(
      initialForm
    );

  const updateField = (
    key: FormField,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInput =
    (field: FormField) =>
    (
      e: ChangeEvent<HTMLInputElement>
    ) => {
      updateField(
        field,
        e.target.value
      );
    };

  const switchMode = (
    nextMode: AuthMode
  ) => {
    setMode(nextMode);
  };
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const res = isRegister
      ? await registerUser(form)
      : await loginUser(form);
      
      login(res);
      setTimeout(() => {
        onClose();
}, 0);
    } catch (err: any) {
  toast.error(
    err?.response?.data?.message ||
    "Authentication failed"
  );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-topbar">
          <button
            onClick={onClose}
            className="auth-close-btn"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <h2 className="auth-title">
          {isRegister
            ? "Register"
            : "Login"}
        </h2>

        {isRegister && (
          <input
            value={
              form.username
            }
            placeholder="Username"
            className="auth-input"
            onChange={handleInput(
              "username"
            )}
          />
        )}

        <input
          value={form.email}
          placeholder="Email"
          className="auth-input"
          onChange={handleInput(
            "email"
          )}
        />

        <input
          value={
            form.password
          }
          type="password"
          placeholder="Password"
          className="auth-input"
          onChange={handleInput(
            "password"
          )}
        />

        <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="auth-submit-btn">
          {isSubmitting
          ? "PLEASE WAIT..."
          : isRegister
          ? "Register"
          : "Login"}
        </button>

        <a
          href={GOOGLE_URL}
          className="auth-google-btn"
        >
          Continue with Google
        </a>

        <p className="auth-switch">
          {isRegister ? (
            <>
              Already have an
              account?{" "}
              <span
                className="auth-switch-action"
                onClick={() =>
                  switchMode(
                    "login"
                  )
                }
              >
                Login
              </span>
            </>
          ) : (
            <>
              New user?{" "}
              <span
                className="auth-switch-action"
                onClick={() =>
                  switchMode(
                    "register"
                  )
                }
              >
                Register
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;