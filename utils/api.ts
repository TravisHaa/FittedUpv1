// // api.ts - API utility functions for the frontend

// import axios from 'axios';

// // API base URL - change this to your backend server URL
// const API_URL = 'http://localhost:3000/api';

// // Type for listing details returned by the API
// export interface ListingDetails {
//   description: string;
//   size: string;
//   brand: string;
//   color: string;
// }

// /**
//  * Uploads an image and returns the URL
//  * @param {string} imageUri - The URI of the image to upload
//  * @returns {Promise<string>} - The URL of the uploaded image
//  */
// export const uploadImage = async (imageUri: string): Promise<string> => {
//   try {
//     // Convert image URI to base64
//     // In a real implementation, we'd use FileSystem.readAsStringAsync
//     // For MVP, we'll just mock it
    
//     // Mock API call
//     return `https://placehold.co/400x500/png?text=ClothingItem`;
    
//     /* 
//     // Real implementation (for after MVP):
//     const base64 = await imageToBase64(imageUri);
//     const response = await axios.post(`${API_URL}/uploads/image`, {
//       image: base64
//     });
//     return response.data.url;
//     */
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     throw new Error('Failed to upload image');
//   }
// };

// /**
//  * Generates a listing based on two images
//  * @param {string} frontImageUrl - URL of the front image
//  * @param {string} backImageUrl - URL of the back image
//  * @returns {Promise<ListingDetails>} - The generated listing details
//  */
// export const generateListing = async (frontImageUrl: string, backImageUrl: string): Promise<ListingDetails> => {
//   try {
//     // In a real implementation, this would call our backend API
    
//     // For MVP, we'll simulate a response with a delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     return {
//       description: "Vintage Nike crewneck in excellent condition. Slightly faded blue color adds to the retro aesthetic. Comfortable cotton blend fabric.",
//       size: "Medium",
//       brand: "Nike",
//       color: "Blue"
//     };
    
//     /* 
//     // Real implementation (for after MVP):
//     const response = await axios.post(`${API_URL}/listings/generate`, {
//       frontImageUrl,
//       backImageUrl
//     });
//     return response.data;
//     */
//   } catch (error) {
//     console.error('Error generating listing:', error);
//     throw new Error('Failed to generate listing');
//   }
// }; 