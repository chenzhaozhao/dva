import React from 'react'
import App from './app'

function RouterConfig({ history, app }) {
  const all = { app, history }
  return (
    <App {...all}  />
  )
}

export default RouterConfig
