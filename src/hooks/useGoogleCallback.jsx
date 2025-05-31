import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { googleLoginCallback } from "../store/slices/authSlice";
import { PATH } from "../routes/path";
import toast from "react-hot-toast";

export const useGoogleCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const accessToken = urlParams.get("accessToken");

            if (accessToken) {
                try {
                    // Dispatch Google login callback action
                    const result = await dispatch(googleLoginCallback(accessToken)).unwrap();

                    if (result && result.user) {
                        toast.success("Đăng nhập Google thành công!");

                        // Điều hướng dựa trên role của user
                        const userRole = result.user.role?.trim().toLowerCase();

                        if (userRole === "user") {
                            navigate(PATH.HOME, { replace: true });
                        } else if (userRole === "coach") {
                            navigate(PATH.PLANMANAGEMEMTPAGE, { replace: true });
                        } else if (userRole === "admin" || userRole === "administrator") {
                            navigate(PATH.ADMIN, { replace: true });
                        } else {
                            navigate(PATH.HOME, { replace: true });
                        }
                    }

                    // Xóa token khỏi URL
                    window.history.replaceState({}, document.title, "/");
                } catch (err) {
                    console.error("Error handling Google login callback:", err);
                    toast.error("Lỗi khi đăng nhập bằng Google. Vui lòng thử lại!");
                    navigate(PATH.LOGIN, { replace: true });
                }
            }
        };

        handleGoogleCallback();
    }, [location.search, dispatch, navigate]);

    return { isLoading, error };
}; 