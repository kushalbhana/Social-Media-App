import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
     try {
        const newAccount = await account.create(
           ID.unique(),
           user.email,
           user.password,
           user.name
        )
        if (!newAccount) throw new Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
         accountId: newAccount.$id,
         name: newAccount.name,
         email: newAccount.email,
         username: user.username,
         imageUrl: avatarUrl,
        })
        return newUser;

     } catch (error) {
        console.log(error)
        return error;
     }
}

export async function saveUserToDB(user: {
   accountId: string;
   email: string;
   name: string;
   imageUrl: URL;
   username?: string;
}) {
   try {
      const newUser = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         user,
      )

      return newUser;
   } catch (error) {
      console.log(error)
   }
}

export async function signInAccount(user: {email: string; password: string;}){
   try {
      const session = await account.createEmailSession(user.email, user.password);
      return session;
      
   } catch (error) {
      console.log(error)
   }
}

export async function getCurrentUser() {
   try {
     const currentAccount = await account.get();
 
     if (!currentAccount) throw Error;
 
     const currentUser = await databases.listDocuments(
       appwriteConfig.databaseId,
       appwriteConfig.userCollectionId,
       [Query.equal("accountId", currentAccount.$id)]
     );
 
     if (!currentUser) throw Error;
 
     return currentUser.documents[0];
   } catch (error) {
     console.log(error);
     return null;
   }
 }

export async function signOutAccount() {
   try {
      const session= await account.deleteSession("current");
      return session;
   } catch (error) {
      console.log(error)
   }
}

export async function createPost(post: INewPost) {
   try {
      const uploadedFile = await uploadFile(post.file[0]); // Pass post.file to uploadFile

      // Check if uploadedFile is undefined
      if (!uploadedFile) {
         throw Error;
      }
      // Further logic for creating the post using the uploaded file result

      // Get file Url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      console.log(fileUrl)

      if (!fileUrl){
         deleteFile(uploadedFile.$id);
         throw Error
      }

      // Convert tags into array
      const tags = post.tags?.split(',') || [];

      const newPost = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         ID.unique(),
         {
            creator: post.userId,
            caption: post.caption,
            imageURL: fileUrl,
            imageID: uploadedFile.$id,
            location: post.location,
            tag: tags
         }
      )

      if(!newPost){
         await deleteFile(uploadedFile.$id);
         throw Error
      }
      return newPost;
      
   } catch (error) {
      console.log(error);
   }
}

export async function uploadFile(file: File) {
   try {
      const uploadedFile = await storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file
      );
      return uploadedFile;
   } catch (error) {
      console.log(error);
   }
}

export async function getFilePreview(fileId:string) {
   try {
      const fileUrl = storage.getFilePreview(
         appwriteConfig.storageId,
         fileId,
         2000,
         2000,
         "top",
         100,
      )
      return fileUrl
   } catch (error) {
      console.log(error)
   }
}

export async function deleteFile(fileId: string){
   try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
      return {status: '2'}
   } catch (error) {
      console.log(error)
   }
}

export async function getRecentPosts() {
   try {
      const posts = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         [Query.orderDesc('$createdAt'), Query.limit(20)]
      );

      if (!posts) {
         throw new Error('No posts found'); // Adjust the error message as needed
      }

      return posts;
   } catch (error) {
      console.error('Error fetching recent posts:', error);
      throw error; 
   }
}

export async function likePost(postId:string, likesArray:string[]) {
   try {
      const updatePost = await databases.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId,
         {
            likes: likesArray
         }
      )

      if (!updatePost) throw Error;

      return updatePost;
   } catch (error) {
      console.log(error);
   }
}

export async function savePost(postId:string, userId:string) {
   try {
      const updatePost = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.saveCollectionId,
         ID.unique(),
         {
            user: userId,
            post: postId,
         }
      )

      if (!updatePost) throw Error;

      return updatePost;
   } catch (error) {
      console.log(error);
   }
}

export async function deleteSavedPost(savedRecordId: string) {
   try {
      const statusCode = await databases.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.saveCollectionId,
         savedRecordId,
      )

      if (!statusCode) Error;

      return statusCode;
   } catch (error) {
      console.log(error);
   }
}

export async function getPostById(postId?: string){
   if (!postId) throw Error;
 
   try {
     const post = await databases.getDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       postId
     );
 
     if (!post) throw Error;
 
     return post;
   } catch (error) {
     console.log(error);
   }
 }

 export async function updatePost(post: IUpdatePost) {
   const hasFileToUpdate = post.file.length > 0;

   try {
      let image = { 
         imageURL: post.imageUrl,
         imageId: post.imageId
         
      } 

      if(hasFileToUpdate){
         const uploadedFile = await uploadFile(post.file[0]); // Pass post.file to uploadFile

         if (!uploadedFile) {
            throw Error;
         }

         // Get file Url
         const fileUrl = await getFilePreview(uploadedFile.$id);
         console.log(fileUrl)
   
         if (!fileUrl){
            deleteFile(uploadedFile.$id);
            throw Error
         }

         image = {...image, imageURL:fileUrl, imageId: uploadedFile.$id}
      }

      // Convert tags into array
      const tags = post.tags?.split(',') || [];

      const updatedPost = await databases.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         post.postId,
         {
            caption: post.caption,
            imageURL: image.imageURL,
            imageID: image.imageId,
            location: post.location,
            tag: tags
         }
      )

      if(!updatedPost){
         await deleteFile(post.imageId);
         throw Error
      }
      return updatePost;
      
   } catch (error) {
      console.log(error);
   }
}

export async function deletePost(postId?: string, imageId?: string) {
   if (!postId || !imageId) return;
 
   try {
     const statusCode = await databases.deleteDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       postId
     );
 
     if (!statusCode) throw Error;
 
     await deleteFile(imageId);
 
     return { status: "Ok" };
   } catch (error) {
     console.log(error);
   }
 }
 