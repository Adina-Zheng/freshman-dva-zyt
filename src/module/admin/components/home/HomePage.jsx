import React from 'react';
import { Button, Card, Form, Icon, Input, message } from 'antd'
import { withRouter } from 'react-router';


class HomePage extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    console.log("HomePage", this.props)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("HomePage-values", values);
        message.success('Login successfully')
        this.props.history.push({
          pathname: '/user',
          state: {
            username: values.username,
            email: values.email,
            sex: values.radiogroup,
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        welcome to eccom :)<br />
        Please Login!
        <Card title="Login" className="login-form" style={{ width: '400px', margin: 'auto', marginTop: '50px' }}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                  autoComplete="off"
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
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default withRouter(Form.create({ name: 'userForm' })(HomePage));
