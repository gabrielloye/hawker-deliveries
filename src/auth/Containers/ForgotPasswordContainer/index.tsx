import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Form, Spin, Input, Button, notification, Row, Col } from 'antd';
import { Icon } from '@ant-design/compatible';

/** Presentational */
import FormWrapper from '../../Styled/FormWrapper';

/** App theme */
import { colors } from '../../Themes/Colors';

type Props = {
  form: any;
};

type State = {
  username: string;
  redirect: boolean;
  loading: boolean;
};

class ForgotPasswordContainer extends React.Component<Props, State> {
  state = {
    username: '',
    redirect: false,
    loading: false
  };

  handleSubmit = (values: any) => {
    let { username } = values;

    this.setState({
      loading: true,
      username
    });

    Auth.forgotPassword(username)
      .then(data => {
        notification.success({
          message: 'Redirecting you in a few!',
          description: 'Account confirmed successfully!',
          placement: 'topRight',
          duration: 1.5,
          onClose: () => {
            this.setState({ redirect: true });
          }
        });
      })
      .catch(err => {
        notification.error({
          message: 'User confirmation failed',
          description: err.message,
          placement: 'topRight',
          duration: 1.5
        });
        this.setState({ loading: false });
      });
  };

  render() {
    const { loading, redirect, username } = this.state;

    return (
      <React.Fragment>
        <FormWrapper onFinish={this.handleSubmit} className="login-form">
          <Form.Item name='username' rules={[
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]}>
              <Input prefix={<Icon type="user" style={{ color: colors.transparentBlack }} />} placeholder="Username" />
          </Form.Item>
          <Form.Item className="text-center">
            <Row>
              <Col lg={24}>
                <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
                  {loading ? (
                    <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                  ) : (
                    'Confirm username'
                  )}
                </Button>
              </Col>
              <Col lg={24}>
                <Link to="/login">Ooh! Wait! I've remembered!</Link>
              </Col>
            </Row>
          </Form.Item>
        </FormWrapper>
        {redirect && (
          <Redirect
            to={{
              pathname: '/reset-password',
              search: `?username=${username}`
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ForgotPasswordContainer;