import { useState, type ComponentType } from "react";
import Login from "../../pages/login"
import Signup from "../../pages/signup"
import '../../styles/login.css';

type AuthSwitchProps = {
  onSwitchToSignup?: () => void;
  onSwitchToLogin?: () => void;
};

const LoginWithSwitch = Login as unknown as ComponentType<AuthSwitchProps>;
const SignupWithSwitch = Signup as unknown as ComponentType<AuthSwitchProps>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        {mode === "login" ? (
          <LoginWithSwitch onSwitchToSignup={() => setMode("signup")} />
        ) : (
          <SignupWithSwitch onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}