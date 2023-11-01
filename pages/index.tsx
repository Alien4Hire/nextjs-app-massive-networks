import Link from 'next/link'
import Layout from '../components/Layout'
import * as something from 'massive-networks-shared-web-components'
console.log(something)
const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    {/* <mass-google-map
        center={lat:37.7849, lng: -122.4294}
        coordinates={[
          { lat: 37.7749, lng: -124.4194 },
          { lat: 37.7849, lng: -122.4294 } 
        ]}
    /> */}
    {/* @ts-ignore */}
    {/* <mass-button>Button</mass-button> */}
  </Layout>
)

export default IndexPage
