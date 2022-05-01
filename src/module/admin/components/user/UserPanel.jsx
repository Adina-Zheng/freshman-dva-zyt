import React from 'react';
import { Table, Button, Icon, Input, Radio, Popconfirm, Drawer, Form, message } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'react-router';
const { Search } = Input;


class UserPanel extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '#',
        dataIndex: 'num',
      },
      {
        title: 'UserName',
        dataIndex: 'username',
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Sex',
        dataIndex: 'sex',
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (_, record) =>
          this.state.users.length >= 1 ? (
            <>
              <Button type="primary" size={'small'} onClick={() => this.viewDtail(record.key)}>View</Button>
              <Button type="primary" size={'small'} onClick={() => this.editUser(record.key)} style={{ marginLeft: '10px' }}>Edit</Button>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteUser(record.key)}>
                <Button type="primary" size={'small'} style={{ marginLeft: '10px' }}>Delete</Button>
              </Popconfirm>
            </>
          ) : null,
      }
    ];

    this.state = {
      users: [],
      hasSelected: false,
      selectedRowKeys: [],
      type: "add",
      visible: false
    }
  }

  componentDidMount() {
    console.log("执行周期函数")
    this.setState({
      users: this.props.userList,
      hasSelected: this.state.selectedRowKeys.length > 0,
    })
    localStorage.setItem("initUserList", JSON.stringify(this.props.userList));
  }

  //添加用户信息，弹出抽屉的方式
  addUser = () => {
    this.setState({
      type: "add",
      visible: true
    });
  }

  //编辑信息，使用抽屉弹出的方式
  editUser = (key) => {
    const user = this.state.users.find(item => item.key === key)
    this.props.form.setFieldsValue({
      num: user.num,
      username: user.username,
      password: user.password,
      email: user.email,
      radiogroup: user.sex,
    })
    this.setState({
      type: "edit",
      visible: true,
    });
  }

  //删除用户信息
  deleteUser = (key) => {
    const dataSource = [...this.state.users];
    this.setState({ users: dataSource.filter(item => item.key !== key) });
  }

  //批量删除用户信息
  batchDeleteUsers = () => {
    const dataSource = [...this.state.users];
    this.setState({
      users: dataSource.filter((item) => this.state.selectedRowKeys.indexOf(item.key) === -1)
    });
  }

  //查看详情
  viewDtail = (key) => {
    const data = this.state.users.find((item) => {
      if (item.key === key) return item;
    })
    this.props.history.push({
      pathname: '/user/detail',
      state: {
        username: data.username,
        email: data.email,
        sex: data.sex,
      }
    });
  }

  //展示抽屉
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  //关闭抽屉
  onClose = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  onAddConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        message.success('Add successfully');
        const userObj = {
          key: this.state.users.length + 1,
          num: this.state.users.length + 1,
          username: values.username,
          password: values.password,
          email: values.email,
          sex: values.radiogroup,
        }
        this.setState({
          users: [...this.state.users, userObj],
          visible: false,
        })
        localStorage.setItem("initUserList", JSON.stringify([...this.state.users, userObj]));
      }
      //增加完成后清空表单
      this.props.form.resetFields();

    });
  }

  //增加或者编辑确认事件
  onEditConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        message.success('Edit successfully');
        const newUserList = this.state.users.map((item) => {
          if (item.num === values.num) {
            item.username = values.username;
            item.password = values.password;
            item.email = values.email;
            item.sex = values.radiogroup;
          }
          return item;
        });
        this.setState({
          users: newUserList,
          visible: false,
        })
        //增加完成后清空表单
        this.props.form.resetFields();
        localStorage.setItem("initUserList", JSON.stringify(newUserList));
      }
    });
  }



  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleSearch = (value) => {
    console.log(value);
    const initUserList = JSON.parse(localStorage.getItem("initUserList"));
    if (value !== "") {
      const resultUserList = initUserList.filter(item => item.username.indexOf(value) !== -1 || item.email.indexOf(value) !== -1 || item.sex.indexOf(value) !== -1);
      this.setState({
        users: resultUserList
      })
    } else {
      this.setState({
        users: initUserList
      })
    }
  }
  //注释
  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div style={{ marginBottom: '5px' }}>
          <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.addUser}>
            Add
          </Button>
          <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.batchDeleteUsers}>
            Batch Delete
          </Button>
          <Search
            placeholder="Please input keyword!"
            onSearch={this.handleSearch}
            style={{ width: 200, marginLeft: '20px' }}
          />
        </div>
        <span style={{ marginLeft: 8 }}>
          {this.state.hasSelected ? `Selected ${this.state.selectedRowKeys.length} items` : ''}
        </span>
        <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.state.users} bordered />
        <Drawer title={this.state.type === "add" ? 'Add User' : 'Edit User'} width={720} onClose={this.onClose} visible={this.state.visible} bodyStyle={{ paddingBottom: 80 }}>
          <Form onSubmit={this.state.type === "add" ? this.onAddConfirm : this.onEditConfirm}>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('num')(
                <Input />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username" autoComplete="off"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                  autoComplete="off"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('radiogroup')(
                <Radio.Group>
                  <Radio value="male">male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item>
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                OK
              </Button>
            </Form.Item>
          </Form>

        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userList: state.admin.userList
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default withRouter(Form.create({ name: 'userPanel' })(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPanel)));
