// cloudinary.js - Utility for image uploads to Cloudinary

const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Uploads an image to Cloudinary
 * @param {string} base64Image - The base64-encoded image data
 * @returns {Promise<string>} - The URL of the uploaded image
 */
const uploadImage = async (base64Image) => {
  try {
    // For MVP, we'll just return a placeholder URL
    // In a real implementation, this would upload to Cloudinary
    
    return `https://placehold.co/400x500/png?text=ClothingItem`;
    
    /* 
    // Actual Cloudinary implementation (commented out for MVP)
    
    // Extract base64 data
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64Data}`);
    formData.append('upload_preset', 'fittedup_preset'); // Create this preset in Cloudinary dashboard
    
    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Return the secure URL of the uploaded image
    return response.data.secure_url;
    */
    
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

module.exports = { uploadImage }; 