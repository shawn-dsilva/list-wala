import React, { Component } from 'react'
import {
  Card,
  CardTitle,
  CardHeader,
  CardSubtitle,
  CardBody,
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  Input,
  Button
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from 'react-moment';
import 'moment-timezone'
import { createNewTodo, deleteOneTodo, getOneTodo } from "../actions/listActions";
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import TodoModal from './TodoModal';

export class SingleList extends Component {

  state = { isOpen: false };

  static propTypes = {
    currList: PropTypes.object.isRequired,
    currTodo: PropTypes.object.isRequired,
    createNewTodo: PropTypes.func.isRequired,
    deleteOneTodo: PropTypes.func.isRequired,
  };

  statusRender = (status) => {
    switch (status) {
      case "Done":
        status = "Done";
        return (
            <span className="text-left badge badge-success">
              {status}
            </span>
        );
      case "InProgress":
        status = "In Progress";
        return (
            <span className="text-left badge badge-warning">
              {status}
            </span>
        );
      case "NotStarted":
        status = "Not Started";
        return (
            <span className="text-left badge badge-danger">
              {status}
            </span>
        );
    }
  }

  onDelete = ( listId, todoId, event ) => {
    event.stopPropagation();
    this.props.deleteOneTodo(listId, todoId);
  }

  todoModal = ( listId, todoId, event ) => {
    event.stopPropagation();
     if (this.props.currTodo._id !== todoId ) {
      this.props.getOneTodo(listId, todoId);
     }
    this.toggle();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    const currList = this.props.currList;
    e.preventDefault();
    const {listName} = this.state;

    this.props.createNewTodo(currList._id, listName);
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const currList = this.props.currList;
    return (
      <Card className=" w-75 listStyle">
        <CardBody >
        <CardTitle><h1>{this.props.currList.name}</h1></CardTitle>
        <CardSubtitle><h5 className="text-muted">Select a todo or  create a new todo to get started </h5></CardSubtitle>
            <br/>
          <ListGroup>
          <br/>
            <br/>
            {
              currList.todos.map( (todo) =>
              <ListGroupItem  className=" my-3 todoStyle d-flex flex-row align-items-center justify-content-between" key={todo._id} onClick={this.todoModal.bind(this, currList._id, todo._id)}>
              <CardHeader>
              <h2 className=" font-weight-bold ">{todo.name}</h2>
              <span className="text-muted">
                <Moment  className="pr-3" date={todo.date} format="MMM DD YYYY"></Moment>
              <Button className="float-right" color="danger" size="md" onClick={this.onDelete.bind(this, currList._id, todo._id)}> <FontAwesomeIcon icon={faTrashAlt} /></Button>
              </span>
              </CardHeader>
              <br/>
              <br/>
              <CardBody className="px-3" >
              <h5 className ="text-left font-weight-bold">Description</h5>
              { !todo.desc ? <p className="text-left">No Description Given.</p> : <p className="text-left w-75 text-muted">{todo.desc}</p> }
              <br/>
              <h5 className ="text-left font-weight-bold">Status &nbsp;
              {
                this.statusRender(todo.status)
              }
              </h5>
              </CardBody>
              </ListGroupItem>

              )
            }
            <br/>
            <br/>
          </ListGroup>

          {Object.keys(this.props.currTodo).length !== 0  ? ( <TodoModal modal={this.state.isOpen} toggle={this.toggle} list={this.props.currList} todo={this.props.currTodo} checklist={this.props.currTodo.checklist}></TodoModal>):null}



          <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Input
                  type='text'
                  name='listName'
                  id='listName'
                  placeholder='Name'
                  className='w-75 mx-auto mb-4'
                  size='lg'
                  onChange={this.onChange}
                  autoComplete="off"
                />
      <Button className="w-75" size="lg" color="primary"> <FontAwesomeIcon icon={faPlus} /> &nbsp; Add a New ToDo </Button>
              </FormGroup>
            </Form>
        </CardBody>
      </Card>
    )
  }
}


const mapStateToProps = (state) => ({ //Maps state to redux store as props
  currList: state.list.currList,
  currTodo: state.list.currTodo,
});

export default connect(mapStateToProps, { createNewTodo, deleteOneTodo, getOneTodo })(SingleList);