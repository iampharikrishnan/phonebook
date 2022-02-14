const validator = require("validator");

const ContactModel = require("../models/contact.model");

/**
 * reject if the user data is empty or invalid and accept otherwise
 * @param {Object} contact - the contact to be verified
 * @returns {Promise} - the promise of data verification
 */
const cleanupAndValidate = (contact) => {
    return new Promise((resolve, reject) => {
        if(contact.email && !validator.isEmail(contact.email)){
            reject(new Error('Invalid Email'))
        }
        if(contact.name && !validator.isLength(contact.name, {min:4, max:30})){
            reject(new Error('Invalid Name'))
        }
        if(contact.phone && !validator.isMobilePhone(contact.phone)){
            reject(new Error('Invalid Phone Number'))
        }
        resolve(contact);    
    })
};

/**
 * add the contact to the database
 * @param {Object} contact - the contact to be added
 * @param {String} uid - the user id of the contact
 * @returns {Promise} - the promise of the database operation
 */ 
const addContact = async (contact, uid) => {
    // name and email are required
    if (!contact.email || !contact.name) {
        throw new Error('Insufficient Data');
    }
    //check if the contact already exists
    const existingContact = await ContactModel.findOne({ email: contact.email });
    if (existingContact) {
        throw new Error('Contact already exists');
    }
    // create a new contact
    const newContact = new ContactModel({contact, uid});
    // save the contact to database and return the response to the client
    await newContact.save()
    return newContact;
};

/**
 * get all the contacts from the database(10 per page)
 * @param {Number} pageNumber - the page number to be fetched
 * @param {Number} size - the number of contacts per page
 * @param {String} uid - the user id
 * @returns {Promise} - the promise of getting all the contacts
 */

const getAllContacts = async (pageNumber, size, uid) => {
    //number of contacts per page
    const limit = parseInt(size);
    //offset for pagination
    const skip = size * (pageNumber - 1);
    // get limit number of contacts from the database after skipping the skip number of contacts
    const contacts = await ContactModel.find({uid}).limit(limit).skip(skip)
    // return the contacts
    return contacts;
};

/**
 * search for a contact by name or email and return the response to the client with 10 contacts per page
 * @param {Object} query - the query to be searched
 * @param {Number} pageNumber - the page number to be fetched
 * @param {Number} size - the number of contacts per page
 * @param {String} uid - the id of owner of contact
 * @returns {Promise} - the promise of getting all the contacts that match the query
 */

const searchContact = async (query, pageNumber, size, uid) => {
    //number of contacts per page
    const limit = parseInt(size);
    //offset for pagination
    const skip = size * (pageNumber - 1);

    // can only search using name or email
    if (!query.name && !query.email) {
        throw new Error("Invalid Request");
    }

    // find all contacts in the database that match the query provided
    const contacts = await ContactModel.find({...query, uid}).limit(limit).skip(skip)
    
    // return the contacts
    return contacts;
};

/**
 * update a contact by id and return the response to the client
 * @param {String} id - the id of the contact to be updated
 * @param {Object} newData - the contact to be updated
 * @param {String} uid - the id of owner of the contact
 * @returns {Promise} - the promise of the database operation
 */

const updateContact = async (id, newData, uid) => {

    // return error if no id or new data is provided
    if (!id || !newData) {
        throw new Error("Insufficient Data");
    }
    // find the contact in the database with the id provided and update it with the new data provided
    const updatedContact = await ContactModel.findOneAndUpdate({ _id: id , uid}, newData, { new: true });
    
    // return the updated contact
    return updatedContact;
};

/**
 * delete a contact by id and return the response to the client
 * @param {ObjectId} id - the id of contact to be deleted
 * @param {String} uid - the id owner of the contact
 * @returns {Promise} - the promise of the database operation
 */

const deleteContact = async (id, uid) => {

  // throw error if no id is provided
  if (!id) {
    throw new Error("Invalid Request");
  }

  // find the contact in the database with the id provided and delete it
  const deletedContact = await ContactModel.findOneAndDelete({ _id: id , uid});
  // return the deleted contact
  return deletedContact;
};

module.exports = { cleanupAndValidate, addContact, getAllContacts, searchContact, updateContact, deleteContact };