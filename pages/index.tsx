// @ts-nocheck
import Link from 'next/link';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <div className="bg-custom-gray flex flex-col min-h-screen container mx-auto px-4">
        {/* Top row with search input and buttons */}
        <div style={{display: 'flex', width: '100%', alignItems: 'center'}} className="bg-custom-gray flex w-full mb-4">
          <div style={{width: '38%', margin: '5px 10px'}} className="w-full pr-4 mb-4 lg:mb-0">
            <mass-text-field
              label-position="left"
              label-text="Search Location:"
              input-placeholder-text="Placeholder"
              input-type="text"
              max-length={50}
            />
          </div>
          <div style={{width: '38%', margin: '5px 10px'}} className="w-full pr-4 mb-4 lg:mb-0">
            <mass-select-field 
              input-id='input00'
              label='label'
              type='light'
              label-position='left'
              is-disabled={false}
              has-error={false}
              error-message='No this is wrong'
              options={JSON.stringify([
                { name: '200 kms', value: '200 kms' },
                { name: '20 kms', value: '20 kms' },
                { name: '10 kms', value: '10 kms' },
                { name: '5 kms', value: '5 kms' },
                { name: '1 kms', value: '1 kms' },
                { name: '.5 km (1600ft)', value: '.5 km (1600ft)' },
                { name: '.3 km (1000ft)', value: '.3 km (1000ft)' },
              ])}
            />
          </div>
          <div style={{
            marginLeft: 'auto', 
            padding: '5px 2px', 
            width: '240px',
            justifyContent: 'space-around',
            display: 'flex'}} className="flex space-x-2 ml-auto">
            <mass-button
              button-id="SearchId"
              button-text="Search"
              disabled={false}
              icon-position="none"
              size="large"
              type="green"
              tone="light"
            >
              Search
            </mass-button>
            <mass-button
              button-id="ResetId"
              button-text="Reset Map"
              disabled={false}
              icon-position="none"
              size="large"
              type="red"
              tone="light"
            >
              Reset Map
            </mass-button>
          </div>
        </div>

        {/* Second row with results select */}
        <div style={{paddingBottom: '10px'}} className="flex-none mb-4">
          <mass-select-field
            input-id="input00"
            label="Results:"
            type="light"
            label-position="left"
            is-disabled={false}
            has-error={false}
            error-message="Select valid distance"
            options={JSON.stringify([
              { name: '5406 CROSSINGS DR, ROCKLIN, CA 95677', value: '5406 CROSSINGS DR, ROCKLIN, CA 95677' },
              { name: '8050 N PALM AVE, FRESNO, CA, 93711-5510, US', value: '8050 N PALM AVE, FRESNO, CA, 93711-5510, US' },
              { name: '4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424-3683, US', value: '4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424-3683, US' },
              { name: '4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424, US', value: '4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424, US' },
              { name: '255 OLD SANFORD OVIEDO RD, WINTER SPRINGS, FL, 32708-2651, US', value: '255 OLD SANFORD OVIEDO RD, WINTER SPRINGS, FL, 32708-2651, US' },
              { name: '255 OLD SANFORD OVIEDO RD, WINTER SPGS, FL, 32708, US', value: '255 OLD SANFORD OVIEDO RD, WINTER SPGS, FL, 32708, US' }
            ])}
          />
        </div>

        {/* Map component */}
        <div className="flex-grow w-full" style={{ width: '100%', height: 'calc(100vh - 130px)' }}>
          <mass-google-map
            style={{ width: '100%', height: 'calc(100vh - 130px)' }}
            center={{ lat: 37.7849, lng: -122.4294 }}
            coordinates={[
              { lat: 37.7749, lng: -124.4194 },
              { lat: 37.7849, lng: -122.4294 },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
