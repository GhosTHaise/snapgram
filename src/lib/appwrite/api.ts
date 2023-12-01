import { INewPost, INewUser } from "@/types";
import  { ID, Query } from "appwrite"
import { account, appwriteconfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user:INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
         
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        
        const newUser = await saveUserToDB({
            accountId : newAccount.$id,
            name : newAccount.name,
            email : newAccount.email,
            username : user.username,
            imageUrl : avatarUrl
        })
        return newUser;
    } catch (error) {
        console.log(error);
        return error
    }
} 

export async function saveUserToDB(user : {
    accountId : string,
    email : string;
    name : string;
    imageUrl : URL;
    username? : string
}){
    try {
        const newUser = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.userCollectionId,
            ID.unique(),
            user
        )
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user :  { email : string , password : string}){
    try {
        const session = account.createEmailSession(user.email,user.password)

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser(){
    try {
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;
        
        const currentUser = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.userCollectionId,
            [Query.equal("accountId",currentAccount.$id)]
        )
        
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession("current");
        return session
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post : INewPost){
    try {
        const uploadedFile = await uploadFile(post.file[0])

        if(!uploadedFile) throw Error

        //Get file url
        const fileUrl = getFilePreview(uploadedFile.$id)

        if(!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error
        }
    }catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file : File){
    try {
        const uploadedFile = await storage.createFile(
            appwriteconfig.storageId,
            ID.unique(),
            file
        )

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId : string){
    try {
        await storage.deleteFile(
            appwriteconfig.storageId,
            fileId
        )

        return { status : "ok"}
    } catch (error) {
        console.log(error)
    }
}

export async function getFilePreview(fileId : string){
    try {
        const fileUrl = storage.getFilePreview(
            appwriteconfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        )

        return fileUrl
    } catch (error) {
        console.log(error);
    }
}