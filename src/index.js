import React, { Component } from "react";
import PropTypes from "prop-types";

const DEV_ENV = "tartan";
const PROD_ENV = "production";
const AUTH_PRODUCT = "auth";
const CONNECT_PRODUCT = "connect";
// We use this to handle open/loaded to prevent unnecessary re-rendering

class ReactPlaid extends Component {
  static propTypes = {
    open: PropTypes.bool,
    // Displayed once a user has successfully linked their account
    clientName: PropTypes.string.isRequired,
  
    // The Plaid API environment on which to create user accounts.
    // For development and testing, use tartan. For production, use production
    env: PropTypes.oneOf([DEV_ENV, PROD_ENV]).isRequired,
  
    // Open link to a specific institution, for a more custom solution
    institution: PropTypes.string,
  
    // Set to true to launch Link with longtail institution support enabled.
    // Longtail institutions are only available with the Connect product.
    longtail: PropTypes.bool,
  
    // The public_key associated with your account; available from
    // the Plaid dashboard (https://dashboard.plaid.com)
    key: PropTypes.string.isRequired,
  
    // The Plaid product you wish to use, either auth or connect.
    product: PropTypes.oneOf([AUTH_PRODUCT, CONNECT_PRODUCT]).isRequired,
  
    // Specify an existing user's public token to launch Link in update mode.
    // This will cause Link to open directly to the authentication step for
    // that user's institution.
    token: PropTypes.string,
  
    // Set to true to launch Link with the 'Select Account' pane enabled.
    // Allows users to select an individual account once they've authenticated
    selectAccount: PropTypes.bool,
  
    // Specify a webhook to associate with a user.
    webhook: PropTypes.string,
  
    // A function that is called when a user has successfully onboarded their
    // account. The function should expect two arguments, the public_key and a
    // metadata object
    onSuccess: PropTypes.func.isRequired,
  
    // A function that is called when a user has specifically exited Link flow
    onExit: PropTypes.func,
  
    // A function that is called when the Link module has finished loading.
    // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
    // delayed until the module is fully loaded.
    onLoad: PropTypes.func,
    // Called immediately to tell the code is loading
    onLoading: PropTypes.func,
    // Called when plaid opens. This may be immediately after load, or plaid is still loading this will be called if open is requested but load hasn't succeeded yet
    onOpen: PropTypes.func,
  };
  static defaultProps = {
    onExit: () => {},
    onSuccess: () => {},
    onLoad: () => {},
    onLoading: () => {},
    onOpen: () => {},
  };

  loaded = false;
  open = false;

  componentDidMount() {
    this.linkHandler = Plaid.create({
      clientName: this.props.clientName,
      product: this.props.product,
      key: this.props.key,
      env: this.props.env,
      webhook: this.props.webhook,
      token: this.props.token,
      selectAccount: this.props.selectAccount,
      longtail: this.props.longtail,
      onLoad: this.handleLoad,
      onSuccess: this.handleSuccess,
      onExit: this.handleExit,
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
  }

  handleLoad = () => {
    this.loaded = true;
    this.props.onLoad();
    if (this.open) this.handleOpen();
  }

  handleSuccess = (publicToken, metaData) => {
    this.props.onSuccess(publicToken, metaData);
  }

  handleExit = () => {
    this.open = false;
    this.props.onExit();
  }

  render() {
    return this.props.children || null;
  }
}

export default ReactPlaid;
export { DEV_ENV, PROD_ENV, AUTH_PRODUCT, CONNECT_PRODUCT };
