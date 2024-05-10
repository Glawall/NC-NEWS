import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Homepage from './components/Homepage'
import ArticlesList from './components/ArticlesList'
import Article from './components/Article'

function App() {
  const [usernameG, setUsername] = useState("grumpy19")

  return (
    <>
    <Header/>
    <Routes>
      <Route path ='/' element = {<Homepage/>}/>
      <Route path = '/articles' element = {<ArticlesList/>}/>
      <Route path ='/articles/:article_id' element ={<Article usernameG = {usernameG}/>}/>
    </Routes>

    </>
  )
}

export default App
