const router = require("express").Router();

const { cleanupAndValidate, addContact, getAllContacts, searchContact, updateContact, deleteContact } = require("../utils/db.contact");

/**
 * Add a new contact after verifying the request body
 */ 
router.put("/add_contact", async (req, res) => {
  try {
    // extract the contact from the request body
    const contact = req.body;
    const uid = req.session.uid;
    // Validate the request body
    await cleanupAndValidate(contact);
    // Add the contact to the database
    const newContact = await addContact(contact, uid);

    res.status(201).json({status:201, message: "Contact added successfully" , data: newContact});
  } catch (error) {
    res.status(400).json({status:400, message: `Error adding Contact: ${error.message}`});
  }
});

/**
 * Get all contacts from the database and return the response to the client with 10 contacts per page
 */ 
router.get("/get_all_contacts/:pageNumber", async (req, res) => {
  try {
    // extract the page number and size(Default: 10) from the request
    const pageNumber = req.params.pageNumber;
    const size = req.query.size || 10;
    const uid = req.session.uid;

    // get all the contacts from the database
    const contacts = await getAllContacts(pageNumber, size, uid);

    // return the contacts
    res.status(200).json({status:200, message:"Contacts fetched successfully", data:contacts});
  }catch(err){
    res.status(500).json({status:200, message:`Error fetching contacts: ${err.message}`});
  }
});

/** 
 * Search for a contact by name or email and return the response to the client with 10 contacts per page
 */ 
router.get("/search_contact/:pageNumber", async (req, res) => {
  try {
    // extract query, page number and size from the request
    const query = req.query;
    const pageNumber = req.params.pageNumber;
    const size = req.query.size || 10;
    const uid = req.session.uid;

    // find all contacts in the database that match the query provided
    const contacts = await searchContact(query, pageNumber, size, uid);

    res.status(200).json({status:200, message:"Contacts search successfully", data:contacts});
  } catch (error) {
    res.status(500).json({status:500, message:`Error searching contacts: ${err.message}`});
  }
});

/**
 *  Update a contact by id and return the response to the client
 */ 
router.patch("/update_contact/:id", async (req, res) => {
  try {
    // extract the id and new data from the request
    const id = req.params.id;
    const newData = req.body;
    const uid = req.session.uid;

    await cleanupAndValidate(newData);
    // update the contact in the database
    const updatedContact = await updateContact(id,newData,uid);

    res.status(200).json({status:200, message:"Contact updated Successfully", data:updatedContact});
  } catch (error) {
    res.status(500).json({status:500, message:`Error updating contact: ${error.message}`});
  }
});

/**
 * Delete a contact by id and return the response to the client
 */ 
router.delete("/delete_contact/:id", async (req, res) => {
  try {
    // extract the id from the request
    const id = req.params.id;
    const uid = req.session.uid;

    // get the contact id from the request and delete it
    const contact = await deleteContact(id, uid); 

    res.status(200).json({status:200, message:"Contact deleted Successfully", data:contact}); 
  } catch (error) {
    res.status(400).json({status:400, message:`Error deleting contact: ${error.message}`});
  }
});

module.exports = router;
