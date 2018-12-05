import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';

import { Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment } from 'semantic-ui-react'



class Player extends React.Component{
    constructor(){
        super();
        {
            this.state = {
                player:''
            }
        }
    }
componentDidMount(){
      // < !--=== VIDEO PLAYER == -->
    if (this.props.playerDisplayTag.length > 1) {
          
        let playerTag = this.props.playerDisplayTag.split('<!--===VIDEO PLAYER==-->');
        this.setState({ player: playerTag[1]})
        console.log('HERE', playerTag[1]);
        // let playerTag = tag.split('<!--===VIDEO PLAYER==-->');
      }
    // var mdiv = document.createElement("div");
    // mdiv.innerHTML = `<div class="pilot-video"> <video id='pid-131' class="video-js vjs-default-skin vjs-big-play-centered pilot-player" controls data-setup='{"fluid":true}' width='230' height='609' data-view='mobile_web' value='https://adn.pilotx.tv/op?pid=131&pageurl={PAGEURL}&domain={DOMAIN}&w=230&h=609' playsinline> <source src="https://youtu.be/cd6QbCowjS8" type="video/mp4"></source> </video> </div>`;
    // document.getElementById('content').appendChild(mdiv);
 
}
  
    render(){
       
        // const {playerDisplayTag} = this.props;
        return(
            <div style={{ height: '690px', overflowY: 'scroll'}}>
                <Container text style={{ marginTop: '7em'}}>
                    <Header as='h1'>Semantic UI React Fixed Template</Header>
                    <p>This is a basic fixed menu template using fixed size containers.</p>
                    <p>A text container is used for the main container, which is useful for single column layouts.</p>
                
                    <div dangerouslySetInnerHTML={{
                        __html: `<div className="pilot-video">
            <video id='pid-3' className="video-js vjs-default-skin vjs-big-play-centered pilot-player" controls
                width='600' height='320' data-vol='100' value="https://adn.pilotx.tv/vast?pid=1&pageurl={PAGEURL}&domain={DOMAIN}&w={W}&h={H}"
                autoplay muted playsinline>
                <source src="https://youtu.be/cd6QbCowjS8" type="video/mp4"></source>
            </video>
        </div>`}} />

                    <p>This is a basic fixed menu template using fixed size containers.</p>
                    <p>A text container is used for the main container, which is useful for single column layouts.</p>

                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime voluptate consectetur ab velit aut eligendi, ullam
            accusantium cupiditate doloremque nisi eius culpa sunt quibusdam deserunt officiis? Ipsam deserunt et tenetur
            nihil quidem velit harum? Id quisquam voluptates eligendi est nobis harum impedit commodi soluta et sint sequi,
            quod quidem consequuntur dolorem corrupti vitae omnis. Obcaecati ratione sapiente exercitationem quis dolore.</p>

                    <h2>Lorem ipsum dolor sit.</h2>

                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident sequi delectus ducimus temporibus debitis natus,
            aliquam impedit saepe, doloribus a modi consectetur fugit unde? Maxime illo molestiae libero? Molestias labore
            ratione necessitatibus veniam. Doloremque nesciunt rerum incidunt nam ad quo sed porro, molestias mollitia aut,
            quaerat provident minima ab harum?</p>

                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime voluptate consectetur ab velit aut eligendi, ullam
            accusantium cupiditate doloremque nisi eius culpa sunt quibusdam deserunt officiis? Ipsam deserunt et tenetur
            nihil quidem velit harum? Id quisquam voluptates eligendi est nobis harum impedit commodi soluta et sint sequi,
            quod quidem consequuntur dolorem corrupti vitae omnis. Obcaecati ratione sapiente exercitationem quis dolore.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime voluptate consectetur ab velit aut eligendi, ullam
            accusantium cupiditate doloremque nisi eius culpa sunt quibusdam deserunt officiis? Ipsam deserunt et tenetur
            nihil quidem velit harum? Id quisquam voluptates eligendi est nobis harum impedit commodi soluta et sint sequi,
            quod quidem consequuntur dolorem corrupti vitae omnis. Obcaecati ratione sapiente exercitationem quis dolore.</p>

                    <h2>Lorem ipsum dolor sit.</h2>
                </Container>

                <Segment
                    
                    vertical
                    style={{ margin: '5em 0em 0em', padding: '5em 0em' }}
                >
                    <Container textAlign='center'>
                        <Grid divided  stackable>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <Header  as='h4' content='Group 1' />
                                    <List link >
                                        <List.Item as='a'>Link One</List.Item>
                                        <List.Item as='a'>Link Two</List.Item>
                                        <List.Item as='a'>Link Three</List.Item>
                                        <List.Item as='a'>Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header  as='h4' content='Group 2' />
                                    <List link >
                                        <List.Item as='a'>Link One</List.Item>
                                        <List.Item as='a'>Link Two</List.Item>
                                        <List.Item as='a'>Link Three</List.Item>
                                        <List.Item as='a'>Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header  as='h4' content='Group 3' />
                                    <List link >
                                        <List.Item as='a'>Link One</List.Item>
                                        <List.Item as='a'>Link Two</List.Item>
                                        <List.Item as='a'>Link Three</List.Item>
                                        <List.Item as='a'>Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header  as='h4' content='Footer Header' />
                                    <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <Divider  section />
                        <Image
                            centered
                            size='mini'
                            src='/logo.png'
                        />
                        <List horizontal  divided link>
                            <List.Item as='a' href='#'>Site Map</List.Item>
                            <List.Item as='a' href='#'>Contact Us</List.Item>
                            <List.Item as='a' href='#'>Terms and Conditions</List.Item>
                            <List.Item as='a' href='#'>Privacy Policy</List.Item>
                        </List>
                    </Container>
                </Segment>
            </div>
        )
    }
}

function mapStateToProps(state){
    // return {
    //     playerDisplayTag: state.modal.playerDisplayTag
        
    // }
    const { playerDisplayTag } = state.modal;
  
    return { playerDisplayTag};
    
}

export default connect(mapStateToProps)(Player);