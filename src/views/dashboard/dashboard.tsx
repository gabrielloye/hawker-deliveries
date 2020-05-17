import React, { Component } from "react";
import { Modal, Container, Grid, Menu, Segment, Loader, Statistic, Divider, List, Header } from "semantic-ui-react";
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment';
import { AUTH_USER_TOKEN_KEY } from '../../auth/Utils/constants';
import { Auth } from "aws-amplify";
import { notification } from "antd";
import "semantic-ui-css/semantic.min.css";

type Order = {
    date: string,
    name: string,
    code: string,
    total_cost: number,
    items: any[]
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
        activeItem: "summary",
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
                phone_number: res['phone_number'].substring(1,)
            })
            this.fetchOrders(res['sub'])
        })
    }

    fetchOrders(userId: string) {
        // Fetch orders for userId and set state here
        const pastOrders = [
            {
                "date": "15052020",
                "name": "Tanglin Halt Market",
                "code": "THM",
                "total_cost": 6.7,
                "items": [
                    {
                        "name": "Ice Milo",
                        "price": 1.7
                    },
                    {
                        "name": "Prawn Noodle",
                        "price": 5
                    }
                ]
            },
            {
                "date": "14052020",
                "name": "Telok Blangah Rise Market & Food Centre",
                "code": "TBR",
                "total_cost": 4.4,
                "items": [
                    {
                        "name": "Tea w Milk",
                        "price": 0.9
                    },
                    {
                        "name": "Steamed Chicken Rice",
                        "price": 3.5
                    }
                ]
            }
        ]
        const currentOrders = [
            {
                "date": moment().format("DDMMYYYY"),
                "name": "Tanglin Halt Market",
                "code": "THM",
                "total_cost": 1.9,
                "items": [
                    {
                        "name": "Coffee 'O'",
                        "price": 0.7
                    },
                    {
                        "name": "Fried Bee Hoon",
                        "price": 1.2
                    }
                ]
            }
        ]
        this.setState({
            render: true,
            pastOrders,
            currentOrders
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
            return (
                <div>
                    <h2>Orders Summary</h2>
                    <Statistic.Group size="large">
                        <Statistic>
                            <Statistic.Value>0</Statistic.Value>
                            <Statistic.Label>Items ordered</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>0</Statistic.Value>
                            <Statistic.Label>Orders placed</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>0</Statistic.Value>
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
        return (
            <List relaxed animated selection>
                {orders.map((order: Order) => (
                    <Modal size="small" trigger={
                    <List.Item>
                        <List.Content floated='right'>
                            ${order['total_cost'].toFixed(2)}
                        </List.Content>
                        <List.Content>
                            <List.Header>{moment(order['date'], "DDMMYYYY").format("DD-MM-YYYY")}</List.Header>
                            {order['name']}
                        </List.Content>
                    </List.Item>} closeIcon>
                        <Modal.Header>Order on {moment(order['date'], "DDMMYYYY").format("DD-MM-YYYY")}</Modal.Header>
                        <Modal.Content>
                            
                            <List ordered>
                                {order['items'].map((item) => (
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
                                        ${order['total_cost'].toFixed(2)}
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
                        <Header as='h2'>Current Orders</Header>
                    </Divider>
                    {this.ordersList(this.state.currentOrders)}
                    <Divider horizontal>
                        <Header as='h2'>Past Orders</Header>
                    </Divider>
                    {this.ordersList(this.state.pastOrders)}
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
                                name="summary"
                                active={this.state.activeItem === 'summary'}
                                onClick={this.handleItemClick}/>
                            <Menu.Item
                                name="orders"
                                active={this.state.activeItem === 'orders'}
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
                                name="summary"
                                active={this.state.activeItem === 'summary'}
                                onClick={this.handleItemClick}/>
                            <Menu.Item
                                name="orders"
                                active={this.state.activeItem === 'orders'}
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
