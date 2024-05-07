import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Homepage from './components/Homepage'
import ArticlesList from './components/ArticlesList'

function App() {

  return (
    <>
    <Header/>
    <Routes>
      <Route path ='/' element = {<Homepage/>}/>
      <Route path = '/articles' element = {<ArticlesList/>}/>
    </Routes>

    </>
  )
}

export default App
