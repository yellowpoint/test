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
        <Input addTitle={this.addTitle.bind(this)}/>
        <List data={this.state.list}/>
      </div>

      )
  }
  addTitle(title){
    const currentList =  this.state.list
    console.log('currentList',currentList)
    this.setState({
      list: currentList.concat(title)
    })
    console.log('this.state.list',this.state.list)
  }
}

export default Todo