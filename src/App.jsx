import React from 'react'
import { render } from 'react-dom'
import MonacoEditor from 'react-monaco-editor'

//https://github.com/Microsoft/monaco-editor/blob/master/docs/integrate-esm.md
import { editor } from 'monaco-editor/dev/vs/editor/editor.main.js';

console.log("editor:", editor)

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return require('monaco-editor/esm/vs/language/json/json.worker');
    }
    if (label === 'css') {
      return require('monaco-editor/esm/vs/language/css/css.worker');
    }
    if (label === 'html') {
      return require('monaco-editor/esm/vs/language/html/html.worker');
    }
    if (label === 'typescript' || label === 'javascript') {
      return require('monaco-editor/esm/vs/language/typescript/ts.worker');
    }
    return require('monaco-editor/esm/vs/editor/editor.worker.js');
  }
}

editor.create(document.getElementById('container'), {
  value: [
    'function x() {',
    '\tconsole.log("Hello world!");',
    '}'
  ].join('\n'),
  language: 'javascript'
});


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '// type your code..\nconst x = 23;',
    }
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor)
    editor.focus()
  }
  onChange(newValue, e) {

    console.log('onChange', newValue, e)
  }
  render() {
    const code = this.state.code
    const options = {
      selectOnLineNumbers: true,
      colorDecorators: true,
      rulers: [1,13,27],
      formatOnType: true,
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="css"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    )
  }
}
