let idCounter = 0;
const addContacts = (body, db) => {

    let res = db.insert({id:++idCounter, ...body});
    return res;
}

const getContacts = () => {

}

module.exports=addContacts;