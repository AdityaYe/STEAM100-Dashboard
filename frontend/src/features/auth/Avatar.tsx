import { useAuth } from "./AuthContext";

interface Props {
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
};

const Avatar = ({
  size = "md",
}: Props) => {
  const { user } = useAuth();

  const initial =
    user?.username
      ?.charAt(0)
      .toUpperCase() || "?";

  return (
    <div
      className={`avatar-shell ${sizeClass[size]}`}
    >
      {initial}
    </div>
  );
};

export default Avatar;