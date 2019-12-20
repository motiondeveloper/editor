import React from 'react';
import './App.css';
import Editor from '@monaco-editor/react';
import defaultCode from './defaultCode';

function App() {
  return (
    <Editor height="100vh" theme="dark" language="javascript" value={defaultCode} options={{ minimap: {enabled: false} }}/>
  );
}

export default App;
