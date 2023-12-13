import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite"
import { account, appwriteconfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })
        return newUser;
    } catch (error) {
        console.log(error);
        return error
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    email: string;
    name: string;
    imageUrl: URL;
    username?: string
}) {
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

export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = account.createEmailSession(user.email, user.password)

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        const uploadedFile = await uploadFile(post.file[0])

        if (!uploadedFile) throw Error

        //Get file url
        const fileUrl = getFilePreview(uploadedFile.$id)

        if (!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error
        }

        //convert tags in an array
        const tags = post.tags?.replace(/ /g, '').split(",") || [];

        //save post to data base
        const newPost = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags
            }
        )

        if (!newPost) {
            await deleteFile(uploadedFile.$id)
            throw Error
        }

        return newPost
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
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

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteconfig.storageId,
            fileId
        )

        return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}

export function getFilePreview(fileId: string) {
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

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteconfig.databaseId,
        appwriteconfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    )

    if (!posts) throw Error

    return posts
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.saveCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost
    } catch (error) {
        console.log(error);
    }
}

export async function deletesavesPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteconfig.databaseId,
            appwriteconfig.saveCollectionId,
            savedRecordId
        )

        if (!statusCode) throw Error;

        return { status: "ok" }
    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            postId
        )

        return post
    } catch (error) {
        throw error
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(post.file[0])

            if (!uploadedFile) throw Error


            //Get file url
            const fileUrl = getFilePreview(uploadedFile.$id)

            if (!fileUrl) {
                deleteFile(uploadedFile.$id)
                throw Error
            }

            image = {...image, imageUrl : fileUrl , imageId : uploadedFile.$id}
        }
        //convert tags in an array
        const tags = post.tags?.replace(/ /g, '').split(",") || [];

        //save post to data base
        const updatedPost = await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags
            }
        )

        if (!updatedPost) {
            await deleteFile(post.imageId)
            throw Error
        }

        return updatedPost
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId : string,imageId : string){
    if(!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            postId
        )
        
        await deleteFile(imageId);

        return { status : "ok" }
    } catch (error) {
        console.log(error);
    }
}

export async function getInfinitePosts({ pageParam} : { pageParam : number}){
    const queries : any[] = [Query.orderDesc("$updatedAt"),Query.limit(10)]

    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts
    } catch (error) {
        console.log(error);
    }
}

export async function searchPosts(searchTerm  : string){
    try {
        const posts = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            [Query.search("caption",searchTerm)]
        )

        if(!posts) throw Error;

        return posts
    } catch (error) {
        console.log(error);
    }
}