import React, { Component } from "react";
import PropTypes from "prop-types";

const DEV_ENV = "development";
const SANDBOX_ENV = "sandbox";
const PROD_ENV = "production";
const AUTH_PRODUCT = "auth";
const TRANSACTIONS_PRODUCT = "transactions";
const IDENTITY_PRODUCT = "identity";
// We use this to handle open/loaded to prevent unnecessary re-rendering

class ReactPlaid extends Component {
  static propTypes = {
    open: PropTypes.bool,
    clientName: PropTypes.string.isRequired,
    env: PropTypes.oneOf([DEV_ENV, SANDBOX_ENV, PROD_ENV]).isRequired,
    institution: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    product: PropTypes.array.isRequired,
    token: PropTypes.string,
    selectAccount: PropTypes.bool,
    webhook: PropTypes.string,
    onSuccess: PropTypes.func.isRequired,
    onExit: PropTypes.func,
    onLoad: PropTypes.func,
    onLoading: PropTypes.func,
    onOpen: PropTypes.func,
    onEvent: PropTypes.func,
  };
  static defaultProps = {
    apiVersion: "v2",
    onExit: () => {},
    onSuccess: () => {},
    onLoad: () => {},
    onLoading: () => {},
    onOpen: () => {},
    onEvent: () => {},
  };

  loaded = false;
  open = false;

  componentDidMount() {
    this.linkHandler = Plaid.create({
      apiVersion: this.props.apiVersion,
      clientName: this.props.clientName,
      product: this.props.product,
      key: this.props.apiKey,
      env: this.props.env,
      selectAccount: this.props.selectAccount,
      onLoad: this.handleLoad,
      onSuccess: this.handleSuccess,
      onExit: this.handleExit,
      onEvent: this.props.onEvent,
    });

    this.props.onLoading();
    if (this.props.open) this.handleOpen();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open && !prevProps.open) {
      this.handleOpen();
    } else if (prevProps.open && !this.props.open) {
      // Close?
      // Plaid provides no method to close :(
    }
  }

  handleOpen = () => {
    this.open = true;
    if (this.loaded) {
      this.linkHandler.open(this.props.institution);
      this.props.onOpen();
    }
  };

  handleLoad = () => {
    this.loaded = true;
    this.props.onLoad();
    if (this.open) this.handleOpen();
  };

  handleSuccess = (publicToken, metaData) => {
    this.props.onSuccess(publicToken, metaData);
  };

  handleExit = (...args) => {
    this.open = false;
    this.props.onExit(...args);
  };

  render() {
    return this.props.children || null;
  }
}

export default ReactPlaid;
export { DEV_ENV, SANDBOX_ENV, PROD_ENV, AUTH_PRODUCT, IDENTITY_PRODUCT, TRANSACTIONS_PRODUCT };
