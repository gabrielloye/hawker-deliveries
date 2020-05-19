import React, { Component } from "react";
import { Form, TransitionablePortal, Button, Icon, Label, Input, Modal, Container, Grid, Menu, Segment, Loader, Statistic, Divider, List, Header } from "semantic-ui-react";
import { RouteComponentProps, withRouter } from 'react-router';
import moment, {Moment} from 'moment';
import { AUTH_USER_TOKEN_KEY } from '../../auth/Utils/constants';
import { Auth } from "aws-amplify";
import { notification } from "antd";
import API from '../../components/axiosapi';
import "semantic-ui-css/semantic.min.css";

type Order = {
    date: string,
    meal: string,
    totalPrice: number,
    cart: any[]
}

type state = {
    activeItem: string,
    render: boolean,
    name: string,
    user_id: string,
    email: string,
    phone_number: string,
    pastOrders: Order[],
    currentOrders: Order[],
    payment: any[],
    dateJoined: Moment,
    paymentFetched: boolean,
    errorPortal: boolean
}

export default class Dashboard extends Component<RouteComponentProps, state> {
    state = {
        activeItem: "orders",
        render: false,
        name: "",
        user_id: "",
        email: "",
        phone_number: "",
        pastOrders: [],
        currentOrders: [],
        payment: [],
        dateJoined: moment(),
        paymentFetched: false,
        errorPortal: false
    }

    componentDidMount() {
        Auth.currentUserInfo().then((resp)=>{
            const res = resp['attributes']
            this.setState({
                name: res['name'],
                user_id: res['sub'],
                email: res['email'],
                phone_number: res['phone_number']
            })
            this.fetchOrders(res['sub'])
            this.fetchUser(res['sub'])
        })
    }

    fetchUser(userId: string) {
        API.post('/users/'+userId).then(res => {
            const data = res.data
            let payments = data['payment'].map((payment:any)=>{
                return {...payment, disabled: true, newUsername: payment['username']}
            })
            this.setState({
                payment: payments,
                dateJoined: moment(data['dateJoined']),
                paymentFetched: true
            })
        })
    }

