import React, { Component } from "react";
import axios from "axios";
import { InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { Table } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

class Posts extends Component {
  constructor() {
    super();

    this.endpoint = "http://localhost:3000/posts/";
  }
  state = {
    posts: [],
    newPost: { title: "", body: "", userId: "", categoryId: "" },
    isEditing: false
  };

  componentDidMount() {
    // Ofc, you should use the local not this link
    axios.get(this.endpoint).then(res => {
      this.setState({
        posts: res.data
      });
    });
  }

  deletePost = id => {
    axios.delete(this.endpoint + id).then(res => {
      this.setState({
        posts: this.state.posts.filter(x => x.id !== id)
      });
    });
  };

  edit = post => {
    this.setState({
      isEditing: true,
      newPost: post
    });
  };

  savePost = () => {
    axios
      .put(this.endpoint + this.state.newPost.id, this.state.newPost)
      .then(res => {
        this.setState({
          newPost: { title: "", body: "", userId: "", categoryId: "" },
          isEditing: false,
          posts: this.state.posts.map(u => {
            if (u.id === res.data.id) {
              return res.data;
            }
            return u;
          })
        });
      });
  };

  addPost = postData => {
    axios.post(this.endpoint, this.state.newPost).then(res => {
      this.setState({
        posts: [...this.state.posts, res.data],
        newPost: { title: "", body: "", userId: "", categoryId: "" }
      });
    });
  };

  cancelEdit = () => {
    this.setState({
      newPost: { title: "", body: "", userId: "", categoryId: "" },
      isEditing: false
    });
  };

  render() {
    return (
      <div className="row">
        <div className="d-flex my-wrap-flex UserForm">
          <InputGroup className="nameInput pl-0 my-4 mr-4 ml-0 col-lg-3 col-10 ">
            <InputGroupAddon addonType="prepend">User ID</InputGroupAddon>
            <Input
              value={this.state.newPost.userId}
              onChangeCapture={e => {
                this.setState({
                  newPost: { ...this.state.newPost, userId: e.target.value }
                });
              }}
              placeholder="User Id"
            />
          </InputGroup>
          <InputGroup className="emailInput pl-0 my-4 mr-4 ml-0 col-lg-4 col-10">
            <InputGroupAddon addonType="prepend">Category ID</InputGroupAddon>
            <Input
              value={this.state.newPost.categoryId}
              onChangeCapture={e => {
                this.setState({
                  newPost: { ...this.state.newPost, categoryId: e.target.value }
                });
              }}
              placeholder="Category ID"
            />
          </InputGroup>
          <InputGroup className="textInput pl-0 my-4 mr-4 ml-0 col-lg-8 col-10">
            <InputGroupAddon addonType="prepend">Title</InputGroupAddon>
            <Input
              value={this.state.newPost.title}
              onChangeCapture={e => {
                this.setState({
                  newPost: { ...this.state.newPost, title: e.target.value }
                });
              }}
              placeholder="Title"
            />
          </InputGroup>
          <InputGroup className="textInput pl-0 my-4 mr-4 ml-0 col-lg-8 col-10">
            <InputGroupAddon addonType="prepend">Body</InputGroupAddon>
            <Input
              value={this.state.newPost.body}
              onChangeCapture={e => {
                this.setState({
                  newPost: { ...this.state.newPost, body: e.target.value }
                });
              }}
              placeholder="Body"
              type="textarea"
              name="text"
              id="exampleText"
            />
          </InputGroup>
          {this.state.isEditing ? (
            <div>
              <Button
                onClick={this.savePost}
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
              onClick={this.addPost}
              className="SubmitButton my-4 mr-4 ml-0"
              color="success"
            >
              Submit
            </Button>
          )}{" "}
        </div>{" "}
        <Table striped>
          <thead>
            <tr>
              <th>Id</th>
              <th>User ID</th>
              <th>Category ID</th>
              <th>Title</th>
              <th>Body</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((x, i) => (
              <tr key={i}>
                <td>{x.id}</td>
                <td>{x.userId}</td>
                <td>{x.categoryId}</td>
                <td>{x.title}</td>
                <td>{x.body}</td>
                <td>
                  <button
                    className="btn btn-warning mr-3 mb-1"
                    onClick={() => this.edit(x)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => this.deletePost(x.id)}
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
export default Posts;
