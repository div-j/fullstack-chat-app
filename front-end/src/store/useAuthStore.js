import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BaseUrl =  import.meta.env.MODE==="development"? "http://localhost:5000":"/"

export const useAuthStore =  create( (set, get) => ({
    authUser:null,
    isSigningUp:false,
    isLogingIn:false,
    isUpdatingProfile:false, 
    isCheckingAuth:true,
    onlineUsers : [],
    socket:null,

    checkAuth:async () => {
        try {
            const res = await axiosInstance.get("auth/check")
            set({authUser:res.data})
            console.log("Auth User after check:", res.data); // Add this log
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth:", error.message);
            
            set({authUser:null})
            
        } finally{
            set({isCheckingAuth:false})
        }
    },

    signUp:async (data) => {
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser:res.data})
            console.log("Signed up successfully:", res.data); // Add this log

            toast.success("Account created successfully")
            get().connectSocket()
            
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
        
    },
    login: async (data) => {
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({authUser:res.data})
            console.log("Logged in successfully:", res.data); // Add this log
            toast.success("Logged in successfully")
            get().connectSocket()

        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn:false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
           // Disconnect socket on logout
        get().disconnectSocket();

        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfile: async (data) => {
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({authUser:res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile");
            
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },
  
    connectSocket: async () => {
    const {authUser} = get()
    if (!authUser || get().socket?.connected) {
        console.log("No user ID or socket already connected");
        return;
    }
        const socket =  io(BaseUrl, {
            // withCredentials:true,
            query:{
                userId:authUser._id
            }
        })
       socket.connect()
       
       socket.on("getOnlineUsers", (userIds) => {
        set(() => ({ onlineUsers: [...userIds] }));
      });
      

       set({socket:socket})

    },

      disconnectSocket: async () => {
        // Check if a socket is connected and then disconnect it
        if (get().socket?.connected) {
            get().socket.disconnect(); // Disconnect the socket from the server
            // set({ socket: null }); // Optionally clear the socket from the store
        }
    },
})
)