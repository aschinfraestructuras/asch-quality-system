import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro: ${error.message}`);
    } else {
      console.error('Erro desconhecido ao conectar ao MongoDB');
    }
    process.exit(1);
  }
};

export default connectDB;