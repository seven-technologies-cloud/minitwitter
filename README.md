# Mini Twitter

This project consists of creating a front-end that integrates with the PythonREST generated API to create an application similar to Twitter. 

### How to run 
- [Front end](#front-end)
<br>

# Front-end

##  First step to using PythonRest APi

Installing axios to use api
```bash 
yarn add axios
```
 Link :[ Axios doc ](https://axios-http.com/ptbr/) for more details.

### Inside let's **src** create a folder named api file axios.js
Inside it we will create a new instance of axios to be used anywhere in the project.

```json
import axios from "axios";
const baseURL = process.env.REACT_APP_BACKEND_URL
export const api = axios.create({
    baseURL: baseURL,
    // timeout: 5000,
    headers: {"Content-Type": "application/json"},
})
```
# User Changes.
### searching "user api".
Inside the <strong>services/user.js</strong> files
in the function **getUserLoggedIn()**<br>

I removed this code with being mocked
```json
    return new Promise((resolve) => {
      resolve({
        id: "797f6ce2-9f14-4c46-bf5e-05d446b34c84",
        name: "Lucas Polizeli",
        createdAt: 1652063207108,
        username: "Leo",
      });
    });
```
#### To search for user in the API
And using get together with the .env uuid
```json
async getUserLoggedIn() {            
    const {data} = await api.get(`user?id_user=${process.env.REACT_APP_LOGGED_USER_ID }`);   
    localStorage.setItem("user_logged", JSON.stringify(data[0]));    
},    
```
Above, configuration is also done in localStorage, to avoid frequent API searches. There is no sensitive information involved

### inside the Hook folder userAuth.js file
Here, we will have to change the way we are getting the user, which is currently done through userService.getUserLoggedIn. However, to avoid unnecessary calls, let's change the method

```bash
export function useAuth() {
5  const [user, setUser] = useState({});

  useEffect(() => {
    getUserLoggedInOnLoad();
  }, []);
```
to  
```bash
export function useAuth() {
 5 const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user_logged");
    return storedUser ? JSON.parse(storedUser) : {};
  });
```

```bash
11 async function getUserLoggedInOnLoad() {
    const userLoggedIn = await userService.getUserLoggedIn();
    setUser(userLoggedIn);
14 }

  return { user };
}
```
to 
```bash
  useEffect(() => {
    if (!user.id_user) {
      userService.getUserLoggedIn();
    }
  }, [user]); 
  return { user };
```

    
### Adding username to Home 
Inside the Page/index.js folder, import the userAuth we did before:
<br>
```bash
import { useAuth } from "../../hooks/useAuth";
```
<br>
Inside the FeedPage() component, we will look for a "logged in" user.
```bash
  const {user} =useAuth()
```

Na line 74 onde esta somente 
```json 
 <FeedTitle>
  74  your <span>feed</span>.
  </FeedTitle>
```
Let's exchange for
```json 
  <FeedTitle>
74    This is Your <span>Feed</span> @{user?.username}!
  </FeedTitle>
```
It is important to leave the question mark "?" so that, if it takes a while to bring information from the API or there is no user, the application will not break. 

# Listing post

### search posts via api
inside the folder **services/post.js**<br>
let's change the function **getAllPosts**

**remover essa parte**
```json
async getAllPosts() {
    return new Promise((resolve, reject) => {
      postsService.populate();
      userService.populate();
      try {
        const postsFromAPI = localStorage.getItem(localStorageKeys.POSTS);
        const postsParsedToJSON = JSON.parse(postsFromAPI);
        resolve(postsParsedToJSON);
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },
```
  **to put this:**
```json
 async getAllPosts() {  
      try {           
        const res = await  api.get(`/post`)               
        const posts = res.data
        return posts;
    } catch (error) {
     console.log(error)
    }
  },
```

## Listing user post quantity 
Still inside the folder **services/post.js**<br>
let's change the function **getPostsByUserId** right underneath getAllPosts
<br>

Let's remove it from within the function...

```json
return new Promise((resolve, reject) => {
      try {
        const postsFromAPI = localStorage.getItem(localStorageKeys.POSTS);
        const postsParsedToJSON = JSON.parse(postsFromAPI);

        const postsByUserId = postsParsedToJSON.filter(
          (currentPost) => currentPost.createdBy.id === userId
        );

        resolve(postsByUserId);
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
```
And add the api call, for when opening the modal
```json
   async getPostsByUserId({ userId }) {
    try {
      const res = await api.get(`/post?user_id=${userId}`)
      return res.data;     
    } catch (error) {
      console.log(error)
    }
  },
```
### Inside the PostList file

Let's import usePosts() which is already created and did not need to be modified:
<br>
And also useAuth() as we will need

```bash
import { usePosts } from "../../hooks/usePosts";

import { useAuth } from "../../hooks/useAuth";
```

Within the Post List component, we will create a spread to get the posts and the user can use them on the page:<br>
```bash
const { posts } = usePosts();

const { user } = useAuth();
```

## Lines that will be modified

## Function **getUserFollows** 
let's change from this...

```json
17:  userId: user.id

21:  [user.id];
```
to this...

```json
17:  userId: user.id_user,

21:  [user.id_user]
```

## Inside the Function **returnPostsFiltered**
let's change some attributes,
Example:

```json
30  userFollows.indexOf(currentPost.createdBy.id) > -1 && 

38  (currentPost) => currentPost.createdBy.id === userIdToFilterPosts

```
to this 

```json
30  userFollows.indexOf(currentPost.user_id) > -1 && 

38  (currentPost) => currentPost?.user_id === userIdToFilterPosts, 
```

## Rendering posts: Important changes
We will need to change some parameters that the card is receiving, as they are not yet present in the database response for now.

keep the question mark in case you are not sending a parameter

```json
49  <div key={currentPost.id}>
    <PostCard
51      postId={currentPost.id}
      type={currentPost.type}//nao tem
53      text={currentPost.text}
54      author={currentPost.author} // nao tem 
      onProfileClick={onProfileClick}
56      createdBy={currentPost.createdBy}//nao tem
57      quoteText={currentPost?.quote?.text}
      quoteUser={currentPost?.quote?.author}
    />

    {index !== posts.length && <Divider />}
  </div>
```

to this...

```json
49 <div key={currentPost.id_post}>
    <PostCard
51      postId={currentPost?.id_post}
      type={currentPost?.type}//nao tem
53      text={currentPost?.post}
54      author={currentPost?.user_id}//user id
      onProfileClick={onProfileClick}
56      createdBy={currentPost?.user_id}//user id 
57      quoteText={currentPost?.post}
      quoteUser={currentPost?.quote?.author}
    />

    {index !== posts.length && <Divider />}
  </div>
```
## Inside the PostCard component folder:

### Creating useStates to store states

```json
 type = "post" // As there is no type in the db, we are putting it at the code level to make it easier. 

  const [userPost, setUserPost ] = useState()//to store poster user information  
  const prevAuthors = useRef(new Set());//To store the ID and avoid an unnecessary call if it already exists.

```
### A useEffect was created to manage these updates
useEffect created right after the states mentioned before.

```json
  useEffect(()=>{
    if (!prevAuthors.current.has(author)) {
      const fetchPosts = async () => {
        try {
          const res = await api.get(`user?id_user=${author}`);
          setUserPost(res.data[0]);
          // Adiciona o ID ao Set de IDs previamente carregados
          prevAuthors.current.add(author);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };  
      fetchPosts();
    }  
  },[author])
```

## Changes that were necessary to make lines.

### Função handleOnClickOverUserProfile  e handleOnClickOverWhoReposted
change in author.id to createdBy

```json
31  onProfileClick(author.id);


35  onProfileClick(createdBy.id);
```
to  this.. 

```json
31  onProfileClick(author);


35  onProfileClick(createdBy);
```
### Change to render post user information..


```json
line 44  
  @{createdBy.username}

line 51
  @{author.username}

line 60 
  @{quoteUser.username}//remember that we do not have this information



Only the way to obtain the ID has changed.
line 67 
  {type === postType.POST && createdBy.id !== user.id &&(...

```
to this...
```json
line 44  
  @{userPost?.username}

line 51
  @{userPost?.username}

line 60 
  @{userPost?.username}


Only the way to obtain the ID has changed.
line 67 
  {type === postType.POST && userPost?.id_user !== user?.id_user && (
```

# Opening modal with post user information

**Receiving information from within userUserinfor Lines that required modifications**

### user information
```json
Line 49 
  <p>{dateFormatter(selectedUser?.createdAt)}</p>
```
to this..
```json
Line 49 
  <p>{dateFormatter(selectedUser?.date_joined)}</p>
```

## Bring information from **useUserInfo** to modal

let's modify some functions
<br/>
   **userFollowers**
<br/>

Let's go to the definition of the function **getUserFollowers** dentro de **services/followers.js**.
<br>

Let's remove from inside the function **getUserFollowers**...

```json
    return new Promise((resolve, reject) => {
      followersService.populate();

      try {
        const followersFromAPI = localStorage.getItem(
          localStorageKeys.FOLLOWERS
        );
        const followersParsedToJSON = JSON.parse(followersFromAPI);

        const userFollowers = followersParsedToJSON.filter(
          (follower) => follower.followingUserId === userId
        );

        resolve(userFollowers);
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  
```
and put

```json
// how many people are following the logged in user.
  async getUserFollowers({ userId }) {
try {
    const res = await api(`userfollowsuser?follows_user_id=${userId}`)
    return res.data
    
} catch (error) {
    console.log(error)
}
},
```

### Still within **services/followers.js**.<br>
Let's get the information from **getWhoUserFollows** as well.
<br>

Let's remove it from within the function...
```json
return new Promise((resolve, reject) => {
    followersService.populate();

    try {
    const followsFromAPI = localStorage.getItem(localStorageKeys.FOLLOWERS);
    const followsParsedToJSON = JSON.parse(followsFromAPI);

    const userFollows = followsParsedToJSON.filter(
        (follower) => follower.followerUserId === userId
    );

    resolve(userFollows);
    } catch (error) {
    reject({ error: "Error to fetch data, try again later." });
    }
});
```
And add the api call inside the function.

```json
 async getWhoUserFollows({ userId }) {
    try {
      const res = await api(`userfollowsuser?user_id=${userId}`)
      return res.data
      
    } catch (error) {
      console.log(error)
    }
  }  
```

# Follow.... start making posts and deletes api

## Add follow or unfollow functions.
Let's create two functions for this inside the modal to make it easier to see.
### **follow**  
```json
  const follow  =async ()=>{    
    const data = {
      user_id: loggedInUser.id_user, //id user
      follows_user_id: selectedUser.id_user, //id dono do post.  
    } 

    try {
      await api.post(`userfollowsuser`,data)
      onCloseModal() //fechando modal 
      toast.success("Successfully Fallow!");    

    } catch (error) {
      console.log(error, "error ao tentar seguir...");
      toast.error("Tray again");
    }   
  }
```

### **unFollow**
```json
 const unfollow  = async ()=>{
     const data = {
      user_id: loggedInUser.id_user,
      follows_user_id: selectedUser.id_user,
    };   
    try {
       await api.delete(`userfollowsuser`,{
        data: data,
       })
       onCloseModal()
       toast.success("Successfully Unfallow!");
     
    } catch (error) {
      console.log(error, "error when unfollowing");
      toast.error("Tray again unfallow");
    }
   
  }

```
Next, let's **remove the followOrUnfollowUser function**
and bring the followers in full.
<br>

Clicking with Ctrl + left button, which takes you to the hook folder **useUserInfo.js** , Inside the folder, we will eliminate two functions **verifyIfIsLoggedInUserFollowing** and **followOrUnfollowUser**
and remove your imports.

 ```json
Line 47 to 51: First function
const verifyIfIsLoggedInUserFollowing = useCallback(async () => {
    const isFollowing = await followersService.isFollowing({
      followerUserId: user.id,
      userIdToCheck: userToGetInfoId,
    });
 ```
 and 
 ```json
 Line 74 to 92: Second function
   async function followOrUnfollowUser() {
    if (isLoggedInUserFollowing) {
      await followersService.unfollow({
        followerUserId: user.id,
        userIdToUnfollow: userToGetInfoId,
      });

      setIsLoggedInUserFollowing(false);
    } else {
      await followersService.follow({
        followerUserId: user.id,
        userIdToFollow: userToGetInfoId,
      });

      setIsLoggedInUserFollowing(true);
    }

    await getAmountOfFollowers();
  }
 ```
### Still within the same folder, we will change the **is Logged In User Following**

```json
Line 16 : const [isLoggedInUserFollowing, setIsLoggedInUserFollowing] = useState(false);
```
 to
```json
const [isLoggedInUserFollowing, setIsLoggedInUserFollowing] = useState([]);//store followers now
```
### Inside the **getAmountO Followers** function, let's put setIsLoggedInUse Following
that has been modified

```json
  const getAmountOfFollowers = useCallback(async () => {
    const followers = await followersService.getUserFollowers({
      userId: userToGetInfoId,
    });
    setIsLoggedInUserFollowing(followers) //stored  followers
    setUserFollowers(followers.length);
  }, [userToGetInfoId]);
```
## Inside modal again.
let's use **setIsLoggedInUserFollowing** to check if the user is following the post owner.<br>
Creating a variable with **some** that returns true or false:

```json  
const isFallow = (isLoggedInUserFollowing ?? []).some(fallow => fallow?.user_id === loggedInUser?.id_user); 
``` 

### Buttom de follow unFollow
```json
Line 73 e 74 
  onClick={followOrUnfollowUser}
  text={isLoggedInUserFollowing ? "Unfollow" : "Follow"}
```
to 

```json
  onClick={isFallow? unfollow: follow}
  text={ isFallow ? "Unfollow" : "Follow"}
```
# Create a post 
###Inside the hook folder, in the **createPost** function
let's change the way the ID is being received and the condition to check how it is coming from the API.

```json
Line 44:  userId: user.id,
});
```
to this...
```json
Line 44 : userId: user.id_user,
```
and
```bash
Line 47 e 48 IF
if (successfullyPosted?.error) {
  toast.error(successfullyPosted?.error);
  return;
}
```
to this..
```bash
Line 47 e 48 IF
if (successfullyPosted?.message) {
  toast.error(successfullyPosted?.message);
  return;
}
```
## Let's now go inside the **postsService.createPost** function
We will have to create a variable to get the Date-time,
Perform a check for empty text and
Modify **postsWithNewPost** to meet API expectations.  

Let's start by installing the date manipulation library. 
```bash
yarn add date-fns
```

### Removing what is not necessary
Remova 
```json
Line 140 const allPosts = await postsService.getAllPosts();
Line 141 const user = await userService.getUserById({ id: userId });

Line 157: localStorage.setItem(
            localStorageKeys.POSTS,
            JSON.stringify(postsWithNewPost)
           );
Line 162: resolve();
Line 164:reject({ error: "Error to add post, try again later." });

```
## Let's create our variables now. 
```bash
import { format } from 'date-fns';
```
<br>
At the beginning of the function I created

```bash
const currentDate = new Date();
const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

if(!postText){
    return { message: "There is no text" };
}
```
### Change postsWithNewPost to APi table
inside try/catch we will change it to
```json 
try {
  const postsWithNewPost = {
    id_post:`${uuidv4()}`,
    post: postText,
    date_time: formattedDate,
    user_id: userId,
  };
    
    const res = await api.post(`post`, postsWithNewPost)
    return res
} catch (error) {
  console.error("Erro na requisição:", error.message);
  return  error
}
```
# Creating **DELETE** post.

###  In the **services/posts.js folder.
Let's create the delete function inside **postsService**.  

```bash
async deletePost({ postId }) {
try {
    const res = await api.delete(`post/${postId}`)
    return res

} catch (error) {
    console.error("Erro na requisição:", error.message);
    return  error
}
```
#### Now inside the **Hooks/usePosts.js** folder 
Let's create **deletePost**, inside **PostsProvider**

```json
  async function deletePost(postId) { 
    const successfullyDeleted = await postsService.deletePost({
      postId,
    });//Function that sends the delete and the toast appears

    if (successfullyDeleted?.message) {
      toast.error(successfullyDeleted?.message);

      return;
    }
    toast.success("Successfully deleted!");
    await fetchPosts();
  }

```

## Inside PostCard/index.js
To maintain the standard, we will create a function for **click Delete** sending the ID,
and imports the **deletePost** function, from within **usePosts**.

```json
async function handleOnClickDeletePost () {
  deletePost(postId)
}
```

### Just below the button where this function **handleOnClickOverUserProfile**
let's create another button to click delete
### ficando assim 
```json 
 {author && (    
   {//start fn click delete
  userPost?.id_user === user?.id_user && (
      <button onClick={handleOnClickDeletePost}>delete</button>
  )
}     
)}
```
### If you want to make a style
Inside the same folder we go to the style.js file

on line 4 inside **PostCardContainer**

let's create a style for the button like this.
```json 
export const PostCardContainer = styled.div`
  padding: 16px;
//style 
  .btnClickDelete {
    display: flex ;
    justify-content: space-between;

    border-radius: 5px;
    padding: 5px 1rem;
    border: none;
    cursor: pointer;
    transition: .2s linear;

    :hover{
      background-color: var(--twitter);
    }
  }
`;
```