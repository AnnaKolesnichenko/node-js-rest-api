// const fs = require('fs/promises')
import fs from 'fs/promises';
import path from 'path';
import {nanoid}  from 'nanoid';

const contactsPath = path.resolve('models', 'contacts.json');

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return;
}

const listContacts = async () => {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);   
}


const getContactById = async (contactId) => {
    const res = await listContacts();
    const data = res.filter(item => item.id === contactId);
    return data;
}

const updateContactById = async (id, contact) => {
    const contacts = await listContacts();
    const index = contacts.find(item => item.id === id);
    if(index === -1) {
        return null;
    }
    contacts[index] = {id, ...data};
    await writeContacts(contacts);
    return contacts[index];
}

const removeContact = async (contactId) => {
    const res = await listContacts();
    const contactIndex = res.findIndex(item => item.id === contactId);
    if(contactIndex === -1) {
      return null;
    }
    const [result] = res.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(res, null, 2));
    return result;
}

const addContact = async ({name, email, phone}) => {
    const res = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email, 
        phone,
    }
    res.push(newContact);
    writeContacts(res);

    return newContact;
}


export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById
}
