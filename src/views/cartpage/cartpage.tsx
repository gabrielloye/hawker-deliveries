import React, { Component, createRef } from "react";

import "semantic-ui-css/semantic.min.css";

import { Link, RouteComponentProps } from 'react-router-dom';

import { Responsive, Button, Container, Menu, Sticky, Modal, List, Divider, Image, Grid, Dropdown, DropdownProps, Dimmer, Segment, Loader, Header } from "semantic-ui-react";

import moment from 'moment';

import API from '../../components/axiosapi'

import { Auth } from "aws-amplify";

/** Helpers */
import { validateToken } from '../../auth/Utils/Helpers';

/** Constants */
import { AUTH_USER_TOKEN_KEY } from '../../auth/Utils/constants';

import './cartpage.css';

import CartList from "../../components/cartlist";

import { CartContext, CartItem } from '../../components/cartcontext';

type Props = RouteComponentProps & {
  pathName: string;
  match: {
    params: {
      date: string;
      meal: string
    }
  }
}

type State = {}

interface User {
  awsId: string;
  dateJoined: string;
  email: string;
  name: string;
  payment: Payment[];
  phone: string;
}

interface Options {
  key: string;
  text: string;
  value: string;
}

interface Payment {
  method: string;
  username: string;
}

interface TransactionCart {
  id: string;
  stallId: string;
  name: string;
  price: number;
  margin: number;
  quantity: number;
}

let dummyUser: User = {
  awsId: '',
  dateJoined: '',
  email: '',
  name: '',
  phone: '',
  payment: []
}

class Cart extends Component<Props, State> {
  state = {
    user_id: '',
    user: dummyUser,
    paymentUsername: '',
    paymentMode: '',
    isPaymentPage: false,
    active: false,
    isSuccessful: false
  }

  contextRef = createRef()

  componentDidMount() {
    if (!moment(this.props.match.params['date'], "DDMMYYYY").isValid() || this.props.match.params['meal'].length === 0) {
      this.props.history.push('/')
    }

    const checkUserAuth = validateToken(localStorage.getItem(AUTH_USER_TOKEN_KEY));

    if (checkUserAuth) {
      Auth.currentUserInfo().then((resp) => {
        const res = resp['attributes']
        this.setState({
          user_id: res['sub']
        })
        API.post(`/users/${res['sub']}`).then(res => {
          this.setState({ user: res["data"] })
        })
      })
    }
  }

  marginTotal = (cart: CartItem[]) => {
    let cost = 0;
    let el;
    for (el of cart) {
      cost += el.margin * el.quantity;
    }
    return cost;
  }

  totalCost = (cart: CartItem[]) => {
    let cost = 0;
    let el;
    for (el of cart) {
      cost += (el.price + el.margin) * el.quantity;
    }
    return cost;
  }

  renderButton = (checkUserAuth: boolean) => {
    if (checkUserAuth) {
      return (
        <Button
          floated='right'
          style={{ background: "#009628", color: "white" }}
          toggle
          onClick={() => {
            this.setState({ isPaymentPage: true })
          }}>
          Confirm
        </Button>)
    } else {
      return (
        <Link to="/login">
          <Button
            floated='right'
            toggle
            style={{ color: 'black' }}>
            Login
      </Button>
        </Link>)
    }
  }

  getOptions = () => {
    let options: Options[] = []
    for (let el of this.state.user.payment) {
      options.push({
        key: el.method,
        text: el.method + " " + el.username,
        value: el.method
      })
    }
    return options
  }

  onPaymentSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    let method: any = data.value;
    for (let el of this.state.user.payment) {
      if (el.method === method) {
        this.setState({ paymentUsername: el.username })
      }
    }
    this.setState({ paymentMode: method })
  }

  renderCompleteTransaction = (cart: CartItem[], date: string, meal: string, clearCart: () => void) => {
    let transactionCart: TransactionCart[] = []
    for (let el of cart) {
      transactionCart.push({
        id: el.id,
        stallId: el.stallId,
        name: el.name,
        price: el.price,
        margin: el.margin,
        quantity: el.quantity
      })
    }

    return (
      <React.Fragment>
        <Dropdown
          placeholder='Select payment type'
          fluid
          className="huge"
          selection
          options={this.getOptions()}
          onChange={this.onPaymentSelect}
        />
        <Link to={`${this.props.pathName}/dashboard`}><a style={{ marginTop: '0.2em' }}>
          Add payment methods through the dashboard
        </a></Link>
        <Button
          floated='right'
          disabled={this.state.paymentMode === ''}
          style={{ background: "#009628", color: "white", marginTop: '0.5em' }}
          toggle
          onClick={() => {
            this.setState({ active: true })
            const body = {
              "awsId": this.state.user_id,
              "date": date,
              "cart": transactionCart,
              "paymentMethod": this.state.paymentMode,
              "paymentUsername": this.state.paymentUsername,
              "meal": meal
            }
            API.post(`/transactions/add`, body).then(res => {
              this.setState({isSuccessful: true})
              setTimeout(() => {
                clearCart()
                this.props.history.push(`${this.props.pathName}/dashboard`)
              }, 300)
            })
          }}>
          Finish Transaction
        </Button>
      </React.Fragment>)
  }

  render() {
    const checkUserAuth = validateToken(localStorage.getItem(AUTH_USER_TOKEN_KEY));

    return (
      <Container text style={{ minHeight: `100vh` }} textAlign="center">
        <CartList/>
        <Container className="bottombar">
          <CartContext.Consumer>
            {({ date, cart, meal, clearCart }) => (
              <Menu borderless fluid inverted size="huge">
                <Menu.Item>
                  <p style={{ color: 'white' }}><strong>Total: </strong>
                    {this.totalCost(cart).toFixed(2)} </p>
                </Menu.Item>

                <Menu.Item position='right'>
                  <Modal size="small" trigger={
                    <Button
                      toggle
                      disabled={this.totalCost(cart) == 0}
                      style={{ color: 'black' }}
                      onClick={
                        () => {
                          this.setState({ isPaymentPage: false })
                        }
                      }
                    >
                      Checkout
                  </Button>
                  }>
                    <Modal.Header>Order on {moment(date, "DDMMYYYY").format("DD-MM-YYYY")}</Modal.Header>
                    {!this.state.isPaymentPage &&
                      <React.Fragment>
                        <Modal.Content>
                          <List ordered>
                            {cart.map((item) => (
                              <List.Item>
                                <List.Content floated='right'>
                                ${(item['price']*item['quantity']).toFixed(2)} (+${(item['margin']*item['quantity']).toFixed(2)})
                                </List.Content>
                                <List.Content>
                                {item['quantity']}x {item['name']}
                                </List.Content>
                              </List.Item>
                            ))}
                          </List>
                          <Divider />
                          <List>
                            <List.Item>
                              <List.Content floated="right">
                                ${this.marginTotal(cart).toFixed(2)}
                              </List.Content>
                              <List.Content>
                                Service Fee:
                                </List.Content>
                            </List.Item>
                            <Divider />
                            <List.Item>
                              <List.Content floated="right">
                                ${this.totalCost(cart).toFixed(2)}
                              </List.Content>
                              <List.Content>
                                Total Cost:
                          </List.Content>
                            </List.Item>
                            <List.Item>
                              {this.renderButton(checkUserAuth)}
                            </List.Item>
                          </List>
                        </Modal.Content>
                      </React.Fragment>
                    }
                    {
                      this.state.isPaymentPage &&
                      <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                          <Modal.Content>
                            <Image centered src='/images/qr.jpg' size="large" />
                            <Grid>
                              <Grid.Column textAlign='center' className="priceHeader">
                                <strong>Total Cost:</strong> ${this.totalCost(cart).toFixed(2)}
                              </Grid.Column>
                            </Grid>
                            <List>
                              
                              <List.Item>
                                <List.Header style={{textAlign:'center', paddingBottom: '0.2em'}}>
                                  Please remember to add payment method&nbsp; 
                                  <Link to={`${this.props.pathName}/dashboard`}><a style={{ marginTop: '0.2em' }}>here</a></Link>
                                  &nbsp;before proceeding
                                </List.Header>
                                <List.Header>If you are on desktop:</List.Header>
                                <List.Content>
                                  <List.List as='ol'>
                                    <List.Item as='li'>
                                      Open your PayLah!/PayNow Application and access the Scan and Pay feature.
                                  </List.Item>
                                    <List.Item as='li'>
                                      Scan the QR code on the screen and pay the total amount stated.
                                  </List.Item>
                                    <List.Item as='li'>
                                      After you have paid, indicate whether you used PayLah! or PayNow and click "Complete Order".
                                  </List.Item>
                                  </List.List>
                                </List.Content>
                              </List.Item>
                              <List.Item>
                                <List.Header>If you are on mobile:</List.Header>
                                <List.Content>
                                  <List.List as='ol'>
                                    <List.Item as='li'>
                                      Download the image&nbsp;
                                    <a type="image/*" target="_blank" href='/images/qr.jpg' download="qrCode.jpg"
                                        >
                                        here.
                                    </a>
                                    </List.Item>
                                    <List.Item as='li'>
                                      Open your PayLah!/PayNow Application and access the Scan and Pay feature.
                                  </List.Item>
                                    <List.Item as='li'>
                                      Choose the "PHOTO LIBRARY" (PayNow) or "Album" (PayLah!) option and locate the downloaded QR code.
                                  </List.Item>
                                    <List.Item as='li'>
                                      Scan and pay the total amount and return to this page after paying.
                                  </List.Item>
                                    <List.Item as='li'>
                                      After you have paid, indicate whether you used PayLah! or PayNow and click "Complete Order".
                                  </List.Item>
                                  </List.List>
                                </List.Content>
                              </List.Item>
                              <List.Item>
                                {this.renderCompleteTransaction(cart, date, meal, clearCart)}
                              </List.Item>
                            </List>
                          </Modal.Content>
                        <Dimmer active={this.state.active}>
                          {
                            !this.state.isSuccessful &&
                            <Loader>Processing</Loader>
                          }
                          {
                            this.state.isSuccessful &&
                            <Header inverted>
                              Transaction Completed
                            </Header>
                          }
                        </Dimmer>
                      </Dimmer.Dimmable>
                    }
                  </Modal>
                </Menu.Item>
              </Menu>
            )}
          </CartContext.Consumer>
        </Container>
      </Container>
    );
  }
}

Cart.contextType = CartContext

export default Cart;