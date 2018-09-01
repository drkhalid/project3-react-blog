import React, { Component } from "react";
import axios from "axios";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import { Table } from "reactstrap";
import { Collapse, Button, CardBody, Card } from "reactstrap";

class Comments extends Component {
  constructor() {
    super();

    this.endpoint = "http://localhost:3000/comments/";
  }
  state = {
    comments: [],
    newComment: { userId: "", body: "", postId: "" },
    isEditing: false
  };

  componentDidMount() {
    // Ofc, you should use the local not this link
    axios.get(this.endpoint).then(res => {
      this.setState({
        comments: res.data
      });
    });
  }

  deleteComment = id => {
    axios.delete(this.endpoint + id).then(res => {
      this.setState({
        comments: this.state.comments.filter(x => x.id !== id)
      });
    });
  };

  edit = comment => {
    this.setState({
      isEditing: true,
      newComment: comment
    });
  };

  saveComment = () => {
    axios
      .put(this.endpoint + this.state.newComment.id, this.state.newComment)
      .then(res => {
        this.setState({
          newComment: { userId: "", body: "", postId: "" },
          isEditing: false,
          comments: this.state.comments.map(u => {
            if (u.id === res.data.id) {
              return res.data;
            }
            return u;
          })
        });
      });
  };

  addComment = commentData => {
    axios.post(this.endpoint, this.state.newComment).then(res => {
      this.setState({
        comments: [...this.state.comments, res.data],
        newComment: { userId: "", body: "", postId: "" }
      });
    });
  };

  cancelEdit = () => {
    this.setState({
      newComment: { userId: "", body: "", postId: "" },
      isEditing: false
    });
  };

  render() {
    return (
      <div className="row">
        <div className="d-flex UserForm">
          <InputGroup className="nameInput my-4 mr-4 ml-0">
            <InputGroupAddon addonType="prepend">User ID</InputGroupAddon>
            <Input
              value={this.state.newComment.userId}
              onChangeCapture={e => {
                this.setState({
                  newComment: {
                    ...this.state.newComment,
                    userId: e.target.value
                  }
                });
              }}
              placeholder="User ID"
            />
          </InputGroup>
          <InputGroup className="emailInput my-4 mr-4 ml-0">
            <InputGroupAddon addonType="prepend">Post ID</InputGroupAddon>
            <Input
              value={this.state.newComment.postId}
              onChangeCapture={e => {
                this.setState({
                  newComment: {
                    ...this.state.newComment,
                    postId: e.target.value
                  }
                });
              }}
              placeholder="Post ID"
            />
          </InputGroup>
          <InputGroup className="emailInput my-4 mr-4 ml-0">
            <InputGroupAddon addonType="prepend">Body</InputGroupAddon>
            <Input
              value={this.state.newComment.body}
              onChangeCapture={e => {
                this.setState({
                  newComment: {
                    ...this.state.newComment,
                    body: e.target.value
                  }
                });
              }}
              placeholder="Body"
            />
          </InputGroup>
          {this.state.isEditing ? (
            <div>
              <Button
                onClick={this.saveComment}
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
              onClick={this.addComment}
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
              <th>Post ID</th>
              <th>Body</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.comments.map((x, i) => (
              <tr key={i}>
                <td>{x.id}</td>
                <td>{x.userId}</td>
                <td>{x.postId}</td>
                <td>{x.body}</td>
                <td>
                  <button
                    className="btn btn-warning mr-3"
                    onClick={() => this.edit(x)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => this.deleteComment(x.id)}
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

export default Comments;
