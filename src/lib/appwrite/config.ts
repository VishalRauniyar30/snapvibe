import { Account, Avatars, Client, Databases, Storage } from 'appwrite'

export const appwriteConfig = {
    url: 'https://fra.cloud.appwrite.io/v1',
    projectId: '682ad28100281f74a4ce',
    databaseId: '682c48e400220cbb16f3',
    storageId: '682c48b0002d66c84f01',
    userCollectionId: '682c4944003e6a46bda1',
    postCollectionId: '682c491d000a84cac879',
    savesCollectionId: '682c495c0025bea13b47',
    followerCollectionId: '6830ad47001fe9c437c1'
}

export const client = new Client()
.setEndpoint(appwriteConfig.url)
.setProject(appwriteConfig.projectId)


export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)