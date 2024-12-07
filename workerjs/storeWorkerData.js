const workermodel = require('../model/workermodel');
const { v4: uuidv4 } = require('uuid');
const storeWorkerData = async (req, res) => {
    try {
        const profileImageFile = req.files['profile_image'][0] ;
        const previousWorkFiles = req.files['previous_work'];

        const profileImage = {
            filename: profileImageFile.filename,
            contentType: profileImageFile.mimetype,
            uploadDate: new Date(),
            metadata: {}
        }

        const previousWork = [];
        const seenFiles = new Set();

        for (let file of previousWorkFiles) {
            if (!seenFiles.has(file.filename)) {
                seenFiles.add(file.filename);
                previousWork.push({
                    filename: file.filename,
                    contentType: file.mimetype,
                    uploadDate: new Date(),
                    metadata: {}
                });
            }
        }
        console.log(req.files); // Log the files received to confirm
        console.log(profileImage); // Log profile image details before saving
       
        const newWorker = new workermodel({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            uniqueId: uuidv4(),
            pincode: req.body.pincode,
            location: req.body.location,
            service_type: req.body.service_type,
            cost: req.body.cost,
            experience: req.body.experience,
            group_or_individual: req.body.group_or_individual,
            workers: req.body.workers || null,
            previous_work: previousWork || null,
            profile_image: profileImage,
            working_hours: req.body.working_hours,
            working_days: req.body.working_days,
            tools_provided: req.body.tools_provided,
            description: req.body.description,
            role: 'worker'
        });
        req.session.user=newWorker;
      
        const savedWorker = await newWorker.save();
        console.log(savedWorker);
        return { success: true };
    } catch (error) {
        console.error('Error saving worker data:', error);
        return { success: false };
    }
};

module.exports = { storeWorkerData };
