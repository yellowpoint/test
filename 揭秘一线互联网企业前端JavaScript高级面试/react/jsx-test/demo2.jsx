import React, { Component } from 'react'
import List from './list/index.js'
import Input from './input/index.js'
class Todo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [12,2,3]
    }
  }
  render() {
    return (
      <div>
        <p>this is demo2</p>
        <Input addTitle={this.addTitle.bind(this)}/>
        <List data={this.state.list}/>
      </div>

      )
  }
  // jsx babel之后
  // render() {
  //   return React.createElement(
  //     'div',
  //     null,
  //     React.createElement(
  //       'p',
  //       null,
  //       'this is demo2'
  //     ),
  //     React.createElement(Input, { addTitle: this.addTitle.bind(this) }),
  //     React.createElement(List, { data: this.state.list })
  //   );
  // }
  // 这里的Input就是个构造函数 class

  addTitle(title){
    const currentList =  this.state.list
    this.setState({
      list: currentList.concat(title)
    })
  }
}

export default Todo