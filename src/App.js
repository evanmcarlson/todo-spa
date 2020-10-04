import React, { Component } from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todo: [],
            newTaskData: {
                text: '',
                checked: false
            },
            editTaskData: {
                id: null,
                text: '',
                checked: null
            },
            newTaskModal: false,
            editTaskModal: false
        }
    }

/* get specific object by id and replace only one object */
/* our approach: recall the server for all the books and update the list */

    componentDidMount() {
        this._refreshTasks();
    }

    toggleNewTaskModal() {
        this.setState({
            newTaskModal: !this.state.newTaskModal
        });
    }

    toggleEditTaskModal() {
        this.setState({
            editTaskModal: !this.state.editTaskModal
        });
    }

    addTask() {
        axios.post('https://p4s3y54ln0.execute-api.us-east-1.amazonaws.com/dev/todos', this.state.newTaskData).then((response) => {
            let { todo } = this.state;
            todo.push(response.data);
            this.setState({ todo, newTaskModal: false, newTaskData: {
                text: '',
                checked: false
            }});
        });
    }

    updateTask() {
        let { text, checked } = this.state.editTaskData;
        axios.put('https://p4s3y54ln0.execute-api.us-east-1.amazonaws.com/dev/todos/' + this.state.editTaskData.id, { text, checked }).then((response) => {
            /* to optimize for performance, get specific object by id and replace only one object */
            /* for now, we are recalling the server for all the books to update the list */
            this._refreshTasks();
            this.setState({
                editTaskModal: false, editTaskData: { id: null, text: '', checked: null }
            })
        });
    }

    editTask(id, text, checked) {
        this.setState({
            editTaskData: { id, text, checked }, editTaskModal: !this.state.editTaskModal
        });
    }

    _refreshTasks() {
        axios.get('https://p4s3y54ln0.execute-api.us-east-1.amazonaws.com/dev/todos').then((response) => {
            this.setState({
                todo: response.data
            })
        });
    }

    deleteTask(id) {
        axios.delete('https://p4s3y54ln0.execute-api.us-east-1.amazonaws.com/dev/todos/' + id).then((response) => {
            this._refreshTasks();
        });
    }

    render() {
        let todo = this.state.todo.map((task) => {
            return (
                <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.text}</td>
                    <td>{task.checked.toString()}</td>
                    <td>
                        <Button color="warning" size="sm" className="mr-2" onClick={this.editTask.bind(this, task.id, task.text, task.checked)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteTask.bind(this, task.id)}>Delete</Button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="App container">
                <h2>To Do List</h2>
                <h1>test</h1>

                <Button className="my-3" color="primary" onClick={this.toggleNewTaskModal.bind(this)}>Add Task</Button>

                <Modal isOpen={this.state.newTaskModal} toggle={this.toggleNewTaskModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewTaskModal.bind(this)}>Add a new task</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="task">Task</Label>
                            <Input id="task" value={this.state.newTaskData.text} onChange={(e) => {
                                let { newTaskData } = this.state;
                                newTaskData.text = e.target.value;
                                this.setState({ newTaskData });
                            }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addTask.bind(this)}>Add Task</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewTaskModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.editTaskModal} toggle={this.toggleEditTaskModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditTaskModal.bind(this)}>Edit a task</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="task">Task</Label>
                            <Input id="task" value={this.state.editTaskData.text} onChange={(e) => {
                                let { editTaskData } = this.state;
                                editTaskData.text = e.target.value;
                                this.setState({ editTaskData });
                            }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateTask.bind(this)}>Edit Task</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditTaskModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Text</th>
                            <th>Completed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todo}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default App;
