import mongoose from 'mongoose';

const connectTestDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.TEST_MONGODB_URI);
		console.log(`Test MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit(1);
	}
};

export default connectTestDB;
