import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const formData = new FormData();
      const payload = JSON.parse(data)

      // Convert JSON data to FormData
      Object.keys(payload).forEach(key => {
        if (Array.isArray(payload[key])) {
          payload[key].forEach(value => formData.append(`${key}[]`, value));
        } else {
          formData.append(key, payload[key]);
        }
      });
      
      const externalResponse = await fetch('https://maps.massivenetworks.com/temp/form/form.php', {
        method: 'POST',
        body: formData,
      });

      if (!externalResponse.ok) {
        throw new Error(`HTTP error! status: ${externalResponse.status}`);
      }
      const htmlResponse = await externalResponse.text();
      console.log(htmlResponse, 'htmlResponse')

      res.status(200).json({
        'result': 'ok',
      });
    } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
