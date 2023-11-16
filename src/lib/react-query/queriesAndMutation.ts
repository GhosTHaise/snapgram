import {useQuery , useMutation , useQueryClient, useInfiniteQuery} from "@tanstack/react-query";
import { createUserAccount, signInAccount } from "../appwrite/api";
import { INewUser } from "@/types";

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


