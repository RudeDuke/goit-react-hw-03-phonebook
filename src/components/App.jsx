import { Component } from 'react';
import { nanoid } from 'nanoid';
import { ContactList, ContactForm, Filter } from 'components';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.setState({ contacts: JSON.parse(storedContacts) });
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  handleAddContact = (name, number) => {
    const existingContact = this.state.contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (existingContact) {
      alert(`Contact with name ${name} already exists!`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    this.setState(prevState => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  handleDeleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  handleFilterChange = filter => {
    this.setState({ filter });
  };

  render() {
    const { contacts, filter } = this.state;

    const filterRegex = new RegExp(`^${filter}`, 'i');
    const filteredContacts = contacts.filter(
      contact =>
        filterRegex.test(contact.name) ||
        filterRegex.test(contact.name.split(' ')[1])
    );

    return (
      <div className="container">
        <h1>Phonebook</h1>
        <div className="section-wrapper">
          <div className="phonebook-wrapper">
            <h2>Add new contact</h2>
            <ContactForm onAddContact={this.handleAddContact} />
          </div>
          <div className="contacts-wrapper">
            <h2>My contacts</h2>
            <Filter filter={filter} onFilterChange={this.handleFilterChange} />
            <ContactList
              contacts={filteredContacts}
              onDeleteContact={this.handleDeleteContact}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
