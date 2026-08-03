const eventModel = require("../model/eventModel");


exports.getAllEventsController = async(req,res)=>{

    try {
        const page =  parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        
        const totalEventss = await eventModel.countDocuments({
            status:{
                $ne:"cancelled"
            }
        });
        const allEvents = await eventModel.find({
            status:{
                $ne:"cancelled"
            }
        })
        .sort({createdAt:-1})
        .select('_id title artist description bannerImage eventDate location status genre price duration')
        .skip(skip)
        .limit(limit)   

    return res.status(200).json({
        message:"All events",
        currentPage:page,
        currentCount: totalEventss,
        totalPages: Math.ceil(totalEventss / limit),
        allEvents   
    });


    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message:"Events not found",
      })  
    }

}

exports.searchEventsController = async (req, res) => {
    try {
 
        const q = req.query.q?.trim() || "";
 
        // Don't hit the DB for an empty query — just return an empty list
        if (!q) {
            return res.status(200).json({
                message: "Search results",
                results: []
            });
        }
 
        const results = await eventModel.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { artist: { $regex: q, $options: "i" } },
            ],
            status: { $ne: "cancelled" } // don't suggest cancelled events
        })
        .select('_id title artist eventDate bannerImage') // only what the dropdown needs
        .sort({ eventDate: 1 })
        .limit(6);
 
        return res.status(200).json({
            message: "Search results",
            results
        });
 
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Search failed",
        })
    }
}

exports.getEventByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const eventData = await eventModel.findOne({ _id: id });

        if (!eventData) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        return res.status(200).json({
            eventData
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
