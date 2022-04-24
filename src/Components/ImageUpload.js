import React, { useState} from 'react';
import './ImageUpload.css';
import axios from './axios';
import {storage} from '../firebase';

const ImageUpload = ({ username}) => {
    const [url,setUrl]= useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    
    //handle change image
    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = ()=>{
        const uploadTask = storage.ref(`image/${image.name}`).put(image);
    uploadTask.on("state_changed",
    (snapshot)=>{
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
    },
    (error)=>{
        console.log(error)   
    },
    ()=>{
        storage.ref("image").child(image.name).getDownloadURL()
            .then((url)=>{
                setUrl(url);
                axios.post('/upload',{
                    caption: caption,
                    user: username,
                    image: url
                })
                setCaption('');
                setProgress(0);
                setImage(null);
            })
    })
    }

    return ( 
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption..." className="imageUpload__input" value={caption} onChange={e => setCaption(e.target.value)} />
            <input className="imageUpload__file" type="file" onChange={handleChange} />
            <button className="imageUpload__button" onClick={handleUpload}>Upload</button>
        </div>
    )
}
export default ImageUpload;