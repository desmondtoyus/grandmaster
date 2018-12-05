// ol, ul {
//     list - style: none;
// }
// li {
//     display: inline - block;
//     padding: 20px 0 20px;
//     vertical - align: middle;
// }
// a: hover, a: focus, a: active {
//     color: #999;
//     text - decoration: none;
// }
// a {
//     font - family: Arial, 'Helvetica Neue', Helvetica, sans - serif;
//     text - decoration: none;
//     transition: color 0.1s, background - color 0.1s;
// }
// a {
//     position: relative;
//     display: block;
//     padding: 16px 0;
//     margin: 0 12px;
//     letter - spacing: 1px;
//     font - size: 12px;
//     line - height: 16px;
//     font - weight: 900;
//     text - transform: uppercase;
//     transition: color 0.1s, background - color 0.1s, padding 0.2s ease -in;
//     color: #000;
// }
// a:: before {
//     content: '';
//     display: block;
//     position: absolute;
//     bottom: 3px;
//     left: 0;
//     height: 3px;
//     width: 100 %;
//     background - color: #000;
//     transform - origin: right top;
//     transform: scale(0, 1);
//     transition: color 0.1s, transform 0.2s ease - out;
// }
// a: active:: before {
//     background - color: #000;
// }
// a: hover:: before, a: focus:: before {
//     transform - origin: left top;
//     transform: scale(1, 1);
// }

// =============================================================================

{/* <nav>
    <ul>
        <li class="item"><a href="#">link 1</a></li>
        <li class="item"><a href="#">link 2</a></li>
        <li class="item"><a href="#">link 3</a></li>
        <li class="item"><a href="#">link 4</a></li>
        <li class="item"><a href="#">link 5</a></li>
    </ul>
</nav> */}




import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

export default class Example extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Tab1
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Moar Tabs
            </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">
                                <h4>Tab 1 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="6">
                                <Card block>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                    <Button>Go somewhere</Button>
                                </Card>
                            </Col>
                            <Col sm="6">
                                <Card block>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                    <Button>Go somewhere</Button>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}