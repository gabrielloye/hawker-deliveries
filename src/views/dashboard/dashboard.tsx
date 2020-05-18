import React, { Component } from "react";
import { Modal, Container, Grid, Menu, Segment, Loader, Statistic, Divider, List, Header } from "semantic-ui-react";
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment';
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
    currentOrders: Order[]
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
        currentOrders: []
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

    renderOrdersContent() {
        if (this.state.render) {
            return (
                <div>
                    <Divider horizontal>
                        <Header as='h2'>Pending Orders</Header>
                    </Divider>
                    {this.state.currentOrders.length>0?
                        this.ordersList(this.state.currentOrders):
                        <Header as='h3'>There are no pending orders</Header>}
                    <Divider horizontal>
                        <Header as='h2'>Past Orders</Header>
                    </Divider>
                    {this.state.pastOrders.length>0?
                        this.ordersList(this.state.pastOrders):
                        <Header as='h3'>You have no past orders</Header>}
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
                        <Menu vertical fluid tabular>
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
