import React, { Component } from "react";
import API from '../../components/axiosapi';
import { Card, Accordion, Icon, Grid, Container, Header, Segment, Divider } from 'semantic-ui-react';
import '../../components/hawkerlist.css'
const team = [
    {
        name: "Donovan Liew",
        url: "don"
    },
    {
        name: "Benjamin Fong",
        url: "benfong"
    },
    {
        name: "Gabriel Loye",
        url: "gab"
    },
    {
        name: "Jeremy Loye",
        url: "jem"
    },
    {
        name: "Angelica Ang",
        url: "angelica"
    },
    {
        name: "Arnold Teo",
        url: "arnold"
    }
]

export default class AboutPage extends Component {
    state = { activeIndex: -1 }

    handleAccordionClick = (e:  any, titleProps: any) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
      }

    render() {
        const {activeIndex} = this.state
        return (
            <Container text fluid textAlign="center">
                <Segment>
                <Grid>
                    <Grid.Row columns={1}>
                        <Grid.Column textAlign='justified' stretched>
                            
                            <Divider horizontal>
                                <Header as='h2'>Our Story</Header>
                            </Divider>
                            <p>
                                We are a group of students from the College of Alice & Peter Tan (CAPT) hoping to do our bit for our local hawkers during this challenging period.
                                <br/>
                                <br/>
                                This idea germinated in early April when we realised that us students, who are now ‘stuck’ in UTown, nevertheless crave for hawker food (& are looking for alternatives to UTown food options!) Yet, many of our local hawkers have also seen reduced foot traffic due to SG’s safe management measures.
                                <br/>
                                <br/>
                                We have friends whose parents/grandparents are hawkers too. Hearing their personal stories  and challenges egged us on to bridge the gap, no matter how small our efforts may be. Hence, with lunch not catered for in UTown (during the semester), this project could be said to be born out of necessity as we ourselves, preferred not to be limited to just options within NUS itself.
                                <br/>
                                <br/>
                                So essentially, what we have done was to build a relationship with the hawkers around NUS, collate orders within our residential community in CAPT, and have the food delivered to our College via our Private-Hire Vehicle (PHV) driver partners - who have their incomes affected too.
                                <br/>
                                <br/>
                                Since then, our platform has evolved, and we aim to now offer this service to other residential communities in NUS and beyond.
                                <br/>
                                <br/>
                                Again, with no commissions taken, we’re hoping to take care of your meals while supporting our hawker and driver partners during this uncertain period. Let’s all do our part and support our local heroes!
                            </p>
                        </Grid.Column>
                        </Grid.Row>
                        <Divider horizontal>
                            <Header as='h2'>Our Team</Header>
                        </Divider>
                        <Grid.Row centered>
                            <Grid.Column width={14}>
                                <Card.Group itemsPerRow={3} stackable>
                                    {team.map(member=>{
                                        return (
                                            <Card
                                                fluid>
                                                <div className="listingImage" style={{"height":"150px", "backgroundImage":`url(https://hawker-images.s3-ap-southeast-1.amazonaws.com/team/${member.url}.jpg)`}}/>
                                                <Card.Content textAlign='center'>
                                                    <Card.Header as='h6'>
                                                        {member.name}
                                                    </Card.Header>
                                                </Card.Content>
                                            </Card>
                                        )
                                    })}
                                </Card.Group>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign='justified' stretched>
                                <Divider horizontal>
                                    <Header as='h2'>FAQ</Header>
                                </Divider>
                                <Accordion fluid styled>
                                    <Accordion.Title
                                        active={activeIndex === 0}
                                        index={0}
                                        onClick={this.handleAccordionClick}>
                                        <Icon name='dropdown' />
                                        What are the Service/Delivery fees for?
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0}>
                                        <p>
                                            As we aim to support local hawkers & PHV drivers during this challenging period, we have promised not to take a single cent of commission from them. What you paid is what is listed, and what will be paid to them. 
                                            <br/>
                                            <br/>
                                            As this initiative initially blossomed under a not-to-profit model in CAPT, the main goal remains the same, which is to provide residents with alternative options for your meals, while simultaneously supporting the livelihoods our hawkers and PHV drivers.
                                            <br/>
                                            <br/>
                                            This Delivery & Service Fee that you see added to each item is our way of making sure we remain sustainable, without eating into the already narrow margins of our Hawker & Delivery partners. Let us explain how the costs add up, and how we are doing our best to minimise the fees on your end. 
                                            <br/>
                                            <br/>
                                            First, the bulk of this fee is to cover the delivery charges, which in total, are much higher considering the spike in demand for food delivery services. Due to our scale, we are unable to fit them on a bike or a motorcycle, and will have to pay a bit more for a larger vehicle. Nonetheless, with us benefitting from the economies of scale, we are sure that it is still much cheaper than what you might pay via the range of Food Delivery Applications currently available. 
                                            <br/>
                                            <br/>
                                            Next, the second chunk of the fees goes to maintaining this system and platform, along with the pesky bank handling fees (now you know why some hawkers only deal with cash…) This goes a long way to make sure our webpage is running, coordinators and are supported, and for us to have a dedicated customer service hotline if there are any issues or feedback. Without this, our service would be sub-par, and not something we are proud to have, especially when we feature the hawkers who have committed their whole lives to honing their craft.
                                            <br/>
                                            <br/>
                                            Lastly, some of these fees are used to pay for the plastic food containers and cups that come along with your orders. All these are as-charged, and again, we do not take a single cent from these at all. 
                                            <br/>
                                            <br/>
                                            We are looking forward to providing you with this value-added service, and hope you understand the need for our fees. Anyways, for a start, we will be absorbing most of the fees until further notice, and will be striving to serve you well, first. We apologise for the teething issues that may (or likely will) occur at the start, and we are looking forward to hearing from you soon!
                                        </p>
                                    </Accordion.Content>
                                    <Accordion.Title
                                        active={activeIndex === 1}
                                        index={1}
                                        onClick={this.handleAccordionClick}>
                                        <Icon name='dropdown' />
                                        Were there any setbacks or challenges in setting this project up? How did you guys work together to overcome them?
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 1}>
                                        <p>
                                            The main challenge was to establish a high level of trust and understanding between us and the community stakeholders (hawkers and drivers). This process of earning their trust has been an exercise in communication, relationship-building, empathy, and having the humility to admit that “We don’t know all the answers”. To then collectively problem-solve, the ability to speak in Mandarin, some Dialects and even a little Bahasa was particularly effective, as our perspectives can only be informed by as much as our partners are willing to share. Hence, language as a common denominator, becomes the bridge in our relationship, facilitating the building of trust between us and the stakeholders. 
                                            <br/>
                                            <br/>
                                            Within our team, another challenge we faced was to have the team work remotely since we were unable to meet up due to the COVID-19 pandemic. This inconvenienced our team as arranging for a discussion required us to consider the various time zones and locations we were in. Given our diverse perspective on the issues and differing ways to tackle them, we worked towards finding avenues to build upon each other’s strengths rather than pick on our limitations. It was this approach that allowed us to work more synergistically, which was helpful in overcoming the challenges this geographical barrier has posed to us.
                                            <br/>
                                            <br/>
                                            Furthermore, as multiple stakeholders are involved, coordination and logistics would be key to operationalising this idea. Thus, the strong support from the residents and Fellows of CAPT have been really heartening, with our Master, A/P Gary Tan, even giving the College a treat for one of the lunches. From being so encouraging and understanding during our initial days, to being so forthcoming with their help and advice, even to the extent of volunteering to assist with the technical and logistical challenges, these CAPTains have been instrumental to the success of this project. We are hence, always grateful!
                                        </p>
                                    </Accordion.Content>
                                </Accordion>
                            
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </Segment>
            </Container>
        )
    }
}