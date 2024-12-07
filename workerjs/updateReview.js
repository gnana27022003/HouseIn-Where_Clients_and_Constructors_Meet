const mongoose = require('mongoose');
const workermodel = require('../model/workermodel'); // Adjust path as needed

// Function to update review
const updateReview = async (workerId, review) => {
    try {
        const worker = await workermodel.findOne({uniqueId:workerId});

        if (!worker) {
            throw new Error('Worker not found');
        }

        worker.reviews.push(review);

        await worker.save();
        console.log('Review added successfully:', review);
        return { success: true, message: 'Review added successfully' };
    } catch (error) {
        console.error('Error adding review:', error);
        return { success: false, message: 'Error adding review' };
    }
};

module.exports = { updateReview };
