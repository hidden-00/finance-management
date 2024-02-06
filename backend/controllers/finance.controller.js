const FinanceController = {}

FinanceController.createOne = async(req, res, next)=>{
    try{
        const data = req.body
        
    }catch(err){
        next(err);
    }
}

module.exports = FinanceController;