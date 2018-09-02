import React, { Component } from "react";
import axios from "axios";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import { Table } from "reactstrap";
import { Collapse, Button, CardBody, Card } from "reactstrap";

class Users extends Component {
  constructor() {
    super();

    this.endpoint = "http://localhost:3000/users/";
  }
  state = {
    users: [],
    newUser: { name: "", email: "" },
    isEditing: false
  };

  componentDidMount() {
    // Ofc, you should use the local not this link
    axios.get(this.endpoint).then(res => {
      this.setState({
        users: res.data
      });
    });
  }

  deleteUser = id => {
    axios.delete(this.endpoint + id).then(res => {
      this.setState({
        users: this.state.users.filter(x => x.id !== id)
      });
    });
  };

  edit = user => {
    this.setState({
      isEditing: true,
      newUser: user
    });
  };

  saveUser = () => {
    axios
      .put(this.endpoint + this.state.newUser.id, this.state.newUser)
      .then(res => {
        this.setState({
          newUser: { name: "", email: "" },
          isEditing: false,
          users: this.state.users.map(u => {
            if (u.id === res.data.id) {
              return res.data;
            }
            return u;
          })
        });
      });
  };

  addUser = userData => {
    axios.post(this.endpoint, this.state.newUser).then(res => {
      this.setState({
        users: [...this.state.users, res.data],
        newUser: { name: "", email: "" }
      });
    });
  };

  cancelEdit = () => {
    this.setState({
      newUser: { name: "", email: "" },
      isEditing: false
    });
  };

  render() {
    return (
      <div className="row">
        <div className="d-flex UserForm my-wrap-flex col-12 pl-0">
          <InputGroup className="nameInput my-4 mr-4 ml-0 pl-0 col-lg-4 col-10">
            <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
            <Input
              value={this.state.newUser.name}
              onChangeCapture={e => {
                this.setState({
                  newUser: { ...this.state.newUser, name: e.target.value }
                });
              }}
              placeholder="Username"
            />
          </InputGroup>
          <InputGroup className="emailInput my-4 mr-4 ml-0 pl-0 col-lg-4 col-10">
            <InputGroupAddon addonType="prepend">Email</InputGroupAddon>
            <Input
              value={this.state.newUser.email}
              onChangeCapture={e => {
                this.setState({
                  newUser: { ...this.state.newUser, email: e.target.value }
                });
              }}
              placeholder="Email"
            />
          </InputGroup>
          {this.state.isEditing ? (
            <div>
              <Button
                onClick={this.saveUser}
                className="SubmitButton my-4 mr-4 ml-0"
                color="warning"
              >
                Update
              </Button>
              <Button
                onClick={this.cancelEdit}
                className="SubmitButton my-4 mr-4 ml-0"
                color="primary"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={this.addUser}
              className="SubmitButton my-4 mr-4 ml-0"
              color="success"
            >
              Submit
            </Button>
          )}{" "}
        </div>{" "}
        <Table className="table-responsive-sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((x, i) => (
              <tr key={i}>
                <td>{x.id}</td>
                <td>{x.name}</td>
                <td>{x.email}</td>
                <td>
                  <button
                    className="btn btn-warning mr-3"
                    onClick={() => this.edit(x)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => this.deleteUser(x.id)}
                    className="btn-danger btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Users;
