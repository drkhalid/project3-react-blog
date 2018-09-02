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
  Tooltip,
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

class Pop extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {
    return (
      <div>
        <p>
          {" "}
          <span
            style={{ textDecoration: "underline", color: "blue" }}
            href="#"
            id="TooltipExample"
          >
            Writter
          </span>
          .
        </p>
        <Tooltip
          placement="right"
          isOpen={this.state.tooltipOpen}
          target="TooltipExample"
          toggle={this.toggle}
        >
          Hello world!
        </Tooltip>
      </div>
    );
  }
}

class MainPage extends Component {
  constructor() {
    super();

    this.endpoint = "http://localhost:3000/posts/";
  }
  state = {
    realPosts: [],
    posts: [],
    newPost: { title: "", body: "", userId: "", categoryId: "" },
    isEditing: false,
    comments: [],
    users: [],
    categories: [],
    savedPosts: [],

    writterUser: []
  };

  componentDidMount() {
    // Ofc, you should use the local not this link
    axios
      .get(this.endpoint)
      .then(res => {
        this.setState({ realPosts: res.data });
      })
      .then(() => {
        this.setState({
          posts: [...this.state.realPosts]
        });
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

  postsByCategory = id => {
    this.setState({
      savedPosts: this.state.posts.slice(),
      posts: this.state.realPosts.filter(x => x.categoryId == id)
    });
    console.log(`this is saved ${this.state.savedPosts}`);
    console.log(this.state.posts);
  };

  getAllCata = () => {
    this.setState({
      posts: [...this.state.realPosts]
    });
  };

  getWritter = nn => {
    console.log(this.state.users);

    this.state.users.map(d => {
      d.id == nn ? this.setState({ writterUser: d.name }) : "";
    });

    console.log(this.state.writterUser);
  };

  render() {
    return (
      <div className="row">
        <div className="d-flex UserForm col-12 my-wrap-flex">
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
          <InputGroup className="nameInput pl-0 my-4 mr-4 ml-0 col-lg-8 col-10">
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
          <InputGroup className="emailInput pl-0 my-4 mr-4 ml-0 col-lg-8 col-10">
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
            <div className="ml-0">
              <Button
                onClick={this.savePost}
                className="SubmitButton pl-0 my-4 mr-4 ml-0"
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
          <div className="col-lg-9 col-12 postBoard">
            {this.state.posts.map((x, i) => (
              <Card className="my-2 col-12" key={i}>
                <CardBody>
                  <CardTitle>{x.title}</CardTitle>
                  <CardSubtitle
                    onMouseMove={() => {
                      this.getWritter(x.userId);
                      console.log(x.userId);
                    }}
                  >
                    Written by: {this.state.writterUser}
                  </CardSubtitle>
                  <CardText>{x.body}</CardText>
                  <Button
                    onClick={() => this.getComment(x.userId)}
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
          <Card className="col-12 col-lg-3 mt-2 CatBoard">
            <div className="text-center">
              <h3 className="col-12 mt-3 mb-3">Categories</h3>
              <button
                className="btn btn-flat waves-effect btn-outline-info col-12 mt-3 mb-3"
                onClick={() => {
                  this.getAllCata();
                }}
              >
                All categories
              </button>
            </div>
            {this.state.categories.map((x, i) => (
              <div key={i}>
                <button
                  onClick={() => {
                    this.postsByCategory(x.id);
                  }}
                  className="btn btn-flat waves-effect btn-outline-info col-12 mt-3 mb-3"
                >
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
