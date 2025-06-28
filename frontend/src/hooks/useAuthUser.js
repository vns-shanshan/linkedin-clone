import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";


import { axiosInstance } from "../lib/axios.js";

const useAuthUser = () => {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/auth/me");
                return res.data;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    return null; // User is not authenticated
                }
                toast.error(error.response.data.message || "Something went wrong.");
            }
        },
    });
};

export default useAuthUser;