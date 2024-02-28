
# 🛜mini twitter : lucas polizeli

### github:  https://github.com/lucaspolizeli

### Este projeto consiste em criar um pequeno pôster para mostrar a fácil integração da API PythonREST ao listar conteúdo, buscar e realizar cadastros.

### Como rodar o projeto
- [Front end](#front-end)
<br>
# Front-end

## Como rodar a parte do Front end
- Renomear a pasta **_env_exmple para .env_**.
- Dentro da pasta **.env** colocar a URL base do db.
REACT_APP_BACKEND_URL= "db_url"
- Dentro da pasta **.env** colocar o id do user criado 
REACT_APP_LOGGED_USER_ID= uuid ou id 
- Abrir terminal
- Rode comando $ **yarn install**
- Comando para rodar o app $ **yarn dev**
<br>


## Installando axios para usar api
<code>yarn add axios</code>

### Dentro de **src** crie uma pasta com nome api arquivo axios.js
dentro dele vamos criar nossa instancia do axios para ser usada em qualquer lugar projeto 
```json
import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL

export const api = axios.create({
    baseURL: baseURL,
    // timeout: 5000,
    headers: {"Content-Type": "application/json"},
})
```
# Mudanças do User .
### buscando user api.
Dentro do arquivos de <strong>services/user.js</strong>
na função  **getUserLoggedIn()**<br>

vamos remover essa parte 
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
#### Para buscar user na API  
E utilizando o get junto com o uuid do .env

```json
  //fn para fazer login
async getUserLoggedIn() {            
      const {data} = await api.get(`user?id_user=${process.env.REACT_APP_LOGGED_USER_ID }`);   

      localStorage.setItem("user_logged", JSON.stringify(data[0]));
  },
```
Aqui, faremos a configuração no localStorage para evitar buscas frequentes na API. Não há informações sensíveis envolvidas

### dentro da pasta Hook userAuth.js 
Aqui, vamos ter que mudar a forma como estamos obtendo o usuário, que atualmente é feito por meio de userService.getUserLoggedIn. No entanto, para evitar chamadas desnecessárias, vamos alterar o método

na linha 5 o user state({})

e remover a função getUserLoggedInOnLoad() linha 11 a 14

```json
export function useAuth() {
5  const [user, setUser] = useState({});

  useEffect(() => {
    getUserLoggedInOnLoad();
  }, []);

11 async function getUserLoggedInOnLoad() {
    const userLoggedIn = await userService.getUserLoggedIn();
    setUser(userLoggedIn);
14 }

  return { user };
}
```
para função onde buscar dentro localStorage 
    
```json
export function useAuth() {
 5 const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user_logged");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  useEffect(() => {
    // Se o usuário não está presente no localStorage, busca na API
    if (!user.id_user) {
      userService.getUserLoggedIn();
    }
  }, [user]);
  //retorna o user para ser usado em qualquer lugar 
  return { user };
}
```
### Colocando nome do user na Home 
Dentro da pasta Page, importe o userAuth que fizemos antes:
<br>
<code>import { useAuth } from "../../hooks/useAuth";</code>
<br>
Dentro da função FeedPage(), vamos buscar nosso usuário "logado".

<code>
  const {user} =useAuth()
</code>

Na linha 74 onde esta somente 
```json 
 <FeedTitle>
  74    your <span>feed</span>.
  </FeedTitle>
```
Vamos trocar por 

```json 
  <FeedTitle>
74    This is Your <span>Feed</span> @ {user?.username}!
  </FeedTitle>
```
É importante deixar a interrogação "?" para que, caso demore para trazer da API ou não haja usuário, não quebre a aplicação. 

# Listando post 

### buscar posts pela api 
dentro da pasta **services/post.js**<br>
vamos mudar a função **getAllPosts**

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
  **para colocar essa:**
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

## Listando  quantiade post do user 
Ainda dentro da pasta **services/post.js**<br>
vamos mudar a função **getPostsByUserId** logo embaixo de  getAllPosts
<br>

Vamos remover de dentro da função...
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
E adicionar a chamda da api, para quando for abrir o modal 
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

### dentro do arquivo PostList 

Vamos importar o usePosts() que já está criado e não precisou ser modificado: <br>
E também o useAuth() pos vamos precisar 

<code> import { usePosts } from "../../hooks/usePosts";</code>
<br>
<code>import { useAuth } from "../../hooks/useAuth";</code>

Dentro do componente PostList, faremos um spreed para pegar os posts e user utilizá-los na página:<br>
<code> const { posts } = usePosts();</code><br>
<code> const { user } = useAuth();</code>

## Linhas que vamo ser modificadas:

## Função **getUserFollows** 
na linha 17 e 21 vamos trocar

```json
17:  userId: user.id

21:  [user.id];
```
para 

```json
17:  userId: user.id_user,

21:  [user.id_user]
```

## Função **returnPostsFiltered**
na linha 30 dentro do indexOf(currentPost.createdBy.id) para .user_id.
<br>
na linha 38 dentro do filter novamente faze o mesmo 
<br>
Exemplo :

```json
30  userFollows.indexOf(currentPost.createdBy.id) > -1 && 

38  (currentPost) => currentPost.createdBy.id === userIdToFilterPosts

```
para 

```json
30  userFollows.indexOf(currentPost.user_id) > -1 && 

38  (currentPost) => currentPost?.user_id === userIdToFilterPosts, 
```

## Renderizando posts: Mudanças importantes

Vamos precisar alterar alguns parâmetros que o card está recebendo, pois ainda não estão presentes na resposta do banco de dados por enquanto.

mantenha a interrogação para o caso de não estar enviando algum parâmetro
foi mudado a forma de passar das linhas marcadas 

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

mudou para 

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
## Dentro da pasta PostCard: 

### Criando useStates para armazenar stados 

```json
 type = "post" // como no db não vem type estamos colocando a  nivel de codigo para facilitar.  

  const [userPost, setUserPost ] = useState()//para armazenar as informações do user do poster  
  const prevAuthors = useRef(new Set());// Para armazenar o ID e evitar uma chamada desnecessária caso já exista.

```
### Foi criado um useEffect para gerenciar essas atualizações 
useEffect criado logo depois dos estados mencionados antes.

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
          console.error("Erro ao buscar dados do usuário:", error);
        }
      };  
      fetchPosts();
    }  
  },[author])
