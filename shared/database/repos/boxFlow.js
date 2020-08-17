const boxFlowSchema = require('../../models/boxflow')
const boxflow = require('../../models/boxflow')

module.exports.saveBoxFlow = (boxFlow ) =>{
    return boxFlowSchema.create({
        phoneNumber: 'whatsapp:+573022939843',
        ...boxFlow
    })
}

module.exports.getCategories = () =>{
    return boxFlowSchema.aggregate([{
        $group: {
            _id: '$category'
        }
    }])
}