import React, { Component } from 'react'
import axios from "axios";
import {
  Button, Row, Col, Input, message, Popconfirm, Divider, Modal, Table, Spin,
  Layout
} from 'antd';
import './App.css';
const { Header, Content } = Layout;

class App extends Component {
  state = {
    isLoading: false,
    userList: [],
    visible: false,
    isEdit: false,
    name: '',
    email: '',
    phone: '',
    address: '',
    userId: ''
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser = (id) => {
    var that = this
    that.setState({ isLoading: true })
    axios.get(
      "http://localhost:3019/api/users/"
    ).then(function (response) {
      that.setState({ isLoading: false })
      console.log("fetchUserResponse", response);
      let list = response.data ? response.data : [];
      that.setState({
        userList: list
      })

    }).catch(function (error) {
      that.setState({ isLoading: false })
      console.log("catchErr", error);
    })
  }

  deleteUser = (id) => {
    var that = this
    that.setState({ isLoading: true })
    axios.delete(
      `http://localhost:3019/api/user/${id}`
    ).then(function (response) {
      that.setState({ isLoading: false })
      console.log("deleteUserResponse", response);
      message.success(`${response.data.msg}`);
      that.fetchUser();
    }).catch(function (error) {
      that.setState({ isLoading: false })
      message.error(`Something went wrong, please try again`);
      console.log("catchErr", error);
    })
  }

  validation = () => {
    const { isEdit, name, email, phone, address, userId } = this.state;
    if (name === '') {
      message.error(`Name is required field`);
      return true;
    } else if (email === '') {
      message.error(`Email is required field`);
      return true;
    } else if (phone === '') {
      message.error(`Phone is required field`);
      return true;
    } else if (address === '') {
      message.error(`Address is required field`);
      return true;
    } else if (isEdit) {
      if (userId === '') {
        message.error(`User not valid`);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  handleOk = () => {
    var that = this;
    const { isEdit, name, email, phone, address, userId } = this.state;
    // let userData = { name, email, phone, address, userId };
    if (isEdit) {
      if (that.validation()) {

      } else {
        that.setState({ isLoading: true })
        axios.put(
          `http://localhost:3019/api/user/${userId}`, {
          name, email, phone, address
        }
        ).then(function (response) {
          that.setState({ isLoading: false })
          console.log("UpdateUserResponse", response);
          message.success(`${response.data.msg}`);
          that.setState({ visible: false })
          that.fetchUser();
        }).catch(function (error) {
          that.setState({ isLoading: false })
          message.error(`Something went wrong, please try again`);
          console.log("catchErr", error);
        })
      }

    } else {
      if (that.validation()) {

      } else {
        that.setState({ isLoading: true })
        axios.post(
          "http://localhost:3019/api/user/", {
          name, email, phone, address
        }
        ).then(function (response) {
          that.setState({ isLoading: false })
          console.log("AddUserResponse", response);
          message.success(`${response.data.msg}`);
          that.setState({ visible: false })
          that.fetchUser();
        }).catch(function (error) {
          that.setState({ isLoading: false })
          message.error(`Something went wrong, please try again`);
          console.log("catchErr", error);
        })
      }
    }

  }

  showModal = () => {
    this.setState({
      visible: true,
      isEdit: false,
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  };
  editUser = (record) => {
    this.setState({
      visible: true,
      isEdit: true,
      name: record.name,
      email: record.email,
      phone: record.phone,
      address: record.address,
      userId: record._id
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onChangeHandle = (e) => {
    console.log(`name ${e.target.name} value: ${e.target.value}`);
    let value = e.target.value.trim();
    this.setState({
      [e.target.name]: value
    })
  }

  render() {
    const { isLoading, userList, name, email, phone, address, visible, isEdit } = this.state;
    const column = [
      {
        title: '#',
        render: (x, y, index) => <span>{(index + 1)}</span>
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button size={"small"} icon={'edit'} type={'dashed'} onClick={() => this.editUser(record)} />
            <Divider type="vertical" />
            <Popconfirm title="Are you sure delete this user ?" onConfirm={() => this.deleteUser(record._id)} okText="Yes" cancelText="No">
              <Button size={"small"} icon={'delete'} type={'danger'} />
            </Popconfirm>
          </span>
        ),
      }
    ]

    return (
      <Layout className="layout">
        <Header />
        <Content style={{ padding: '0 50px' }}>
          <div style={{ margin: '16px 0', background: '#fff', padding: 24, height: 450 }}>
            <div className='user-header'>
              <Row>
                <Col span={8}>
                  <h3>User's</h3>
                </Col>
                <Col offset={14} span={2}>
                  <Button
                    type="primary"
                    className="btn-right"
                    onClick={this.showModal}
                  > Add User
                </Button>
                </Col>
              </Row>
            </div>
            <div className='user-content'>
              <Table columns={column} dataSource={userList} loading={isLoading} />

              <Modal
                visible={visible}
                title={isEdit ? "Edit User" : "Add User"}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Spin spinning={isLoading}>
                  <Row>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: '5px' }}>
                      <Col span={6}><label>Name</label></Col>
                      <Col span={16}>
                        <Input name="name" placeholder="Name" value={name} onChange={this.onChangeHandle} />
                      </Col>
                    </div>
                  </Row>
                  <Row>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: '5px' }}>
                      <Col span={6}><label>Email</label></Col>
                      <Col span={16}>
                        <Input name='email' placeholder="Email" value={email} onChange={this.onChangeHandle} />
                      </Col>
                    </div>
                  </Row>
                  <Row>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: '5px' }}>
                      <Col span={6}><label>Phone</label></Col>
                      <Col span={16}>
                        <Input name='phone' maxLength={10} placeholder="Phone" value={phone} style={{ width: "100%" }} onChange={this.onChangeHandle} />
                      </Col>
                    </div>
                  </Row>
                  <Row>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: '5px' }}>
                      <Col span={6}><label>Address</label></Col>
                      <Col span={16}>
                        <Input name='address' maxLength={10} placeholder="Address" value={address} style={{ width: "100%" }} onChange={this.onChangeHandle} />
                      </Col>
                    </div>
                  </Row>
                </Spin>
              </Modal>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

}

export default App;
