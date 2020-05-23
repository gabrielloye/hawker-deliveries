import React from 'react';
import { Menu, Grid, Item, Container } from 'semantic-ui-react';

function Footer () {
    return (
        <div style={{"bottom": "0%", "position": "absolute", "width": "100%", "height": "50px", "zIndex": 0}}>
            <Grid padded>
                <Menu borderless fluid inverted size="huge">
                    <Container>
                        <Item>
                            <Item.Content>
                                <Item.Header style={{"marginBottom": "0.2em","color":"white"}} as="h2">
                                    Contact us at:
                                </Item.Header>
                                <Item.Meta>
                                    WhatsApp: +65 9034 2673<br/>
                                    Telegram: @hawkerjio_bot
                                </Item.Meta>
                            </Item.Content>
                        </Item>
                    </Container>
                </Menu>
            </Grid>
        </div>
    )
}

export default Footer