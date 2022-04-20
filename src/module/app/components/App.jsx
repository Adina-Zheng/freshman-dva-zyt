import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Menu, Icon, Layout } from 'antd';
import { routerRedux } from 'dva/router';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  render() {
    //children是router中switch标签里面的路由，这里的props还有loginUser属性
    let { children, changePath } = this.props;
    return (
      <Layout className="layout">
        <Header>
          <Menu onClick={changePath} theme="dark" mode="horizontal">
            <Menu.Item key="/home">
              <Icon type="home" />
              Home Page
            </Menu.Item>
            <Menu.Item key="/user">
              <Icon type="user" />
              UserMgmt
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 800 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'left' }}>©Eccom</Footer>
      </Layout>
    );
  }
}

App.propTypes = {
  loginUser: PropTypes.object
};

function mapStateToProps(state) {
  console.log("触发app组件的mapStateToProps函数", state);
  //首次加载可以触发，且能获取到app组件的state，点了user组件的切换之后，state里面就会有user仓库的state了
  return {
    loginUser: state.app.loginUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changePath: ({ key }) => {
      console.log("changePath接收到的参数，进行路由跳转：", key)
      dispatch(
        routerRedux.push({
          pathname: key
        })
      );
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
