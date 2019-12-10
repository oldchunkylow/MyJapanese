// Functions
const hasNumber = t => {
  return /\d/.test(t);
};
// React
class Field extends React.Component {
  render() {
    return (
      <div>
        <label htmlFor={this.props.label}> {this.props.labelText} </label>
        <input
          id={this.props.label}
          value={this.props.value}
          onChange={this.props.onChange}
          onClick={this.props.onClick}
          type={this.props.type}
        />
      </div>
    );
  }
}
class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateUser: false,
      showLogin: true
    };
  }
  login = event => {
    event.preventDefault();
    fetch("/users", {
      method: "GET"
    })
      .then(data => {
        return data.json();
      })
      .then(jsonedData => {
        if (
          jsonedData.filter(user => user.user === this.props.user).length > 0
        ) {
          let foundUser = jsonedData.filter(
            user => user.user === this.props.user
          )[0];
          console.log(foundUser);
          if (foundUser.password === this.props.password) {
            console.log("Logged In!");
            this.props.parent.setState({ currentUser: this.props.user });
            console.log(this.props.parent.state.currentUser);
          } else {
            console.log("Wrong Password!");
          }
        } else {
          console.log("Creating User");
        }
      });
  };
  createUser = event => {
    event.preventDefault();
    fetch("/users", {
      method: "GET"
    })
      .then(data => {
        return data.json();
      })
      .then(jsonedData => {
        if (
          jsonedData.filter(user => user.user === this.props.user).length > 0
        ) {
          console.log("EXISTS");
        } else {
          console.log("Creating User");
          fetch("/users", {
            body: JSON.stringify({
              user: this.props.user,
              password: this.props.password
            }),
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          }).then(createdUser => {
            return createdUser.json();
          });
        }
      });
  };
  revealMenu = (event, state) => {
    this.setState({
      showCreateUser: false,
      showLogin: false
    });
    this.setState({
      [event.target.id]: true
    });
  };
  render() {
    return (
      <div>
        <button
          className={this.state.showLogin ? "active-button" : null}
          onClick={event => {
            this.revealMenu(event, this.state.showLogin);
          }}
          value={this.state.showLogin}
          id="showLogin">
          Login{" "}
        </button>{" "}
        <button
          className={this.state.showCreateUser ? "active-button" : null}
          onClick={event => {
            this.revealMenu(event, this.state.showCreateUser);
          }}
          value={this.state.showCreateUser}
          id="showCreateUser">
          Create User{" "}
        </button>{" "}
        {this.state.showLogin ? (
          <form class="loginMenu" onSubmit={() => this.login(event)}>
            <h2> Login Menu </h2>{" "}
            <Field
              labelText="Username: "
              type="text"
              label="user"
              onChange={this.props.onChange}
              value={this.props.user}
            />{" "}
            <Field
              labelText="Password: "
              type="password"
              label="password"
              onChange={this.props.onChange}
              value={this.props.password}
            />{" "}
            <input type="submit" value="Login" />
          </form>
        ) : (
          ""
        )}{" "}
        {this.state.showCreateUser ? (
          <form class="createUserMenu" onSubmit={() => this.createUser(event)}>
            <h2> Create User Menu </h2>{" "}
            <Field
              labelText="Username: "
              type="text"
              label="user"
              onChange={this.props.onChange}
              value={this.props.user}
            />{" "}
            <Field
              labelText="Password: "
              type="password"
              label="password"
              onChange={this.props.onChange}
              value={this.props.password}
            />{" "}
            <input type="submit" value="Create User" />
          </form>
        ) : (
          ""
        )}{" "}
      </div>
    );
  }
}
// App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      savedWords: [],
      slug: "",
      is_common: false,
      japanese: [],
      senses: [],
      currentSearch: [],
      password: "",
      user: "",
      currentUser: ""
    };
  }
  searchWord = event => {
    event.preventDefault();
    fetch("/dictionary/" + this.state.search, {
      method: "GET"
    })
      .then(data => {
        return data.json();
      })
      .then(jsonedData => {
        // let cleanedData = jsonedData.filter(
        //   word => word.slug.hasNumber === true
        // );
        let cleanedData = jsonedData.filter(word => !hasNumber(word.slug));
        this.setState({
          currentSearch: cleanedData
        });
        console.log(this.state.currentSearch);
      });
  };
  addWord = () => {};
  handleChange = event => {
    console.log(event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  handleCheckBox = event => {
    this.state.is_common = !this.state.is_common;
    this.setState({
      [event.target.id]: this.state.is_common
    });
    console.log(this.state.is_common);
  };
  render() {
    return (
      <div class="container">
        <h1 class="row">Japanese Learning</h1>
        {/* Show Login Menu */}
        {!this.state.currentUser ? (
          <UserMenu
            onChange={this.handleChange}
            user={this.state.user}
            password={this.state.password}
            parent={this}
          />
        ) : (
          ""
        )}
        {/* Show Search Forms */}
        {this.state.currentUser ? (
          <div>
            {/* Create Word Form */}
            <form class={this.props.class}>
              <h4>Create a Word</h4>
              <Field
                label="slug"
                labelText="Slug:"
                value={this.state.slug}
                onChange={this.handleChange}
                type="text"
              />
              <Field
                label="is_common"
                labelText="Is Common?"
                value={this.state.is_common}
                onChange={this.handleCheckBox}
                type="checkbox"
              />
              <input type="submit" />
            </form>
            <form onSubmit={this.searchWord}>
              <Field
                label="search"
                labelText="Search for a Term"
                value={this.state.search}
                onChange={this.handleChange}
                type="text"
              />
              <input type="submit" />
            </form>
            {/* Find Word Form */}
            <div class="foundWord">
              {this.state.currentSearch
                ? this.state.currentSearch.map(word => (
                    <div>
                      <h3 className={word.is_common ? "word-common" : null}>
                        {" "}
                        {word.japanese[0].word}({word.japanese[0].reading}){" "}
                      </h3>{" "}
                      {word.is_common ? <span> Common </span> : null}{" "}
                      <h5> Search Term : {word.slug} </h5>
                      <ol>
                        {" "}
                        {word.senses.map(sense => (
                          <li>
                            {" "}
                            {sense.english_definitions}{" "}
                            {sense.parts_of_speech.map((i, index, arr) => {
                              if (arr.length === index + 1) {
                                return i;
                              } else {
                                return i + ", ";
                              }
                            })}{" "}
                          </li>
                        ))}{" "}
                        {word.japanese.length > 1 ? (
                          <p>
                            Other Forms:{" "}
                            {word.japanese.map((i, index, arr) => {
                              if (index === 0) {
                                return null;
                              } else if (
                                index > 0 &&
                                arr.length === index + 1
                              ) {
                                return i.word + "(" + i.reading + ")";
                              } else {
                                return i.word + "(" + i.reading + ")" + ", ";
                              }
                            })}{" "}
                          </p>
                        ) : (
                          ""
                        )}{" "}
                      </ol>{" "}
                      <input
                        type="submit"
                        onClick={this.addWord}
                        value="Add Word"
                      />
                    </div>
                  ))
                : ""}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".container"));
