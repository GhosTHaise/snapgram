import {useQuery , useMutation , useQueryClient, useInfiniteQuery, QueryClient} from "@tanstack/react-query";
import { createPost, createUserAccount, signInAccount, signOutAccount } from "../appwrite/api";
import { INewPost, INewUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const userCreateUserAccount = () => {
    return useMutation({
        mutationFn : (user : INewUser) => createUserAccount(user)
    })
}

export const userSignInAccount = () => {
    return useMutation({
        mutationFn : (user : { email : string , password : string}) => signInAccount(user)
    })
}


export const userSignOutAccount = () => {
    return useMutation({
        mutationFn : () => signOutAccount()
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn  : (post : INewPost) => createPost(post),
        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

