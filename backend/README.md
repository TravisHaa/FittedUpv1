# FittedUp Backend API

This is the backend service for the FittedUp application, which provides API endpoints for image uploads and AI-powered listing generation.

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Start the server:
   ```
   npm start
   ```

For development with auto-restart:

```
npm run dev
```

## API Endpoints

### Image Upload

**POST /api/uploads/image**

Uploads an image and returns a URL.

Request body:

```json
{
  "image": "base64_encoded_image_data"
}
```

Response:

```json
{
  "url": "https://example.com/image.jpg"
}
```

### Listing Generation

**POST /api/listings/generate**

Generates a listing based on two images.

Request body:

```json
{
  "frontImageUrl": "https://example.com/front.jpg",
  "backImageUrl": "https://example.com/back.jpg"
}
```

Response:

```json
{
  "description": "Vintage Nike crewneck in excellent condition...",
  "size": "Medium",
  "brand": "Nike",
  "color": "Blue"
}
```

## Implementation Notes

- For the MVP, image uploads return placeholder URLs instead of actually uploading to Cloudinary.
- The listing generation returns mock data instead of calling the OpenAI API.
- In a production implementation, these would be replaced with actual API calls.
