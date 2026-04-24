import api from "./axios";

interface AuthPayload {
  email: string;
  password: string;
  username?: string;
}

export const loginUser = async (
  data: AuthPayload
) => {
  const res = await api.post(
    "/api/auth/login",
    data
  );

  return res.data;
};

export const registerUser = async (
  data: AuthPayload
) => {
  const res = await api.post(
    "/api/auth/register",
    data
  );

  return res.data;
};

export const updateProfile = async (
  username: string
) => {
  const res = await api.patch(
    "/api/auth/profile",
    { username }
  );

  return res.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const res = await api.patch(
    "/api/auth/password",
    {
      currentPassword,
      newPassword,
    }
  );

  return res.data;
};