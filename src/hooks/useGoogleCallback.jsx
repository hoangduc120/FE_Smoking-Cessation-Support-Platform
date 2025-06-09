import { useEffect, useRef } from "react";
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
    const hasProcessed = useRef(false);
    const isProcessing = useRef(false);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const accessToken = urlParams.get("accessToken");

            if (accessToken && !hasProcessed.current && !isProcessing.current) {
                hasProcessed.current = true;
                isProcessing.current = true;

                try {
                    window.history.replaceState({}, document.title, "/");

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
                } catch (err) {
                    console.error("Error handling Google login callback:", err);
                    toast.error("Lỗi khi đăng nhập bằng Google. Vui lòng thử lại!");
                    navigate(PATH.LOGIN, { replace: true });
                    hasProcessed.current = false;
                } finally {
                    isProcessing.current = false;
                }
            }
        };

        const timeoutId = setTimeout(handleGoogleCallback, 100);

        return () => clearTimeout(timeoutId);
    }, [location.search]);

    return { isLoading, error };
}; 