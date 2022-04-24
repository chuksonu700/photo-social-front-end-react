import React,{useState,useEffect} from 'react'
import './App.css';
import Post from './Components/Post';
import {auth} from './firebase'
import Pusher from 'pusher-js';

//Modal
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input } from '@material-ui/core';
import ImageUpload from './Components/ImageUpload';
import axios from './Components/axios';

function getModalStyle(){
    const top=50;
    const left=50;

    return {
        top:`${top}%`,
        left:`${left}%`,
        transform:`translate(-${top}%,-${left}%)`,
    };
}

const useStyles= makeStyles((theme)=>({
    paper:{
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}))

const pusher = new Pusher('a0ea558e7f5786585760', {
    cluster: 'us2'
   });

function App(){
    const classes = useStyles();
    const [modalStyle]= React.useState(getModalStyle);
    const [open,setOpen]=useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user,setUser]=useState(null);
    const [openSignIn,setOpenSignIn]= useState(false);
    const [post,setPost]= useState([])

    const fetchPosts = async()=>{
        await axios.get("/sync").then((res)=>{setPost(res.data)})
    }
    useEffect(() => {
        const channel = pusher.subscribe('posts');
        channel.bind('inserted', (data) => {
        fetchPosts()
        });
        }, [])
        
    useEffect(() => {
        fetchPosts()
        },[])

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(authUser=>{
            if(authUser){
                console.log(authUser);
                setUser(authUser);
            } else{
                setUser(null)
            }
        })
        return ()=>{
            unsubscribe()
        }
    },[user,username])
    const signUp =(e)=>{
        e.preventDefault()
        auth.createUserWithEmailAndPassword(email,password)
        .then(authUser =>authUser.user.updateProfile({displayName:username}))
        .catch(error => alert(error.message))
    }
    const signIn =(e)=>{
        e.preventDefault()
        auth.signInWithEmailAndPassword(email,password)
        .catch(error => alert(error.message))
        setOpenSignIn(false)
    }

    return(
        <div className='app'>
            <Modal open={open} onClose={()=>setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                     <form className="app__signup">
                        <center>
                        <img className="app__headerImage" src="logo512.png" alt="Header" />
                        </center>
                        <Input placeholder="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        <Input placeholder="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button type="submit" onClick={signUp}>Sign Up</Button>
                     </form>
                </div>
            </Modal>
            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                    <div style={modalStyle} className={classes.paper}>
                        <form className="app__signup">
                            <center>
                                <img className="app__headerImage" src="logo512.png" alt="Header" />
                            </center>
                            <Input placeholder="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                            <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            <Button type="submit" onClick={signIn}>Sign In</Button>
                        </form>
                   </div>
                </Modal>
            <div className='app__header'>
                <img src='logo512.png' alt='App Header' className='app__headerImage'/>
                {   user   ?   <Button onClick={()=>auth.signOut()} >logout</Button>
                        : (
                            <div className='app_loginContainer'>
                                <Button onClick={()=>setOpen(true)} >Sign Up</Button>
                                <Button onClick={()=>setOpenSignIn(true)} >Sign In</Button>
                            </div>
                          )
            }
            </div>
            
            <div className='app__posts'>
                {
                    post.map(post=>{
                        return(
                            <Post key={post._id}
                            username={post.user}
                            caption={post.caption}
                            imageUrl={post.image} />
                        )
                    })
                }
            </div>
            {
                user?.displayName?<ImageUpload username={user.displayName}/>:<h3 className='app__notLogin'>Need to login to upload</h3>
            }
        </div>
    )
}

export default App;