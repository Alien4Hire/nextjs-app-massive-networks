import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apiUrl = 'https://maps.massivenetworks.com/buildinglocator.php';
    const { lat, lng, radius, address, center } = _req.query;
    const params = new URLSearchParams({
      lat: lat as string,
      lng: lng as string,
      radius: radius as string,
      address: address as string,
      center: center as string,
    });

    const response = await fetch(`${apiUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const xmlData = await response.text();
    const jsonData = await parseStringPromise(xmlData);
    const parseData = jsonData.markers.marker.map(m => m.$);
    res.status(200).json(parseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
