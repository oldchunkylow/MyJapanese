// Functions
const hasNumber = t => {
  return /\d/.test(t);
};
// React
class Field extends React.Component {
  render() {
    return (
      <div class="input-field">
        <label class="row mx-auto" htmlFor={this.props.label}>
          {this.props.labelText}
        </label>
        <input
          class="row mx-auto"
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
            this.props.parent.setState(
              {
                currentUser: this.props.user,
                id: foundUser._id
              },
              () => {
                console.log("HI HERE");
                console.log(this.props.parent.state.id);
                this.props.getSavedWords();
              }
            );
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
      <div class="user-menu">
        <button
          className={this.state.showLogin ? "active-button" : null}
          onClick={event => {
            this.revealMenu(event, this.state.showLogin);
          }}
          value={this.state.showLogin}
          id="showLogin">
          Login
        </button>
        <button
          className={this.state.showCreateUser ? "active-button" : null}
          onClick={event => {
            this.revealMenu(event, this.state.showCreateUser);
          }}
          value={this.state.showCreateUser}
          id="showCreateUser">
          Create User
        </button>
        <div class="user-menu-fields">
          {this.state.showLogin ? (
            <form class="loginMenu" onSubmit={() => this.login(event)}>
              <Field
                labelText="Username: "
                type="text"
                label="user"
                onChange={this.props.onChange}
                value={this.props.user}
              />
              <Field
                labelText="Password: "
                type="password"
                label="password"
                onChange={this.props.onChange}
                value={this.props.password}
              />
              <input type="submit" value="Login" />
            </form>
          ) : (
            ""
          )}
          {this.state.showCreateUser ? (
            <form
              class="createUserMenu"
              onSubmit={() => this.createUser(event)}>
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
              />
              <input type="submit" value="Create User" />
            </form>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
// App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      search: "",
      japanese: [],
      senses: [],
      currentSearch: [],
      password: "",
      user: "",
      currentUser: "",
      english_definitions: "",
      parts_of_speech: "",
      slug: "",
      reading: "",
      word: "",
      is_common: false,
      savedWords: [],
      showCreateWord: false,
      showWordSearch: false,
      showSavedWord: true
    };
  }
  // CSS Renders
  componentDidMount = () => {
    console.log("MOUNTED");
    console.log("SAVED WORDS" + this.state.savedWords);
  };
  // Reveal Menu
  revealMenu = (event, state) => {
    this.setState({
      showCreateWord: false,
      showSavedWord: false,
      showWordSearch: false
    });
    this.setState({
      [event.target.id]: true
    });
  };
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
  getSavedWords = () => {
    fetch("/savedwords", {
      method: "GET"
    })
      .then(data => {
        return data.json();
      })
      .then(jsonedData => {
        this.setState({
          savedWords: jsonedData.filter(i => i.id === this.state.id)
        });
      })
      .then(() => {
        console.log(this.state.savedWords);
      });
  };
  addWord = word => {
    fetch("/savedwords", {
      method: "GET"
    })
      .then(data => {
        return data.json();
      })
      .then(jsonedData => {
        let cleanedData = jsonedData.filter(
          i => i.savedWords.slug === word.slug
        );
        if (cleanedData.length > 0) {
          console.log("WORD ALREADY IN LIBRARY");
        } else {
          fetch("/savedwords", {
            body: JSON.stringify({
              id: this.state.id,
              savedWords: {
                slug: word.slug,
                japanese: word.japanese,
                senses: word.senses,
                is_common: word.is_common
              }
            }),
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          }).then(savedWord => {
            return savedWord.json();
          });
        }
      });
  };
  deleteSavedWord = (id, index) => {
    fetch("savedwords/" + id, {
      method: "DELETE"
    }).then(data => {
      this.setState({
        savedWords: [
          ...this.state.savedWords.slice(0, index),
          ...this.state.savedWords.slice(index + 1)
        ]
      });
    });
  };
  createWord = event => {
    event.preventDefault();
    // Create Multiple Words
    let newJapanese = [];
    let splitWord = this.state.word.split("/");
    let splitReading = this.state.reading.split("/");
    splitWord.map((i, index) => {
      let createdJapanese = {
        word: splitWord[index],
        reading: splitReading[index]
      };
      newJapanese.push(createdJapanese);
    });
    // Create Multiple Meanings
    let newSenses = [];
    let splitEnglishDefinitions = this.state.english_definitions.split("/");
    let splitPartsOfSpeech = this.state.parts_of_speech.split("/");
    splitEnglishDefinitions.map((i, index) => {
      let createdSenses = {
        english_definitions: splitEnglishDefinitions[index],
        parts_of_speech: splitPartsOfSpeech[index]
      };
      newSenses.push(createdSenses);
    });
    // Post Words
    fetch("/savedwords", {
      body: JSON.stringify({
        id: this.state.id,
        savedWords: {
          slug: this.state.slug,
          japanese: newJapanese,
          senses: newSenses,
          is_common: this.state.is_common
        }
      }),
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    }).then(savedWord => {
      return savedWord.json();
    });
  };
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
      <div class="container text-center">
        <h1 class="row justify-content-center">Japanese Learning</h1>
        {/* Show Login Menu */}
        {!this.state.currentUser ? (
          <UserMenu
            onChange={this.handleChange}
            user={this.state.user}
            password={this.state.password}
            parent={this}
            getSavedWords={this.getSavedWords}
          />
        ) : (
          ""
        )}
        {/* Show Search Forms */}
        {this.state.currentUser ? (
          <div>
            {/* Toggle Words Menus */}
            <div class="row words-toggle-menu mx-auto">
              <button
                className={this.state.showSavedWord ? "active-button" : null}
                onClick={event => {
                  this.revealMenu(event, this.state.showSavedWord);
                }}
                value={this.state.showSavedWord}
                id="showSavedWord">
                My Words
              </button>
              <button
                className={this.state.showWordSearch ? "active-button" : null}
                onClick={event => {
                  this.revealMenu(event, this.state.showWordSearch);
                }}
                value={this.state.showWordSearch}
                id="showWordSearch">
                Search for a Word
              </button>
              <button
                className={this.state.showCreateWord ? "active-button" : null}
                onClick={event => {
                  this.revealMenu(event, this.state.showCreateWord);
                }}
                value={this.state.showCreateWord}
                id="showCreateWord">
                Create New Word
              </button>
            </div>
            {/* Create Word Form */}
            {this.state.showCreateWord ? (
              <div class="create-words-menu mx-auto">
                <form
                  class={this.props.class}
                  onSubmit={() => {
                    this.createWord(event);
                  }}>
                  <Field
                    label="word"
                    labelText="Word"
                    value={this.state.word}
                    onChange={this.handleChange}
                    type="text"
                  />
                  <Field
                    label="reading"
                    labelText="Reading:"
                    value={this.state.reading}
                    onChange={this.handleChange}
                    type="text"
                  />
                  <Field
                    label="slug"
                    labelText="Search Term:"
                    value={this.state.slug}
                    onChange={this.handleChange}
                    type="text"
                  />
                  <Field
                    label="english_definitions"
                    labelText="Meaning:"
                    value={this.state.english_definitions}
                    onChange={this.handleChange}
                    type="text"
                  />
                  <Field
                    label="parts_of_speech"
                    labelText="Word Type:"
                    value={this.state.parts_of_speech}
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
              </div>
            ) : (
              ""
            )}
            {/* Search Words Menu */}
            <div class="search-words-menu mx-auto">
              {this.state.showWordSearch ? (
                <div class="search-words-menu">
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

                  {/* Display Found Words */}
                  {/* If current search exists, display word */}
                  {this.state.currentSearch
                    ? this.state.currentSearch.map(word => (
                        <div>
                          <div class="row">
                            <h3
                              className={word.is_common ? "word-common" : null}>
                              {word.japanese[0].word}({word.japanese[0].reading}
                              )
                            </h3>
                            {word.is_common ? (
                              <span className="word-common-tag"> Common </span>
                            ) : null}
                          </div>
                          <h5> Search Term : {word.slug} </h5>
                          <ol>
                            {word.senses.map(sense => (
                              <li>
                                {sense.english_definitions}{" "}
                                {sense.parts_of_speech.map((i, index, arr) => {
                                  if (arr.length === index + 1) {
                                    return i;
                                  } else {
                                    return i + ", ";
                                  }
                                })}
                              </li>
                            ))}
                            {word.japanese.length > 1 ? (
                              <p>
                                Other Forms:
                                {word.japanese.map((i, index, arr) => {
                                  if (index === 0) {
                                    return null;
                                  } else if (
                                    index > 0 &&
                                    arr.length === index + 1
                                  ) {
                                    return i.word + "(" + i.reading + ")";
                                  } else {
                                    return (
                                      i.word + "(" + i.reading + ")" + ", "
                                    );
                                  }
                                })}
                              </p>
                            ) : (
                              ""
                            )}
                          </ol>
                          <input
                            type="submit"
                            onClick={() => {
                              this.addWord(word);
                            }}
                            value="Add Word"
                          />
                        </div>
                      ))
                    : ""}
                </div>
              ) : (
                ""
              )}
            </div>
            {/* Display Saved Words */}
            {this.state.showSavedWord ? (
              <div class="saved-words-menu mx-auto row">
                {this.state.savedWords
                  ? this.state.savedWords.map((i, index) => (
                      <div class="word-container mx-auto">
                        <div class="word-info mx-auto">
                          <div class="row">
                            <h3
                              className={
                                i.savedWords.is_common
                                  ? "word-common my-auto"
                                  : null
                              }>
                              {i.savedWords.japanese[0]
                                ? i.savedWords.japanese[0].word +
                                  "(" +
                                  i.savedWords.japanese[0].reading +
                                  ")"
                                : ""}
                            </h3>
                            {i.savedWords.is_common ? (
                              <span class="word-common-tag my-auto">
                                {" "}
                                Common{" "}
                              </span>
                            ) : null}
                          </div>
                          <h5 class="row">
                            {" "}
                            Search Term : {i.savedWords.slug}{" "}
                          </h5>
                          <ol>
                            {i.savedWords.senses.map((sense, index) => (
                              <li>
                                {index + 1}.{" "}
                                {sense.english_definitions.map(
                                  (definition, index, arr) => {
                                    if (index + 1 === arr.length) {
                                      return definition;
                                    } else {
                                      return definition + ", ";
                                    }
                                  }
                                )}
                                <span class="word-info-type">
                                  {sense.parts_of_speech.map(
                                    (i, index, arr) => {
                                      if (arr.length === 1) {
                                        return " (" + i + ")";
                                      } else if (index === 0) {
                                        return " (" + i;
                                      } else if (arr.length === index + 1) {
                                        return ", " + i + ")";
                                      } else {
                                        return i + ", ";
                                      }
                                    }
                                  )}
                                </span>
                              </li>
                            ))}
                            {i.savedWords.japanese.length > 1 ? (
                              <p>
                                Other Forms:
                                {i.savedWords.japanese.map((i, index, arr) => {
                                  if (index === 0) {
                                    return null;
                                  } else if (
                                    index > 0 &&
                                    arr.length === index + 1
                                  ) {
                                    return i.word + "(" + i.reading + ")";
                                  } else {
                                    return (
                                      i.word + "(" + i.reading + ")" + ", "
                                    );
                                  }
                                })}
                              </p>
                            ) : (
                              ""
                            )}
                          </ol>
                          <input
                            class="delete-button"
                            type="submit"
                            onClick={() => {
                              this.deleteSavedWord(i._id, index);
                            }}
                            value="X"
                          />
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".container"));
