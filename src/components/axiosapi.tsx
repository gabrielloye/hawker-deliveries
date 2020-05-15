import axios from 'axios';

export default axios.create({
  baseURL: `https://5ppl4eeg57.execute-api.ap-southeast-1.amazonaws.com/dev`
});