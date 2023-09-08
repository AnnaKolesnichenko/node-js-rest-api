const Get =  async (req, res) => {
    try {
        const data = await contactsService.listContacts();
        res.json(data);
    } 
    catch(error) {
        res.status(500).json({
        message: 'Server error'
        });
    }
}

export default {
    Get
}
