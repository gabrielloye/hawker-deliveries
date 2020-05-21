import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Select, Form, Icon, Spin, Input, Button, notification, Col, Row } from 'antd';

/** Presentational */
import FormWrapper from '../../Styled/FormWrapper';

/** App theme */
import { colors } from '../../Themes/Colors';

/** App constants */
import { AUTH_USER_TOKEN_KEY } from '../../Utils/constants';

const { Option } = Select;

type Props = RouteComponentProps & {
  form: any;
};

type State = {
  loading: boolean;
};

class LoginContainer extends React.Component<Props, State> {
  state = {
    loading: false
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.props.form.validateFields((err: Error, values: { username: string; password: string, prefix: string }) => {
      if (!err) {
        let { username, password, prefix } = values;

        this.setState({ loading: true });

        Auth.signIn(prefix + String(username), password)
          .then(user => {
            const { history, location } = this.props;
            const from = '/main/dashboard'

            localStorage.setItem(AUTH_USER_TOKEN_KEY, user.signInUserSession.accessToken.jwtToken);

            notification.success({
              message: 'Succesfully logged in!',
              description: 'Logged in successfully, Redirecting you in a few!',
              placement: 'topRight',
              duration: 1.5
            });

            history.push(from);
          })
          .catch(err => {
            notification.error({
              message: 'Error',
              description: err.message,
              placement: 'topRight'
            });
            const { history, location } = this.props;
            if (err['code'] === "UserNotConfirmedException") {
              history.push(`/verify-code?phone=${prefix}${username}`)
            }

            this.setState({ loading: false });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+65',
    })(
      <Select style={{ width: 70 }}>
        <Option value="+65">+65</Option>
        <Option value="+">+</Option>
      </Select>,
    );

    return (
      <React.Fragment>
        <FormWrapper onSubmit={this.handleSubmit} className="login-form">
          <div style={homeStyle}>
            <Link to="/"><Icon type="home"/> Home</Link>
          </div>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please input your phone number!'
                }
              ]
            })(
              <Input
                addonBefore={prefixSelector}
                prefix={<Icon type="phone" style={{ color: colors.transparentBlack }} />}
                placeholder="Phone number" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: colors.transparentBlack }} />}
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item className="text-center">
            <Row type="flex" gutter={16}>
              <Col lg={24}>
                <Link style={{ float: 'right' }} className="login-form-forgot" to="/forgot-password">
                  Forgot password?
                </Link>
              </Col>
              <Col lg={24}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  disabled={loading}
                  htmlType="submit"
                  className="login-form-button"
                >
                  {loading ? <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /> : 'Log in'}
                </Button>
              </Col>
              <Col lg={24}>
                Or <Link to="/signup">Register now!</Link>
              </Col>
            </Row>
          </Form.Item>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

const homeStyle = {
  paddingBottom: "1em"
}

export default Form.create()(LoginContainer);