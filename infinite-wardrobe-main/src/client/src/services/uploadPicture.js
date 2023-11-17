import axios from "axios"

const uploadPicture = async (image) => {
    try {
        console.log(image)
        const data = {
          'image': image
        }
        const headers = {
          'Content-Type': 'application/json'
      }
    
        const response = await axios.post('/api/clothing', data, {
            headers: headers,
            withCredentials: true,
        });
    
        console.log('Data posted successfully:', response.data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    
}

export default uploadPicture