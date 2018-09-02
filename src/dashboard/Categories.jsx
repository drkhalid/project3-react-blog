import React, { Component } from "react";
import axios from "axios";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import { Table } from "reactstrap";
import { Collapse, Button, CardBody, Card } from "reactstrap";

class Categories extends Component {
  constructor() {
    super();

    this.endpoint = "http://localhost:3000/categories/";
  }
  state = {
    categories: [],
    newCat: { name: "" },
    isEditing: false
  };

  componentDidMount() {
    // Ofc, you should use the local not this link
    axios.get(this.endpoint).then(res => {
      this.setState({
        categories: res.data
      });
    });
  }

  deleteCat = id => {
    axios.delete(this.endpoint + id).then(res => {
      this.setState({
        categories: this.state.categories.filter(x => x.id !== id)
      });
    });
  };

  edit = cat => {
    this.setState({
      isEditing: true,
      newCat: cat
    });
  };

  saveCat = () => {
    axios
      .put(this.endpoint + this.state.newCat.id, this.state.newCat)
      .then(res => {
        this.setState({
          newCat: { name: "" },
          isEditing: false,
          categories: this.state.categories.map(u => {
            if (u.id === res.data.id) {
              return res.data;
            }
            return u;
          })
        });
      });
  };

  addCat = userData => {
    axios.post(this.endpoint, this.state.newCat).then(res => {
      this.setState({
        categories: [...this.state.categories, res.data],
        newCat: { name: "" }
      });
    });
  };

  cancelEdit = () => {
    this.setState({
      newCat: { name: "" },
      isEditing: false
    });
  };

  render() {
    return (
      <div className="row">
        <div className="d-flex my-wrap-flex UserForm col-12 pl-0">
          <InputGroup className="nameInput col-lg-6 col-10 my-4 mr-4 ml-0 pl-0">
            <InputGroupAddon addonType="prepend">Category</InputGroupAddon>
            <Input
              value={this.state.newCat.name}
              onChangeCapture={e => {
                this.setState({
                  newCat: { ...this.state.newCat, name: e.target.value }
                });
              }}
              placeholder="Category Name"
            />
          </InputGroup>
          {this.state.isEditing ? (
            <div>
              <Button
                onClick={this.saveCat}
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
              onClick={this.addCat}
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
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.categories.map((x, i) => (
              <tr key={i}>
                <td>{x.id}</td>
                <td>{x.name}</td>
                <td>
                  <button
                    className="btn btn-warning mr-3"
                    onClick={() => this.edit(x)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => this.deleteCat(x.id)}
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
export default Categories;
