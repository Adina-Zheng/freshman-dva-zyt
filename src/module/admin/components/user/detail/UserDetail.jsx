import React from 'react';
import { Card, Icon } from 'antd'
import { withRouter } from 'react-router'

class UserDetail extends React.Component {
    render() {
        console.log(this.props.location.state);
        const { username, email, sex } = this.props.location.state;
        return (
            <Card title='UserInfo' style={{ width: 300 }}>
                <p><Icon type="user" />&nbsp;{username}</p>
                <p><Icon type="mail" />&nbsp;{email}</p>
                <p><Icon type="man" />&nbsp;{sex}</p>
            </Card>
        );
    }
}


export default withRouter(UserDetail);