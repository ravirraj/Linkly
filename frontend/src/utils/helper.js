import { getCurrentUser } from "@/api/getUser";
import { redirect } from "@tanstack/react-router";
import { setCredentials, clearAuth } from "@/store/slice/authSlice";

export const checkAuth = async ({ context }) => {
  try {
    const store = context.store;
    const queryClient = context.queryClient;

    // backend se user data
    const user = await queryClient.ensureQueryData({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      retry: false,
    });
    // redux me save
       if (user?.user && context.store) {
      store.dispatch(
        setCredentials({
          user: user.user, // backend se aaya user
          accessToken: user.accessToken, // agar /me response me token bhi bhej raha ho
        })
      );
    }
    const { isAuthenticated } = store.getState().auth;

    if (!isAuthenticated) {
      throw redirect({ to: "/auth" }); // ✅ return nahi, throw
    }

    return true;
  } catch (error) {
    // error -> clear auth and redirect
    console.log(error)
    context.store.dispatch(clearAuth());
    throw redirect({ to: "/auth" }); // ✅ throw karo
  }
};
