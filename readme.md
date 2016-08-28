# React Plaid
React plaid component that has no DOM. Pass in the `open` prop to open.
Unforunately there is no close method on Plaid Link.

This plaid component depends on a global Plaid existing (from plaid-link script tag on the page). This may change in the future.

Be sure to handle changing `open` back to `false` with the `onExit` function otherwise you will not be able to re-open.


## Important

This requires you have `<script src="https://cdn.plaid.com/link/stable/link-initialize.js">` on the page before your React executes.

### Example Renderings:
```
render() {
  <ReactPlaid open={this.state.open} onExit={() => this.setState({open: false})}>
    <div>
      Other things here.
    </div>
  </ReactPlaid>
}
```

or

```
render() {
  <div>
    Other DOM elements here.
    <ReactPlaid open={this.state.open} onExit={() => this.setState({open: false})} />
  </div>
}
```


### Full Example

```
import ReactPlaid, { DEV_ENV, PROD_ENV, CONNECT_PRODUCT } from "react-plaid";

class MyPlaidStuff extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      plaidData: [],
    }
  }
  render() {
    <div>
      <button onClick={() => this.setState({ open: true})}>Open Plaid</button>
      {
        this.state.plaidData.map(({ institution }) => <div>{institution.name} - {institution.type}</div>)
      }
      <ReactPlaid 
        clientName="Client Name"
        product={CONNECT_PRODUCT}
        key="123"
        env={DEV_ENV}
        open={this.state.open} 
        onSuccess={(token, metaData) => this.setState({plaidData: metaData})}
        onExit={() => this.setState({open: false})} 
      />
    </div>
  }
}