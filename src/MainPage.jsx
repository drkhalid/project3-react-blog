import React, { Component } from "react";
import axios from "axios";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  Row,
  Table,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";

class MainPage extends Component {
  constructor() {
    super();

    this.endpoint = "http://localhost:3000/posts/";
  }
  state = {
    posts: [],
    newPost: { title: "", body: "", userId: "", categoryId: "" },
    isEditing: false,
    comments: [],
    users: [],
    categories: [],

    oneUser: ""
  };

  componentDidMount() {
    // Ofc, you should use the local not this link
    axios
      .get(this.endpoint)
      .then(res => {
        this.setState({ posts: res.data });
      })
      .then(
        axios.get("http://localhost:3000/users/").then(res => {
          this.setState({ users: res.data });
          console.log(this.state.users);
        })
      )
      .then(
        axios.get("http://localhost:3000/categories/").then(res => {
          this.setState({
            categories: res.data
          });
          console.log(this.state.categories);
        })
      );
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

  getComment = function(id) {
    axios.get(`http://localhost:3000/posts/${id}/comments`).then(res => {
      this.setState({
        comments: res.data
      });
    });
  };

  render() {
    return (
      <div className="row d-flex fluid">
        <div className="row-fluid d-flex UserForm">
          <InputGroup className="nameInput my-4 mr-4 ml-0">
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
          <InputGroup className="emailInput my-4 mr-4 ml-0">
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
          <InputGroup className="nameInput my-4 mr-4 ml-0">
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
          <InputGroup className="emailInput my-4 mr-4 ml-0">
            <InputGroupAddon addonType="prepend">Body</InputGroupAddon>
            <Input
              value={this.state.newPost.body}
              onChangeCapture={e => {
                this.setState({
                  newPost: { ...this.state.newPost, body: e.target.value }
                });
              }}
              placeholder="Body"
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
        <div className="d-flex">
          <div className="col-lg-9 col-12">
            {this.state.posts.map((x, i) => (
              <Card className="my-2 col-12" key={i}>
                <CardBody>
                  <CardTitle>{x.title}</CardTitle>
                  <CardSubtitle>Written by: </CardSubtitle>
                  <CardText>{x.body}</CardText>
                  <Button
                    onClick={() => this.getComment(x.id)}
                    className="mr-5 btn-outline-info"
                  >
                    Comments
                  </Button>
                  <Button
                    className="btn btn-warning mr-3"
                    onClick={() => this.edit(x)}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => this.deletePost(x.id)}
                    className="btn-danger btn"
                  >
                    Delete
                  </Button>

                  <CardBody>
                    {this.state.comments.map(
                      (n, i) =>
                        n.postId == x.id ? (
                          <Card className="my-3" key={i}>
                            <CardBody>
                              <CardTitle>{n.userId} says:</CardTitle>
                              <CardText>{n.body}</CardText>
                            </CardBody>
                          </Card>
                        ) : (
                          ""
                        )
                    )}
                  </CardBody>
                </CardBody>
              </Card>
            ))}
          </div>
          <Card className="col-12 col-lg-3 ">
            <div>
              <h3>Categories</h3>
              <button className="btn btn-flat waves-effect btn-outline-info col-12 mt-3 mb-3">
                All categories
              </button>
            </div>
            {this.state.categories.map((x, i) => (
              <div>
                <button className="btn btn-flat waves-effect btn-outline-info col-12 mt-3 mb-3">
                  {x.name}
                </button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    );
  }
}

export default MainPage;
