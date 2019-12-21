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
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
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
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
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
// Flash Card
class Flashcard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      isEditing: false,
      slug: this.props.myWord.savedWords.slug,
      japanese: this.props.myWord.savedWords.japanese,
      word_0: this.props.myWord.savedWords.japanese[0].word,
      word_others: "",
      reading_0: this.props.myWord.savedWords.japanese[0].reading,
      reading_others: "",
      senses: this.props.myWord.savedWords.senses,
      english_definitions: "",
      parts_of_speech: "",
      is_common: this.props.myWord.savedWords.is_common,
      _id: this.props.myWord._id,
      flashCardType: "word"
    };
  }
  componentDidMount = () => {
    console.log("THE WORD BOX HAS MOUNTED");
    // Create Word Collection
    let wordCollection = [];
    let readingCollection = [];
    this.state.japanese.map((i, index, arr) => {
      if (index > 0) {
        wordCollection.push(i.word);
        readingCollection.push(i.reading);
      }

      // Create Meaning Collection
      let english_definitionsCollection = [];
      let parts_of_speechCollection = [];
      this.state.senses.map((i, index, arr) => {
        english_definitionsCollection.push(i.english_definitions);

        parts_of_speechCollection.push(i.parts_of_speech);
      });
      this.setState({
        word_others: wordCollection.join("/"),
        reading_others: readingCollection.join("/"),
        english_definitions: english_definitionsCollection.join("/"),
        parts_of_speech: parts_of_speechCollection.join("/")
      });
    });
  };
  editSavedWord = () => {
    let english_definitionsSplit = this.state.english_definitions.split(
      /[/\|]/
    );
    let parts_of_speechSplit = this.state.parts_of_speech.split(/[/\|]/);
    let wordSplit;
    if (this.state.word_others === "") {
      wordSplit = [this.state.word_0];
    } else {
      wordSplit = this.state.word_others.split(/[/\|]/);
      wordSplit.unshift(this.state.word_0);
    }
    let readingSplit;
    if (this.state.reading_others === "") {
      readingSplit = [this.state.reading_0];
    } else {
      readingSplit = this.state.reading_others.split(/[/\|]/);
      readingSplit.unshift(this.state.reading_0);
    }

    let originalWord = this.props.myWord;
    console.log(originalWord);
    let newJapaneseArray = [];
    wordSplit.map((i, index) => {
      let newJapaneseArrayObject = {
        word: wordSplit[index],
        reading: readingSplit[index]
      };
      newJapaneseArray.push(newJapaneseArrayObject);
    });
    let newSensesArray = [];
    english_definitionsSplit.map((i, index) => {
      let newSensesObject = {
        english_definitions: english_definitionsSplit[index],
        parts_of_speech: parts_of_speechSplit[index]
      };
      newSensesArray.push(newSensesObject);
    });

    originalWord.savedWords.slug = this.state.slug;
    originalWord.savedWords.is_common = this.state.is_common;
    originalWord.savedWords.japanese = newJapaneseArray;
    originalWord.savedWords.senses = newSensesArray;
    console.log(originalWord);
    fetch("savedwords/" + this.state._id, {
      body: JSON.stringify(originalWord),
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(updatedSavedWord => {
        console.log(updatedSavedWord);
        updatedSavedWord.json();
      })
      .then(jsonedSavedWord => {
        fetch("/savedwords")
          .then(response => response.json())
          .then(newSavedWordsSet => {
            console.log(newSavedWordsSet);
            this.props.parent.setState({ savedWords: newSavedWordsSet });
          })
          .then(updateAll => {
            this.setState({ isEditing: false });
          });
      });
  };
  handleChange = event => {
    console.log(event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  revealAnswer = event => {
    console.log(this.props.cardNumber);
    this.props.myWord.hidden = !this.props.myWord.hidden;
    this.props.parent.setState({
      selectedRandomWords: this.props.parent.state.selectedRandomWords
    });
  };
  toggleEdit = () => {
    console.log("TOGGLING EDIT");
    this.setState({
      isEditing: !this.isEditing
    });
  };
  isCommonToggle = () => {
    this.setState({ is_common: !this.state.is_common });
  };
  render() {
    return (
      <div class="word-info mx-auto">
        {/* Plain State */}

        {/* Is Card Hidden? */}
        {this.props.myWord.hidden ? (
          <div>
            <div class="row py-2 justify-content-center text-center">
              {this.props.parent.state.flashCardType === "word" ? (
                // Display Word Interface
                <h3 class="mx-auto text-center">
                  {this.props.myWord.savedWords.japanese[0]
                    ? this.props.myWord.savedWords.japanese[0].word +
                      "(" +
                      this.props.myWord.savedWords.japanese[0].reading +
                      ")"
                    : ""}
                </h3>
              ) : (
                // Display Meaning Interface
                <h3 class="mx-auto justify-content-center text-center">
                  {
                    this.props.parent.state.selectedRandomMeanings[
                      this.props.index
                    ]
                  }
                </h3>
              )}

              {/* Display Meaning Interface */}
            </div>
            <div class="row mx-auto justify-content-center">
              <input
                type="submit"
                value="Reveal Answer"
                onClick={() => {
                  this.revealAnswer(event);
                }}
                class="reveal-answer-button mx-auto py-2"
              />
            </div>
          </div>
        ) : (
          <div>
            <div class="row">
              <h3
                className={
                  this.props.myWord.savedWords.is_common
                    ? "word-common my-auto"
                    : null
                }>
                {this.props.myWord.savedWords.japanese[0]
                  ? this.props.myWord.savedWords.japanese[0].word +
                    "(" +
                    this.props.myWord.savedWords.japanese[0].reading +
                    ")"
                  : ""}
              </h3>
              {this.props.myWord.savedWords.is_common ? (
                <span class="word-common-tag my-auto"> Common </span>
              ) : null}
            </div>
            <h5 class="row">
              <span>
                Search Term :{" "}
                <span class="japanese-font-small">
                  {this.props.myWord.savedWords.slug}
                </span>
              </span>
              {this.props.myWord.savedWords.japanese.length > 1 ? (
                <span>
                  &nbsp;| Other Forms:&nbsp;
                  <span class="japanese-font-small">
                    {" "}
                    {this.props.myWord.savedWords.japanese.map(
                      (i, index, arr) => {
                        if (index === 0) {
                          return null;
                        } else if (index > 0 && arr.length === index + 1) {
                          return i.word + "(" + i.reading + ")";
                        } else {
                          return i.word + "(" + i.reading + ")" + ", ";
                        }
                      }
                    )}
                  </span>
                </span>
              ) : (
                ""
              )}
            </h5>
            <div class="word-info-meanings">
              {this.props.myWord.savedWords.senses.map((sense, index) => (
                <div class="row">
                  &#8226; &nbsp;
                  {sense.english_definitions.map((definition, index, arr) => {
                    if (index + 1 === arr.length) {
                      return definition;
                    } else {
                      return definition + ", ";
                    }
                  })}
                  <span class="word-info-type">
                    {sense.parts_of_speech.map((i, index, arr) => {
                      if (i === "") {
                        return null;
                      } else if (arr.length === 1) {
                        return " (" + i + ")";
                      } else if (index === 0) {
                        return " (" + i;
                      } else if (arr.length === index + 1) {
                        return ", " + i + ")";
                      } else {
                        return i + ", ";
                      }
                    })}
                  </span>
                  <input
                    class="delete-button"
                    type="submit"
                    onClick={this.revealAnswer}
                    value="Hide"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

// Word Box
class Wordbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      slug: this.props.myWord.savedWords.slug,
      japanese: this.props.myWord.savedWords.japanese,
      word_0: this.props.myWord.savedWords.japanese[0].word,
      word_others: "",
      reading_0: this.props.myWord.savedWords.japanese[0].reading,
      reading_others: "",
      senses: this.props.myWord.savedWords.senses,
      english_definitions: "",
      parts_of_speech: "",
      is_common: this.props.myWord.savedWords.is_common,
      _id: this.props.myWord._id
    };
  }
  componentDidMount = () => {
    console.log("THE WORD BOX HAS MOUNTED");
    // Create Word Collection
    let wordCollection = [];
    let readingCollection = [];
    this.state.japanese.map((i, index, arr) => {
      if (index > 0) {
        wordCollection.push(i.word);
        readingCollection.push(i.reading);
      }

      // Create Meaning Collection
      let english_definitionsCollection = [];
      let parts_of_speechCollection = [];
      this.state.senses.map((i, index, arr) => {
        english_definitionsCollection.push(i.english_definitions);

        parts_of_speechCollection.push(i.parts_of_speech);
      });
      this.setState({
        word_others: wordCollection.join("/"),
        reading_others: readingCollection.join("/"),
        english_definitions: english_definitionsCollection.join("/"),
        parts_of_speech: parts_of_speechCollection.join("/")
      });
    });
  };
  editSavedWord = () => {
    let english_definitionsSplit = this.state.english_definitions.split(
      /[/\|]/
    );
    let parts_of_speechSplit = this.state.parts_of_speech.split(/[/\|]/);
    let wordSplit;
    if (this.state.word_others === "") {
      wordSplit = [this.state.word_0];
    } else {
      wordSplit = this.state.word_others.split(/[/\|]/);
      wordSplit.unshift(this.state.word_0);
    }
    let readingSplit;
    if (this.state.reading_others === "") {
      readingSplit = [this.state.reading_0];
    } else {
      readingSplit = this.state.reading_others.split(/[/\|]/);
      readingSplit.unshift(this.state.reading_0);
    }

    let originalWord = this.props.myWord;
    console.log(originalWord);
    let newJapaneseArray = [];
    wordSplit.map((i, index) => {
      let newJapaneseArrayObject = {
        word: wordSplit[index],
        reading: readingSplit[index]
      };
      newJapaneseArray.push(newJapaneseArrayObject);
    });
    let newSensesArray = [];
    english_definitionsSplit.map((i, index) => {
      let newSensesObject = {
        english_definitions: english_definitionsSplit[index],
        parts_of_speech: parts_of_speechSplit[index]
      };
      newSensesArray.push(newSensesObject);
    });

    originalWord.savedWords.slug = this.state.slug;
    originalWord.savedWords.is_common = this.state.is_common;
    originalWord.savedWords.japanese = newJapaneseArray;
    originalWord.savedWords.senses = newSensesArray;
    console.log(originalWord);
    fetch("savedwords/" + this.state._id, {
      body: JSON.stringify(originalWord),
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(updatedSavedWord => {
        console.log(updatedSavedWord);
        updatedSavedWord.json();
      })
      .then(jsonedSavedWord => {
        fetch("/savedwords")
          .then(response => response.json())
          .then(newSavedWordsSet => {
            console.log(newSavedWordsSet);
            this.props.parent.setState({ savedWords: newSavedWordsSet });
          })
          .then(updateAll => {
            this.setState({ isEditing: false });
          });
      });
  };
  handleChange = event => {
    console.log(event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  toggleEdit = () => {
    console.log("TOGGLING EDIT");
    this.setState({
      isEditing: !this.isEditing
    });
  };
  isCommonToggle = () => {
    this.setState({ is_common: !this.state.is_common });
  };
  render() {
    return (
      <div class="word-info mx-auto">
        {/* Plain State */}
        {!this.state.isEditing ? (
          <div>
            <div class="row">
              <h3
                className={
                  this.props.myWord.savedWords.is_common
                    ? "word-common my-auto"
                    : null
                }>
                {this.props.myWord.savedWords.japanese[0]
                  ? !this.props.myWord.savedWords.japanese[0].word
                    ? this.props.myWord.savedWords.japanese[0].reading +
                      "(" +
                      this.props.myWord.savedWords.japanese[0].reading +
                      ")"
                    : this.props.myWord.savedWords.japanese[0].word +
                      "(" +
                      this.props.myWord.savedWords.japanese[0].reading +
                      ")"
                  : ""}
              </h3>
              {this.props.myWord.savedWords.is_common ? (
                <span class="word-common-tag my-auto"> Common </span>
              ) : null}
            </div>
            <h5 class="row">
              <span>
                Search Term :{" "}
                <span class="japanese-font-small">
                  {this.props.myWord.savedWords.slug}
                </span>
              </span>
              {this.props.myWord.savedWords.japanese.length > 1 ? (
                <span>
                  &nbsp;| Other Forms:&nbsp;
                  <span class="japanese-font-small">
                    {" "}
                    {this.props.myWord.savedWords.japanese.map(
                      (i, index, arr) => {
                        if (index === 0) {
                          return null;
                        } else if (
                          index > 0 &&
                          arr.length === index + 1 &&
                          i.word
                        ) {
                          return i.word + "(" + i.reading + ")";
                        } else if (
                          index > 0 &&
                          arr.length === index + 1 &&
                          !i.word
                        ) {
                          return i.reading + "(" + i.reading + ")";
                        } else if (i.word) {
                          return i.word + "(" + i.reading + ")" + ", ";
                        } else if (!i.word) {
                          return i.reading + "(" + i.reading + ")" + ", ";
                        }
                      }
                    )}
                  </span>
                </span>
              ) : (
                ""
              )}
            </h5>
            <div class="word-info-meanings">
              {this.props.myWord.savedWords.senses.map((sense, index) => (
                <div class="row">
                  &#8226; &nbsp;
                  {sense.english_definitions.map((definition, index, arr) => {
                    if (index + 1 === arr.length) {
                      return definition;
                    } else {
                      return definition + ", ";
                    }
                  })}
                  <span class="word-info-type">
                    {sense.parts_of_speech.map((i, index, arr) => {
                      if (i === "") {
                        return null;
                      } else if (arr.length === 1) {
                        return " (" + i + ")";
                      } else if (index === 0) {
                        return " (" + i;
                      } else if (arr.length === index + 1) {
                        return ", " + i + ")";
                      } else {
                        return i + ", ";
                      }
                    })}
                  </span>
                </div>
              ))}
            </div>
            <input
              class="delete-button"
              type="submit"
              onClick={this.props.deleteSavedWord}
              value="X"
            />
            <input
              class="edit-button"
              type="submit"
              onClick={this.toggleEdit}
              value="Edit"
            />
          </div>
        ) : (
          // Edit State
          <div class="saved-word-edit-state">
            <div class="row saved-word-edit-state-header">
              <div class="col-5">
                <input
                  id="word_0"
                  type="text"
                  value={this.state.word_0}
                  onChange={this.handleChange}
                />
                <label htmlFor="word_0">Primary Word</label>
              </div>
              <div class="col-5">
                <input
                  type="text"
                  id="reading_0"
                  value={this.state.reading_0}
                  onChange={this.handleChange}
                />
                <label htmlFor="reading_0">Primary Reading</label>
              </div>
              {/* Toggle Common */}
              <input class="checkbox" type="checkbox" />
              <input
                type="checkbox"
                id="toggle"
                class="checkbox my-auto"
                checked={this.state.is_common ? "checked" : null}
                onClick={this.isCommonToggle}
              />
              <label for="toggle" class="switch my-auto"></label>
            </div>
            <div class="row saved-word-edit-state-terms">
              <span class="col-3">
                <input
                  type="text"
                  class="japanese-font-small"
                  onChange={this.handleChange}
                  id="slug"
                  value={this.state.slug}
                />
                <label htmlFor="slug">Search Term</label>
              </span>
              {this.state.japanese.length > 1 ? (
                <span class="col-4">
                  <input
                    type="text"
                    class="japanese-font-small "
                    onChange={this.handleChange}
                    id="word_others"
                    value={this.state.word_others}
                  />
                  <label htmlFor="reading_others">Reading (Other Forms)</label>
                </span>
              ) : (
                ""
              )}
              {this.state.japanese.length > 1 ? (
                <span class="col-4">
                  <input
                    type="text"
                    class="japanese-font-small"
                    onChange={this.handleChange}
                    id="word_others"
                    value={this.state.reading_others}
                  />
                  <label htmlFor="reading_others">Reading (Other Forms)</label>
                </span>
              ) : (
                ""
              )}
              <div class="row saved-word-edit-state-meaning">
                <span class="col-6">
                  <input
                    type="text"
                    class="japanese-font-small"
                    onChange={this.handleChange}
                    id="english_definitions"
                    value={this.state.english_definitions}
                  />
                  <label htmlFor="english_definitions">
                    English Definitions
                  </label>
                </span>
                <span class="col-6">
                  <input
                    type="text"
                    class="japanese-font-small"
                    onChange={this.handleChange}
                    id="parts_of_speech"
                    value={this.state.parts_of_speech}
                  />
                  <label htmlFor="parts_of_speech">Word Types</label>
                </span>
              </div>
            </div>
            <div class="row justify-content-end">
              <input
                class="save-edits-button"
                type="submit"
                onClick={this.editSavedWord}
                value="Save Edits"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

// App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.flashCardElement = React.createRef();
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
      showSavedWord: true,
      isLoading: false,
      isCompleted: false,
      showFlashCards: false,
      flashCardNumber: 1,
      selectedRandomWords: [],
      flashCardType: "word",
      selectedRandomMeanings: [],
      addedWord: false
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
      showWordSearch: false,
      showFlashCards: false
    });
    this.setState({
      [event.target.id]: true
    });
  };
  isCommonToggle = () => {
    this.setState({ is_common: !this.state.is_common });
  };
  searchWord = event => {
    event.preventDefault();
    let searchTerm= this.state.search.toLowerCase();
    this.setState({ isLoading: true });
    fetch("/dictionary/" + searchTerm, {
      method: "GET"
    })
      .then(data => {
        return data.json();
      })
      .then(jsonedData => {
        // let cleanedData = jsonedData.filter(
        //   word => word.slug.hasNumber === true
        // );
        let cleanedData = jsonedData.filter(word => !hasNumber(word.slug.toLowerCase()));
        this.setState({
          currentSearch: cleanedData,
          isLoading: false
        });
        console.log(this.state.currentSearch);
      });
  };
  toggleFlashCardType = event => {
    console.log(event.target.value);
    this.setState({ flashCardType: event.target.value });
  };
  // Generate Flash Cards
  generateFlashCards = () => {
    let dupeSavedWords = this.state.savedWords;
    let selectedWords = [];
    let selectedMeaningsArray = [];
    if (this.state.savedWords.length < this.state.flashCardNumber) {
      console.log("ERROR");
    } else if (this.state.flashCardNumber === 0) {
      console.log("CANNOT BE 0");
    } else {
      for (let i = 0; i < this.state.flashCardNumber; i++) {
        let selectedNumber = Math.floor(
          Math.random() * (this.state.flashCardNumber - i)
        );
        let selectedSavedWord = dupeSavedWords[selectedNumber];
        let selectedMeaning =
          dupeSavedWords[selectedNumber].savedWords.senses[
            Math.floor(
              Math.random() *
                dupeSavedWords[selectedNumber].savedWords.senses.length
            )
          ].english_definitions;
        selectedSavedWord.hidden = true;
        console.log(selectedNumber);
        console.log(selectedSavedWord);
        dupeSavedWords.splice(selectedNumber, 1);
        selectedWords.push(selectedSavedWord);
        selectedMeaningsArray.push(selectedMeaning);
      }
    }
    this.getSavedWords();
    this.setState({
      selectedRandomWords: selectedWords,
      selectedRandomMeanings: selectedMeaningsArray
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
    this.setState({ addedWord: true });
    setTimeout(() => {
      this.setState({ addedWord: false });
    }, 3000);
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
          })
            .then(savedWord => {
              return savedWord.json();
            })
            .then(newItem => {
              console.log(newItem);
              let currentArray = this.state.savedWords;
              currentArray.push(newItem);
              this.setState({
                savedWords: currentArray
              });
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
    this.setState({ isLoading: true, isCompleted: true });
    event.preventDefault();
    // Create Multiple Words
    let newJapanese = [];
    let splitWord = this.state.word.split(/[/\|]/);
    let splitReading = this.state.reading.split(/[/\|]/);
    splitWord.map((i, index) => {
      let createdJapanese = {
        word: splitWord[index],
        reading: splitReading[index]
      };
      newJapanese.push(createdJapanese);
    });
    // Create Multiple Meanings
    let newSenses = [];
    let splitEnglishDefinitions = this.state.english_definitions.split(/[/\|]/);
    let splitPartsOfSpeech = this.state.parts_of_speech.split(/[/\|]/);
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
    })
      .then(savedWord => {
        return savedWord.json();
      })
      .then(newWord => {
        setTimeout(() => {
          this.setState({ isCompleted: false });
        }, 3000);
        let currentSavedWords = this.state.savedWords;
        currentSavedWords.push(newWord);
        this.setState({ savedWords: currentSavedWords, isLoading: false });
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
        {this.state.addedWord ? (
          <div class="add-word-text">Word added!</div>
        ) : (
          <div class="add-word-text hide">Word added!</div>
        )}
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
                className={this.state.showFlashCards ? "active-button" : null}
                onClick={event => {
                  this.revealMenu(event, this.state.showFlashCards);
                }}
                value={this.state.showFlashCards}
                id="showFlashCards">
                Flash Cards
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
            {this.state.showFlashCards ? (
              <div class="mx-auto flash-cards-menu">
                <div class="row flash-cards-menu-header mx-auto my-auto">
                  <h2 class="mx-auto my-auto">
                    Create&nbsp;
                    <input
                      type="number"
                      value={this.state.flashCardNumber}
                      onChange={this.handleChange}
                      id="flashCardNumber"
                      max={this.state.savedWords.length}
                      min="1"
                    />
                    &nbsp;Flash Cards!
                  </h2>
                  <button
                    class="mx-auto my-auto"
                    onClick={this.generateFlashCards}>
                    &#9658;
                  </button>
                </div>
                <div class="row flash-cards-toggle mx-auto justify-content-center">
                  <button
                    className={
                      this.state.flashCardType === "word"
                        ? "active col-2"
                        : "col-2"
                    }
                    value="word"
                    onClick={event => {
                      this.toggleFlashCardType(event);
                    }}>
                    Word
                  </button>
                  <button
                    className={
                      this.state.flashCardType === "meaning"
                        ? "active col-2"
                        : "col-2"
                    }
                    value="meaning"
                    onClick={() => {
                      this.toggleFlashCardType(event);
                    }}>
                    Meaning
                  </button>
                </div>
                {/* Display Flash Cards */}
                <div class="flash-cards-display mx-auto row">
                  {this.state.selectedRandomWords
                    ? this.state.selectedRandomWords.map((i, index) => (
                        <div class="word-container mx-auto">
                          <Flashcard
                            cardNumber={index}
                            ref={this.flashCardElement}
                            parent={this}
                            myWord={i}
                            index={index}
                            onChange={() => {
                              this.handleChange();
                            }}
                            deleteSavedWord={() => {
                              this.deleteSavedWord(i._id, index);
                            }}
                          />
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            ) : null}
            {/* Create Word Form */}
            {this.state.showCreateWord ? (
              <div class="create-words-menu mx-auto">
                {this.state.isCompleted && (
                  <h2 class="text-center preview-text">Created New Word!</h2>
                )}
                {this.state.isLoading && (
                  <div class="loader">
                    <div class="lds-spinner">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                )}

                <form
                  class="create-words-menu-form mx-auto"
                  onSubmit={() => {
                    this.createWord(event);
                  }}>
                  <div class="mx-auto row">
                    <h4 class="mx-auto">Enter your word here...</h4>
                  </div>

                  <div class="create-words-menu-header row mx-auto">
                    <div class="col-5">
                      <input
                        id="word"
                        type="text"
                        value={this.state.word}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="word">Word</label>
                    </div>
                    <div class="col-5">
                      <input
                        type="text"
                        id="reading"
                        value={this.state.reading}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="reading">Reading</label>
                    </div>
                    {/* Toggle Common */}
                    <input class="checkbox" type="checkbox" />
                    <input
                      type="checkbox"
                      id="toggle"
                      class="checkbox my-auto"
                      checked={this.state.is_common ? "checked" : null}
                      onClick={this.isCommonToggle}
                    />
                    <label for="toggle" class="switch my-auto"></label>
                  </div>
                  <div class="create-words-menu-terms row mx-auto">
                    <div class="col-5">
                      <input
                        class="japanese-font-small"
                        id="slug"
                        type="text"
                        value={this.state.slug}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="slug">Search Term</label>
                    </div>
                  </div>
                  <div class="create-words-menu-terms row mx-auto">
                    <div class="col-5">
                      <input
                        class="japanese-font-small"
                        id="english_definitions"
                        type="text"
                        value={this.state.english_definitions}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="english_definitions">
                        English Definitions
                      </label>
                    </div>
                    <div class="col-5">
                      <input
                        class="japanese-font-small"
                        id="parts_of_speech"
                        type="text"
                        value={this.state.parts_of_speech}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="parts_of_speech">Word Type</label>
                    </div>
                  </div>
                  <div class="create-words-menu-input row justify-content-end">
                    <input
                      type="submit"
                      value="Create Word"
                      class="create-word-button"
                    />
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}
            {/* Search Words Menu */}

            <div class="search-words-menu mx-auto">
              {this.state.showWordSearch ? (
                <div class="mx-auto">
                  <form
                    onSubmit={this.searchWord}
                    class="search-words-menu-form mx-auto">
                    <label class="row" htmlFor="search">
                      Search for a Word in Japanese or English...
                    </label>
                    <div class="row">
                      <input
                        class=""
                        id="search"
                        value={this.state.search}
                        onChange={this.handleChange}
                        type="text"
                      />
                      <input type="submit" value="&#9658;" />
                    </div>
                  </form>
                  {this.state.isLoading && (
                    <div class="lds-spinner">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  )}

                  {/* Display Found Words */}
                  {/* If current search exists, display word */}
                  {this.state.currentSearch
                    ? this.state.currentSearch.map(word => (
                        <div class="word-container">
                          <div class="word-info mx-auto">
                            <div class="row">
                              <h3
                                className={
                                  word.is_common ? "word-common my-auto" : null
                                }>
                                {word.japanese[0].word === "Undefined"
                                  ? word.japanese[0].reading
                                  : word.japanese[0].word}
                                ({word.japanese[0].reading})
                              </h3>
                              {word.is_common ? (
                                <span className="word-common-tag my-auto">
                                  {" "}
                                  Common{" "}
                                </span>
                              ) : null}
                            </div>
                            <h5 class="row">
                              <span>
                                {" "}
                                Search Term :{" "}
                                <span class="japanese-font-small">
                                  {word.slug}
                                </span>
                              </span>
                              {word.japanese.length > 1 ? (
                                <span>
                                  &nbsp;| Other Forms:&nbsp;
                                  <span class="japanese-font-small">
                                    {word.japanese.map((i, index, arr) => {
                                      if (index === 0) {
                                        return null;
                                      } else if (
                                        index > 0 &&
                                        arr.length === index + 1 &&
                                        i.word
                                      ) {
                                        return i.word + "(" + i.reading + ")";
                                      } else if (
                                        index > 0 &&
                                        arr.length === index + 1 &&
                                        !i.word
                                      ) {
                                        return (
                                          i.reading + "(" + i.reading + ")"
                                        );
                                      } else if (i.word) {
                                        return (
                                          i.word + "(" + i.reading + ")" + ", "
                                        );
                                      } else if (!i.word) {
                                        return (
                                          i.reading +
                                          "(" +
                                          i.reading +
                                          ")" +
                                          ", "
                                        );
                                      }
                                    })}
                                  </span>
                                </span>
                              ) : (
                                ""
                              )}
                            </h5>
                            <div class="word-info-meanings">
                              {word.senses.map(sense => (
                                <div class="row">
                                  {sense.english_definitions}
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
                                </div>
                              ))}
                            </div>
                            <input
                              class="add-button"
                              type="submit"
                              onClick={() => {
                                this.addWord(word);
                              }}
                              value="+"
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
            {/* Display Saved Words */}
            {this.state.showSavedWord ? (
              <div class="saved-words-menu mx-auto row">
                {this.state.savedWords
                  ? this.state.savedWords.map((i, index) => (
                      <div class="word-container mx-auto">
                        <Wordbox
                          parent={this}
                          myWord={i}
                          index={index}
                          onChange={() => {
                            this.handleChange();
                          }}
                          deleteSavedWord={() => {
                            this.deleteSavedWord(i._id, index);
                          }}
                        />
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