    fetchOrders(userId: string) {
        // Fetch orders for userId and set state here
        API.post('/transactions/user', {
            "awsId": this.state.user_id
        }).then(res => {
            const transactions = res['data']['transactions']
            const pastOrders = transactions.filter((transaction: any) => transaction.paid)
            const currentOrders = transactions.filter((transaction: any) => !transaction.paid)
            this.setState({
                render: true,
                pastOrders,
                currentOrders
            })
        })        
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    handleLogout = async () => {
        const {history} = this.props;
        try {
            await Auth.signOut({ global: true}).then(() => {
                localStorage.removeItem(AUTH_USER_TOKEN_KEY);
                history.push("/")
            });
        } catch (err) {
            notification.error({ message: err.message })
        }
    }

    renderSummaryContent() {
        if(this.state.render) {
            const getTotalItems = () => {
                let sum = 0
                let order: Order
                for (order of this.state.pastOrders) {
                    sum += order['cart'].length;
                }
                for (order of this.state.currentOrders) {
                    sum += order['cart'].length;
                }
                return sum
            }
            const getUniqueHawkers = () => {
                const set = new Set()
                let order: Order
                let item
                for (order of this.state.pastOrders) {
                    for (item of order['cart']) {
                        set.add(item['stallId'])
                    };
                }
                for (order of this.state.currentOrders) {
                    for (item of order['cart']) {
                        set.add(item['stallId'])
                    };
                }
                return set.size
            }
            return (
                <div>
                    <h2>Orders Summary</h2>
                    <Statistic.Group size="large">
                        <Statistic>
                            <Statistic.Value>{getTotalItems()}</Statistic.Value>
                            <Statistic.Label>Items ordered</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{this.state.pastOrders.length + this.state.currentOrders.length}</Statistic.Value>
                            <Statistic.Label>Orders placed</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{getUniqueHawkers()}</Statistic.Value>
                            <Statistic.Label>Hawker Stalls</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>0</Statistic.Value>
                            <Statistic.Label>Hawker Centers</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                    <Divider/>
                    <List relaxed size="large">
                        <List.Item>
                            <List.Icon name='user'/>
                            <List.Content>
                                <List.Header>Name</List.Header>
                                {this.state.name}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='mail'/>
                            <List.Content>
                                <List.Header>Email</List.Header>
                                {this.state.email}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='phone'/>
                            <List.Content>
                                <List.Header>Phone Number</List.Header>
                                {this.state.phone_number}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='calendar alternate'/>
                            <List.Content>
                                <List.Header>Join Date</List.Header>
                                {this.state.paymentFetched?this.state.dateJoined.format("DD/MM/YYYY"):""}
                            </List.Content>
                        </List.Item>
                    </List>
                </div>
            )
        } else {
            return (
                <Loader active>Loading</Loader>
            )
        }
    }

    ordersList(orders: Order[]) {
        const Capitalize = (str: string) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return (
            <List relaxed animated selection>
                {orders.map((order: Order) => (
                    <Modal size="small" trigger={
                    <List.Item>
                        <List.Content floated='right'>
                            ${order['totalPrice'].toFixed(2)}
                        </List.Content>
                        <List.Content>
                            <List.Header>{moment(order['date'], "DDMMYYYY").format("DD-MM-YYYY")}</List.Header>
                            {Capitalize(order['meal'])}
                        </List.Content>
                    </List.Item>} closeIcon>
                        <Modal.Header>Order on {moment(order['date'], "DDMMYYYY").format("DD-MM-YYYY")}</Modal.Header>
                        <Modal.Content>
                            
                            <List ordered>
                                {order['cart'].map((item) => (
                                    <List.Item>
                                        <List.Content floated='right'>
                                            ${item['price'].toFixed(2)}
                                        </List.Content>
                                        <List.Content>
                                            {item['name']}
                                        </List.Content>
                                    </List.Item>
                                ))}
                            </List>
                            <Divider/>
                            <List>
                                <List.Item>
                                    <List.Content floated="right">
                                        ${order['totalPrice'].toFixed(2)}
                                    </List.Content>
                                    <List.Content>
                                        Total Cost:
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Modal.Content>
                    </Modal>
                ))}
            </List>
        )
    }

    toggleEditMethod(method: string) {
        this.setState({
            payment: this.state.payment.map((p: any) => {
                if (p.method === method) {
                    p['disabled'] = !p['disabled']
                }
                return p
            })
        })
    }
    updatePaymentMethod = (payment: any) => {
        const body = {
            awsId: this.state.user_id,
            method: payment['method'],
            username: payment['newUsername']
        }
        return API.post('/users/payment/update', body)
    }

    modifyMethodNewUsername = (method: string, newUsername: string) => {
        this.setState({
            payment: this.state.payment.map((p: any) => {
                if (p.method === method) {
                    p['newUsername'] = newUsername
                }
                return p
            })
        })
    }
    modifyMethodUsername = (method: string, username: string) => {
        this.setState({
            payment: this.state.payment.map((p: any) => {
                if (p.method === method) {
                    p['username'] = username
                }
                return p
            })
        })
    }

    paymentMethods() {
        if (this.state.payment.length>0) {
            return (<List>
                {this.state.payment.map((payment: any) => {
                    return <List.Item>
                        <Input fluid
                            label={
                                <Label color="black">{payment['method']}</Label>
                            }
                            action={
                                <Button.Group style={{"alignItems": "stretch"}}>
                                    <Button style={{"borderRadius":"0"}} icon
                                        color={payment['disabled']?"blue":"green"}
                                        onClick={()=>{
                                            if (!payment['disabled'] && payment['username'] !== payment['newUsername']) {
                                                this.updatePaymentMethod(payment).then(res => {
                                                    if ("success" in res['data']) {
                                                        this.modifyMethodUsername(payment['method'], payment['newUsername'])
                                                    } else {
                                                        this.setState({
                                                            errorPortal: true
                                                        })
                                                        this.modifyMethodNewUsername(payment['method'], payment['username'])
                                                    }
                                                    this.toggleEditMethod(payment['method'])
                                                })
                                            } else {
                                                this.toggleEditMethod(payment['method'])
                                            }
                                        }}>
                                        <Icon name={payment['disabled']?'edit':'check'} />
                                    </Button>
                                    <Button negative icon>
                                        <Icon name='delete' />
                                    </Button>
                                </Button.Group>
                            }
                            onChange={(e, data) => {
                                this.modifyMethodNewUsername(payment['method'], data['value'])
                            }}
                            style={{"opacity":"1"}}
                            value={payment['newUsername']}
                            disabled={payment['disabled']}/>
                    </List.Item>
                }
            )}
            <TransitionablePortal onClose={()=>{this.setState({errorPortal: false})}} open={this.state.errorPortal}>
                <Segment
                    style={{ left: '40%', position: 'fixed', bottom: '5%', zIndex: 1000 }}>
                    <Header>Error</Header>
                    <p>There is an error updating your payment information, please try again later.</p>
                </Segment>
            </TransitionablePortal>
            </List>)
        } else {
            return <Header textAlign="center" as='h3'>You have not registered any payment methods</Header>
        }
    }

    addPaymentMethod = () => {
        return (
            <Input fluid/>
        )
    }

    renderOrdersContent() {
        if (this.state.render) {
            return (
                <div>
                    <Divider horizontal>
                        <Header as='h2'>Payment Methods</Header>
                    </Divider>
                    {this.state.paymentFetched
                        ?this.paymentMethods()
                        :<Loader active>Loading</Loader>}
                    {this.state.paymentFetched
                        ?this.addPaymentMethod()
                        :""}
                    <Divider hidden/>
                    <Divider horizontal>
                        <Header as='h2'>Pending Orders</Header>
                    </Divider>
                    {this.state.currentOrders.length>0?
                        this.ordersList(this.state.currentOrders):
                        <Header textAlign="center" as='h3'>There are no pending orders</Header>}
                    <Divider hidden/>
                    <Divider horizontal>
                        <Header as='h2'>Past Orders</Header>
                    </Divider>
                    {this.state.pastOrders.length>0?
                        this.ordersList(this.state.pastOrders):
                        <Header textAlign="center" as='h3'>You have no past orders</Header>}
                    <Divider hidden/>
                </div>
            )
        } else {
            return (
                <Loader active>Loading</Loader>
            )
        }
    }

    render() {
        return (
            <Container fluid textAlign="center">
                <Header as='h1'>Account Dashboard</Header>
                <Grid centered className="tablet computer only">
                    <Grid.Column width={2}>
                        <Menu vertical fluid pointing>
                            <Menu.Item
                                name="orders"
                                active={this.state.activeItem === 'orders'}
                                onClick={this.handleItemClick}/>
                            <Menu.Item
                                name="summary"
                                active={this.state.activeItem === 'summary'}
                                onClick={this.handleItemClick}/>
                            <Menu.Item
                                name="logout"
                                onClick={this.handleLogout}/>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column stretched width={8}>
                        <Segment>
                            {this.state.activeItem==="summary" ? this.renderSummaryContent(): this.renderOrdersContent()}
                        </Segment>
                    </Grid.Column>
                </Grid>
                <Grid centered className="mobile only">
                    <Grid.Column width={16}>
                        <Menu pointing fluid>
                            <Menu.Item
                                name="orders"
                                active={this.state.activeItem === 'orders'}
                                onClick={this.handleItemClick}/>
                            <Menu.Item
                                name="summary"
                                active={this.state.activeItem === 'summary'}
                                onClick={this.handleItemClick}/>
                            <Menu.Item
                                position="right"
                                name="logout"
                                onClick={this.handleLogout}/>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column stretched width={16}>
                        <Segment>
                            {this.state.activeItem==="summary" ? this.renderSummaryContent(): this.renderOrdersContent()}
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}
