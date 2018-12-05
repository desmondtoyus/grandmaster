import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

class Paginator extends Component {
  handlePagination = (event, data) => {
    const { totalPages, currentPage } = this.props.pagination;

    if (data.id) {
      switch (data.id) {
        case "first":
          this.props.handlePagination(1);
          break;
        case "prev":
          if (currentPage !== 1 && totalPages !== 1) {
            this.props.handlePagination(currentPage - 1);
          }
          break;
        case "next":
          if (currentPage !== totalPages && totalPages !== 1) {
            this.props.handlePagination(currentPage + 1);
          }
          break;
        case "last":
          this.props.handlePagination(totalPages);
          break;
      }
    }
    else {
      this.props.handlePagination(data.children);
    }
  };

  getMidpageNumber = () => {
    const { totalPages, currentPage } = this.props.pagination;
    switch (currentPage) {
      case 1:
        return 2;
      case totalPages:
        return totalPages - 1;
      default:
        return currentPage;
    }
  };

  render() {
    const { totalPages, currentPage } = this.props.pagination;

    return (
      <Menu size="mini" floated="right" pagination>
        <Menu.Item id="first" onClick={this.handlePagination} as='a' icon>
          <Icon name="double angle left" />
        </Menu.Item>
        <Menu.Item id="prev" onClick={this.handlePagination} as='a' icon>
          <Icon name="angle left" />
        </Menu.Item>
        {totalPages === 1 ? <Menu.Item onClick={this.handlePagination} as='a' active={currentPage === 1}>{currentPage}</Menu.Item> : null}
        {totalPages === 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={currentPage === 1}>{1}</Menu.Item> : null}
        {totalPages > 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={currentPage === 1}>{currentPage === 1 ? 1 : this.getMidpageNumber() - 1}</Menu.Item> : null}
        {totalPages === 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={currentPage === 2}>{2}</Menu.Item> : null}
        {totalPages > 2 ? <Menu.Item onClick={this.handlePagination} as="a" active={currentPage !== 1 && currentPage !== totalPages}>{this.getMidpageNumber()}</Menu.Item> : null}
        {totalPages > 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={currentPage === totalPages}>{this.getMidpageNumber() + 1}</Menu.Item> : null}
        <Menu.Item id="next" onClick={this.handlePagination} as='a' icon>
          <Icon name="angle right" />
        </Menu.Item>
        <Menu.Item id="last" onClick={this.handlePagination} as='a' icon>
          <Icon name="double angle right" />
        </Menu.Item>
      </Menu>
    )
  }
}

export default Paginator;