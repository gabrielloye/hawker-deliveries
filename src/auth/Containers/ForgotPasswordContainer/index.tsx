import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Select, Form, Icon, Spin, Input, Button, notification, Row, Col } from 'antd';

/** Presentational */
import FormWrapper from '../../Styled/FormWrapper';

/** App theme */
import { colors } from '../../Themes/Colors';

const { Option } = Select;

type Props = {
  form: any;
};

type State = {
  username: string;
  prefix: string;
  redirect: boolean;
  loading: boolean;
};

class ForgotPasswordContainer extends React.Component<Props, State> {
  state = {
    username: '',
    prefix: '+65',
    redirect: false,
    loading: false
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.props.form.validateFields((err: { message: string }, values: { username: string, prefix: string }) => {
      if (!err) {
        let { username, prefix } = values;

        this.setState({
          loading: true,
          username,
          prefix
        });

        Auth.forgotPassword(prefix + String(username))
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
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, redirect, username, prefix } = this.state;

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
              search: `?username=${prefix}${username}`
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Form.create()(ForgotPasswordContainer);