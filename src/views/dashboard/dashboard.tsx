import React, { Component } from "react";
import { TransitionablePortal, Image, Button, Icon, Label, Input, Modal, Container, Grid, Menu, Segment, Loader, Statistic, Divider, List, Header, Dropdown, Message } from "semantic-ui-react";
import { RouteComponentProps } from 'react-router';
import moment, {Moment} from 'moment';
import { AUTH_USER_TOKEN_KEY } from '../../auth/Utils/constants';
import { Auth } from "aws-amplify";
import { notification } from "antd";
import API from '../../components/axiosapi';
import "semantic-ui-css/semantic.min.css";
import "./dashboard.css"

type Order = {
    date: string,
    meal: string,
    zone: string,
    totalPrice: number,
    cart: any[],
    paymentMethod: string,
    paymentUsername: string,
    dateTime: string,
    paid: boolean
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
    errorPortal: boolean,
    newPaymentMethod: any,
    newPaymentUsername: string
}

const paymentOptions = [
    {
        key: "PayLah!",
        text: "PayLah!",
        value: "PayLah!"
    },
    {
        key: "PayNow",
        text: "PayNow",
        value: "PayNow"
    }
]

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
        errorPortal: false,
        newPaymentMethod: "",
        newPaymentUsername: ""
    }

    componentDidMount() {
        Auth.currentUserInfo().then((resp)=>{
            const res = resp['attributes']
            this.fetchOrders(res['sub'])
            this.fetchUser(res['sub'])
            this.setState({
                name: res['name'],
                user_id: res['sub'],
                email: res['email'],
                phone_number: res['phone_number']
            })
        })
    }

    fetchUser(userId: string) {
        API.post('/users/'+userId).then(res => {
            const data = res.data
            let payments = data['payment'].map((payment:any)=>{
                return {...payment, disabled: true, newUsername: payment['username'], warning: false}
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
            "awsId": userId
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
                    <Statistic.Group widths={3}>
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
                        {/* <Statistic>
                            <Statistic.Value>0</Statistic.Value>
                            <Statistic.Label>Hawker Centers</Statistic.Label>
                        </Statistic> */}
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

    ordersList(orders: Order[], current: boolean) {
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
                            {order['zone']} ({Capitalize(order['meal'])})
                        </List.Content>
                    </List.Item>} closeIcon>
                        <Modal.Header>Order on {moment(order['date'], "DDMMYYYY").format("DD-MM-YYYY")}
                        <Header style={{color: '#8c8c8c'}} as='h4'>{order['zone']} ({Capitalize(order['meal'])})</Header>
                        </Modal.Header>
                        <Modal.Content>
                            <List ordered>
                                {order['cart'].map((item) => (
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
                            <Divider/>
                            <List>
                                <List.Item>
                                <List.Content floated="right">
                                    ${order['cart'].map((item) => item['price']*item['quantity'])
                                        .reduce((a,b) => a+b, 0).toFixed(2)}
                                </List.Content>
                                <List.Content>
                                    Total Food Cost:
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content floated="right">
                                        ${order['cart'].map((item) => item['margin']*item['quantity'])
                                            .reduce((a,b) => a+b, 0).toFixed(2)}
                                    </List.Content>
                                    <List.Content>
                                        Service Fee:
                                    </List.Content>
                                </List.Item>
                                <Divider />
                                <List.Item>
                                    <List.Content floated="right">
                                        ${order['totalPrice'].toFixed(2)}
                                    </List.Content>
                                    <List.Content>
                                        Total Cost:
                                    </List.Content>
                                </List.Item>
                            </List>
                            <Header as='h4'>Payment Method:</Header>
                            <List horizontal>
                                <List.Item>
                                    <List.Header>Method</List.Header>
                                    {order['paymentMethod']}
                                </List.Item>
                                <List.Item>
                                    <List.Header>Username</List.Header>
                                    {order['paymentUsername']}
                                </List.Item>
                            </List>
                            {current ?
                            <div>
                            <Divider hidden/>
                            <Image centered src={`/images/qr_${order['zone']}.jpg`} size="large" />
                            <Grid>
                                <Grid.Column textAlign='center' className="priceHeader">
                                <strong>Total Cost:</strong> ${order['totalPrice'].toFixed(2)}
                                </Grid.Column>
                            </Grid>
                            <List>
                                <List.Item>
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
                                    <a type="image/*" target="_blank" href={`/images/qr_${order['zone']}.jpg`} download="qrCode.jpg">
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
                                <List.Item>
                                    <List.Header>
                                        Join the Telegram Channel
                                    </List.Header>
                                    <List.Content>
                                        You can join the Telegram channel <a href="https://t.me/joinchat/AAAAAExr30H7-5Pca7zfUA">here</a> for updates on delivery times and pickup!
                                    </List.Content>
                                </List.Item>
                            </List.Content>
                            </List.Item>
                            </List></div> : "" }
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

    modifyMethodNewUsername = (method: string, newUsername: string, warning: boolean, username: string) => {
        this.setState({
            payment: this.state.payment.map((p: any) => {
                if (p.method === method) {
                    p['newUsername'] = newUsername
                }
                return p
            })
        })
        if (username !== newUsername) {
            this.checkMethodUsernameAvailable(method, newUsername, warning)
        }
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

    checkMethodUsernameAvailable = (method: string, newUsername: string, warning: boolean) => {
        API.post('/users/payment/check', {awsId: this.state.user_id, method: method, username: newUsername})
            .then(res=>{
                if (res['data']['available'] == warning) {
                    this.setState({
                        payment: this.state.payment.map((p: any) => {
                            if (p.method===method) {
                                p['warning'] = !p['warning']
                            }
                            return p
                        })
                    })
                }
            })
    }

    paymentMethods() {
        if (this.state.payment.length>0) {
            return (<List>
                {this.state.payment.map((payment: any) => {
                    return <List.Item>
                        <Input fluid
                            error = {
                                payment['warning']
                            }
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
                                                        this.modifyMethodNewUsername(payment['method'], payment['username'], payment['warning'], payment['username'])
                                                    }
                                                    this.toggleEditMethod(payment['method'])
                                                })
                                            } else {
                                                this.toggleEditMethod(payment['method'])
                                            }
                                        }}>
                                        <Icon name={payment['disabled']?'edit':'check'} />
                                    </Button>
                                    <Button negative icon
                                        onClick={()=>{
                                            API.post('/users/payment/delete', {awsId: this.state.user_id, method: payment['method'], username: payment['username']})
                                                .then((res:any) => {
                                                    if ("success" in res['data']) {
                                                        const payments = this.state.payment.filter((p: any) =>
                                                            p['method'] !== payment['method']
                                                        )
                                                        this.setState({payment: payments})
                                                    } else {
                                                        this.setState({
                                                            errorPortal: true
                                                        })
                                                    }
                                                })
                                        }}>
                                        <Icon name='delete' />
                                    </Button>
                                </Button.Group>
                            }
                            onChange={(e, data) => {
                                this.modifyMethodNewUsername(payment['method'], data['value'], payment['warning'], payment['username'])
                            }}
                            style={{"opacity":"1"}}
                            value={payment['newUsername']}
                            disabled={payment['disabled']}/>
                        {payment.warning?<Message attached='bottom' negative>
                            There is another user with this username as well. To avoid any conflicts, we suggest that you modify your username in your payment application!
                        </Message>:""}
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
            return (
            <Message negative>
                <Header textAlign="center" as='h3'>You have not registered any payment methods. <br/>Please add a payment method in order to place an order.</Header>
            </Message>
            )
        }
    }

    addPaymentMethod = () => {
        const currentMethods: string[] = this.state.payment.map(payment=>payment['method'])
        let options: any[] = paymentOptions.filter((option:any) => !currentMethods.includes(option['value']))
        if (options.length>0) {
            return (
                <div>
                    <Header as='h3'>Add New Payment Method</Header>
                    <Input fluid
                        placeholder="Username"
                        label={
                            <Dropdown
                            button
                            placeholder='Method'
                            options={options}
                            value={this.state.newPaymentMethod}
                            onChange={(e, data) => this.setState({newPaymentMethod: data['value']})}/>
                        }
                        value={this.state.newPaymentUsername}
                        onChange={(e, data) => this.setState({newPaymentUsername: data['value']})}
                        action={
                            <Button icon positive
                                disabled={this.state.newPaymentMethod.length===0 || this.state.newPaymentUsername.length===0}
                                onClick={(e, data) => {
                                    API.post('/users/payment/add', {awsId:this.state.user_id, method: this.state.newPaymentMethod, username: this.state.newPaymentUsername})
                                        .then((res: any) => {
                                            if ("success" in res['data']) {
                                                const payments: any[] = this.state.payment
                                                payments.push({
                                                    method: this.state.newPaymentMethod,
                                                    username: this.state.newPaymentUsername,
                                                    disabled: true,
                                                    newUsername: this.state.newPaymentUsername
                                                })
                                                this.setState({
                                                    payment:payments,
                                                    newPaymentMethod: "",
                                                    newPaymentUsername: ""
                                                })
                                            } else {
                                                this.setState({
                                                    errorPortal: true
                                                })
                                            }
                                        })
                                    
                                }}>
                                <Icon name="add"/>
                            </Button>
                        }/>
                    <List>
                        <List.Item>
                            <strong>PayNow:</strong> Full Name as on NRIC
                        </List.Item>
                        <List.Item>
                            <strong>PayLah!:</strong> PayLah username as shown on your PayLah app profile page
                        </List.Item>
                    </List>
                    <i>Note: Payment information is collected to faciliate the payment verification on our end before placing orders. Please ensure that your information is accurate and payment is made immediately after ordering.</i>
                </div>
            )
        }
    }

    renderOrdersContent() {
        if (this.state.render && this.state.paymentFetched) {
            return (
                <div>
                    <Divider horizontal>
                        <Header as='h2'>Payment Methods</Header>
                    </Divider>
                    {this.state.paymentFetched
                        ?this.paymentMethods()
                        :<Loader active>Loading</Loader>}
                    <Divider hidden/>
                    {this.state.paymentFetched
                        ?this.addPaymentMethod()
                        :""}
                    <Divider hidden/>
                    <Divider horizontal>
                        <Header as='h2'>Pending Orders</Header>
                    </Divider>
                    {this.state.currentOrders.length>0?
                        this.ordersList(this.state.currentOrders, true):
                        <Header textAlign="center" as='h3'>There are no pending orders</Header>}
                    <Divider hidden/>
                    <Divider horizontal>
                        <Header as='h2'>Past Orders</Header>
                    </Divider>
                    {this.state.pastOrders.length>0?
                        this.ordersList(this.state.pastOrders, false):
                        <Header textAlign="center" as='h3'>You have no past orders</Header>}
                    <Divider hidden/>
                </div>
            )
        } else {
            return (
                <Container style={{"padding": "5em"}}>
                    <Loader active>Loading</Loader>
                </Container>
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