```

## Mudanças que foram necessárias fazer linhas.

## Função handleOnClickOverUserProfile <br> e<br> handleOnClickOverWhoReposted
mudança no author.id para  createdBy

```json
31  onProfileClick(author.id);


35  onProfileClick(createdBy.id);
```
para 

```json
31  onProfileClick(createdBy);


35  onProfileClick(createdBy);
```
### Mudança para renderizar as informações do usuário do post.


```json
linha 44  
  @{createdBy.username}
para
  @{userPost?.username}

linha 51
  @{author.username}
para 
  @{userPost?.username}

linha 60 
  @{quoteUser.username}//lembrando que nao temos essa informação
para
  @{userPost?.username}


Foi alterada apenas a forma de obter o ID.
linha 67 
  {type === postType.POST && createdBy.id !== user.id &&(...
para
  {type === postType.POST && userPost?.id_user !== user?.id_user && (

```

## Abrindo modal com informações do usuário do post

### Recebendo informações de dentro do **userUserinfor**

## Linhas que foram necessárias fazer modificações

### informação user
```json
Linha 49 
  <p>{dateFormatter(selectedUser?.createdAt)}</p>
para
  <p>{dateFormatter(selectedUser?.date_joined)}</p>
```

## Trazer as informações de dentro de **useUserInfo** para modal 

Linha 54 dentro da função **userFollowers**
<br>

Vamos na definição da função  **getUserFollowers** dentro de **services/followers.js**.
<br>

Vamos remover de dentro da função **getUserFollowers**...

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

Adicionar a chamada da api 

```json
  // quantas pessoas estão seguindo o usuário logado.
  async getUserFollowers({ userId }) {
    try {
      const res = await api(`userfollowsuser?follows_user_id=${userId}`)
      return res.data
      
    } catch (error) {
      console.log(error)
    }
  },
```

### Ainda dentro de **services/followers.js**.<br>
Vamos buscar as informações do **getWhoUserFollows** também.<br>

Vamos remover de dentro da função...
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
E adionar a chamada da api dentro da função .

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

# Follow.... começar a fazer os post e delete

## Adicionar funções follow ou Unfollow.
Vamos criar duas funções para isso dentro do modal para facilitar a visualização.
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
      console.log(error, "error ao deixa de seguir seguir...");
      toast.error("Tray again unfallow");
    }
   
  }

```
Em seguida, vamos **remover a função followOrUnfollowUser** 
e trazer os seguidores por completo.<br>
Clicando com Ctrl + botão esquerdo, que leva para a pasta hook **useUserInfo.js**<br>
Dentro da pasta, vamos eliminar duas funções **verifyIfIsLoggedInUserFollowing** e **followOrUnfollowUser** 
e remover seus imports.

 ```json
Linha 47 a 51: Primeira função 
const verifyIfIsLoggedInUserFollowing = useCallback(async () => {
    const isFollowing = await followersService.isFollowing({
      followerUserId: user.id,
      userIdToCheck: userToGetInfoId,
    });

 Linha 74 a 92: Segunda função
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
### Ainda dentro da mesma pasta vamos mudar o **isLoggedInUserFollowing**

```json
Linha 16 : const [isLoggedInUserFollowing, setIsLoggedInUserFollowing] = useState(false);
  para
const [isLoggedInUserFollowing, setIsLoggedInUserFollowing] = useState([]);//armazenar followers agora 
```
### Dentros da função **getAmountOfFollowers**, vamos colocar o setIsLoggedInUserFollowing

que foi modificado 

```json
  const getAmountOfFollowers = useCallback(async () => {
    const followers = await followersService.getUserFollowers({
      userId: userToGetInfoId,
    });
    setIsLoggedInUserFollowing(followers) //armazenado  followers
    setUserFollowers(followers.length);
  }, [userToGetInfoId]);

```
## Dentro modal novamente. 
vamos usar os  **setIsLoggedInUserFollowing** para verificar se o usuário está seguindo o dono do post.<br> 
Criando uma variável com **some** que retorna true ou false:

```json  
const isFallow = (isLoggedInUserFollowing ?? []).some(fallow => fallow?.user_id === loggedInUser?.id_user); 
``` 
### Buttom de follow unFollow
```json
Linha 73 e 74 
  onClick={followOrUnfollowUser}
  text={isLoggedInUserFollowing ? "Unfollow" : "Follow"}
```
para 

```json
  onClick={isFallow? unfollow: follow}
  text={ isFallow ? "Unfollow" : "Follow"}
```




# Criar um post  
### Dentro da pasta hook, na função  **createPost**
vamos alterar a forma como o ID está sendo recebido e a condição para verificar como está vindo da API.

```json
linha 44:  userId: user.id,
});

e

Linha 47 e 48 IF
if (successfullyPosted?.error) {
  toast.error(successfullyPosted?.error);
  return;
}
```` 
para

```json

linha 44 : userId: user.id_user,

Linha 47 e 48 IF
if (successfullyPosted?.message) {
  toast.error(successfullyPosted?.message);
  return;
}
```
## Vamos agora para dentro da função **postsService.createPost**
Vamos ter que criar uma variável para obter o Date-time.<br>
Realizar uma verificação para o texto vazio. <br>
Modificar o **postsWithNewPost** para atender às expectativas da API.  

Vamos começar instalando a biblioteca para manipulação de datas. <code>yarn add date-fns</code>

### Removendo o que não é necessário 
Remova 
```json
Linha 140 const allPosts = await postsService.getAllPosts();
Linha 141 const user = await userService.getUserById({ id: userId });

linha 157: localStorage.setItem(
            localStorageKeys.POSTS,
            JSON.stringify(postsWithNewPost)
           );

Linha 162: resolve();

linha 164:reject({ error: "Error to add post, try again later." });

```
## Vamos criar nossas variáveis agora. 
importe <code>import { format } from 'date-fns';</code>
<br>
No começo da função crie: 

```json
const currentDate = new Date();
const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

if(!postText){
    return { message: "There is no text" };
  }

```
### Mudar o postsWithNewPost para tabela APi
dentro do try/catch
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

# Criando  **DELETE** post.

###  Na pasta **services/posts.js.
vamos criar  a função de delete dentro do **postsService**.
<br>  

```json
  async deletePost({ postId }) {
    try {
      const res = await api.delete(`post/${postId}`)
      return res

    } catch (error) {
      console.error("Erro na requisição:", error.message);
      return  error
    }
  }

```
#### Agora dentro da pasta **Hooks/usePosts.js**
Vamos criar o **deletePost**, dentro do **PostsProvider**
<br>

```json

  async function deletePost(postId) { 
    const successfullyDeleted = await postsService.deletePost({
      postId,
    });//Função que envia o delete e aparece o toast

    if (successfullyDeleted?.message) {
      toast.error(successfullyDeleted?.message);

      return;
    }
    toast.success("Successfully deleted!");
    await fetchPosts();
  }

```

## Dentro de PostCard/index.js 
Para manter o padrão vamos criar um função para o **click Delete** enviando o ID.
<br>

e importa a função **deletePost**, de dentro do **usePosts**.

```json
async function handleOnClickDeletePost () {
  deletePost(postId)
}
```

### Logo abaixo do button onde esta afunção **handleOnClickOverUserProfile**
vamos Criar um outro Button para o click do delete 
###ficando assim 
```json 
 {author && (    
    <UserNameTextButton onClick={handleOnClickOverUserProfile}>
      <div className="">
        @{userPost?.username}
      </div>
      
    </UserNameTextButton>      
)}//end fn click modal 

{//start fn click delete
  userPost?.id_user === user?.id_user && (
      <button onClick={handleOnClickDeletePost}>delete</button>
  )
}
```
### Caso queira fazer uma styles pra nao ficar so jogado 
Dentro da mesma pasta vamos no arquivo style.js

na linha 4 dentro de **PostCardContainer**

vamos criar um stilo para o button ficando assim. 
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
