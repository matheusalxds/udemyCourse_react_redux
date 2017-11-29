import React, { Component } from 'react';
import axios from 'axios';

import PageHeader from '../template/pageHeader';
import TodoForm from './todoForm';
import TodoList from './todoList';

const URL = 'http://localhost:3003/api/todos';

export default class Todo extends Component{
  constructor(props){
    super(props);

    this.state = {
      description: '',
      list: [],
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleMarkAsDone = this.handleMarkAsDone.bind(this);
    this.handleMarkAsPending = this.handleMarkAsPending.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.refresh();
  }
  refresh(description = ''){
    const search = description ? `&description__regex=/${description}/` : '';
    axios.get(`${URL}?sort=-createdAt${search}`)
      .then(resp => this.setState({...this.setState, description, list: resp.data}));
  }
  handleChange(event){
    this.setState({...this.state, description: event.target.value });
  }
  handleAdd(){
    const description = this.state.description;
    axios.post(URL, { description })
         .then(resp => this.refresh());
  }
  handleRemove(todo){
    axios.delete(`${URL}/${todo._id}`)
    .then(resp => this.refresh(this.state.description))
  }
  handleMarkAsDone(todo){
    axios.put(`${URL}/${todo._id}`, {...todo, done:true })
      .then(resp => this.refresh(this.state.description));
  }
  handleMarkAsPending(todo){
    axios.put(`${URL}/${todo._id}`, {...todo, done:false })
      .then(resp => this.refresh(this.state.description));
  }
  handleSearch(){
    this.refresh(this.state.description);
  }
  handleClear(){
    this.refresh();
  }
  render(){
    return (
      <div>
        <PageHeader 
          name='Task'
          small='Create'
        />
        <TodoForm
          handleAdd={this.handleAdd}
          description={this.state.description}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          handleClear={this.handleClear}
        />
        <TodoList
          list={this.state.list}
          handleMarkAsDone={this.handleMarkAsDone} // will apoint to the func that was created in this
          handleMarkAsPending={this.handleMarkAsPending} // class
          handleRemove={this.handleRemove}
        />
      </div>
    );
  }
}