 import axios from 'axios'

 const api = axios.create({
    baseURL: 'https://moodmelody-qgnx.onrender.com',
    withCredentials:true
 })

 export async function register({email, username, password}){
    const response = await api.post('/api/auth/register', {username, email, password})
    return response.data
 }    

 export async function login({email, username, password}){
    const response = await api.post('/api/auth/login', {username, email, password})
    return response.data
 }

 export async function getMe(){
    const response = await api.get('/api/auth/get-me')
    return response.data
 }

 export async function logout(){
    const response = await api.post('/api/auth/logout')
    return response.data
 }