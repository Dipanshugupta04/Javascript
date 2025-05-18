import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Navthird from '../components/Navthird';
import axios from 'axios';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const TrackReports = () => {
  const [crimes, setCrimes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/crimes/getallcrimes')
      .then(response => {
        setCrimes(response.data);
      })
      .catch(error => {
        console.error('Error fetching crimes:', error);
      });
  }, []);

  const filteredCrimes = crimes.filter(
    crime =>
      crime._id?.toLowerCase().includes(search.toLowerCase()) ||
      crime.crimetitle?.toLowerCase().includes(search.toLowerCase()) ||
      crime.crimecategory?.toLowerCase().includes(search.toLowerCase()) ||
      crime.crimedesc?.toLowerCase().includes(search.toLowerCase()) ||
      crime.crimelocation?.toLowerCase().includes(search.toLowerCase()) ||
      crime.status?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#e74c3c';
      case 'investigating': return '#f39c12';
      case 'resolved': return '#2ecc71';
      default: return '#000';
    }
  };

  const getCrimeIcon = (type) => {
    const icons = {
      theft: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      assault: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
      murder: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      burglary: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      robbery: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    };
    return icons[type?.toLowerCase()] || "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  };

  const handleViewOnMap = (crime) => {
    if (crime.latitude && crime.longitude) {
      setSelectedCrime(crime);
      setMapCenter({
        lat: parseFloat(crime.latitude),
        lng: parseFloat(crime.longitude)
      });
      setShowMapModal(true);
    } else {
      alert("This crime report doesn't have location coordinates.");
    }
  };

  const handleCloseModal = () => {
    setShowMapModal(false);
    setSelectedCrime(null);
  };

  const containerStyle = {
    width: '100%',
    height: '500px'
  };

  const mapOptions = {
    styles: [
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "featureType": "poi",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
      }
    ]
  };

  return (
    <>
      <Navbar />
      <Navthird />
      <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f4f4f4', paddingTop: 110 }}>
        <main style={{ padding: 20, maxWidth: 1200, margin: '30px auto 0' }}>
          <div style={{ backgroundColor: '#fff', padding: 30, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#9a1414', marginBottom: 20, fontSize: '1.8rem' }}>
              Track Crime Reports
            </h2>

            <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
                <input
                  type="text"
                  placeholder="Search by ID, title, category, location, etc..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    paddingRight: 50,
                    border: '1px solid #ddd',
                    borderRadius: 30,
                    fontSize: '1rem'
                  }}
                />
                <button
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 5,
                    background: '#9a1414',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    cursor: 'pointer'
                  }}
                >
                  🔍
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                <thead>
                  <tr>
                    {['ID', 'Title', 'Category', 'Location', 'Status', 'Images', 'Reported At', 'Actions'].map(header => (
                      <th
                        key={header}
                        style={{
                          padding: 12,
                          backgroundColor: '#f5f5f5',
                          borderBottom: '2px solid #ccc',
                          color: '#002147',
                          textAlign: 'center'
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCrimes.length > 0 ? (
                    filteredCrimes.map((crime, index) => (
                      <tr key={index} style={{ cursor: 'pointer', transition: 'background 0.2s' }} 
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                        <td style={tdStyle}>{crime._id?.substring(0, 8)}...</td>
                        <td style={tdStyle}>{crime.crimetitle}</td>
                        <td style={tdStyle}>{crime.crimecategory}</td>
                        <td style={tdStyle}>{crime.crimelocation}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: getStatusColor(crime.status) }}>
                          {crime.status}
                        </td>
                        <td style={tdStyle}>
                          {crime.images && crime.images.length > 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <img
                                src={crime.images[0]}
                                alt="evidence"
                                style={{ 
                                  width: 50, 
                                  height: 50, 
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                onClick={() => window.open(crime.images[0], '_blank')}
                              />
                              {crime.images.length > 1 && (
                                <div style={{
                                  marginLeft: '5px',
                                  background: '#eee',
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8rem',
                                  color: '#666'
                                }}>
                                  +{crime.images.length - 1}
                                </div>
                              )}
                            </div>
                          ) : (
                            'No Images'
                          )}
                        </td>
                        <td style={tdStyle}>{new Date(crime.createdAt).toLocaleDateString()}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => handleViewOnMap(crime)}
                            style={{
                              background: '#9a1414',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.9rem'
                            }}
                          >
                            <i className="fas fa-map-marker-alt"></i> View Map
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ ...tdStyle, textAlign: 'center' }}>No crimes found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            padding: '20px',
            position: 'relative'
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#9a1414'
              }}
            >
              &times;
            </button>
            
            <h2 style={{ marginBottom: '15px', color: '#9a1414' }}>
              {selectedCrime?.crimetitle} - {selectedCrime?.crimecategory}
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Location:</strong> {selectedCrime?.crimelocation}</p>
              <p><strong>Status:</strong> 
                <span style={{ 
                  color: getStatusColor(selectedCrime?.status),
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {selectedCrime?.status}
                </span>
              </p>
              <p><strong>Reported At:</strong> {new Date(selectedCrime?.createdAt).toLocaleString()}</p>
            </div>
            
            <div style={{ height: '500px', marginBottom: '15px' }}>
              <LoadScript
                googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
                onLoad={() => setIsMapLoaded(true)}
              >
                {isMapLoaded && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={15}
                    options={mapOptions}
                  >
                    <Marker
                      position={mapCenter}
                      icon={getCrimeIcon(selectedCrime?.crimecategory)}
                      onClick={() => {}}
                    />
                    <InfoWindow
                      position={mapCenter}
                      onCloseClick={() => {}}
                    >
                      <div style={{ maxWidth: '300px' }}>
                        <h3 style={{ margin: '0 0 10px', color: '#9a1414' }}>
                          {selectedCrime?.crimetitle}
                        </h3>
                        <p><strong>Type:</strong> {selectedCrime?.crimecategory}</p>
                        <p><strong>Status:</strong> 
                          <span style={{ color: getStatusColor(selectedCrime?.status) }}>
                            {selectedCrime?.status}
                          </span>
                        </p>
                        <p><strong>Description:</strong> {selectedCrime?.crimedesc}</p>
                        {selectedCrime?.images && selectedCrime.images.length > 0 && (
                          <div style={{ marginTop: '10px' }}>
                            <img 
                              src={selectedCrime.images[0]} 
                              alt="Crime scene" 
                              style={{ width: '100%', borderRadius: '4px' }} 
                            />
                          </div>
                        )}
                      </div>
                    </InfoWindow>
                  </GoogleMap>
                )}
              </LoadScript>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '10px' }}>Description:</h3>
              <p style={{ marginBottom: '15px' }}>{selectedCrime?.crimedesc}</p>
              
              {selectedCrime?.images && selectedCrime.images.length > 0 && (
                <>
                  <h3 style={{ marginBottom: '10px' }}>Evidence Images:</h3>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '10px'
                  }}>
                    {selectedCrime.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Evidence ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => window.open(img, '_blank')}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const tdStyle = {
  padding: 10,
  borderBottom: '1px solid #eee',
  textAlign: 'center',
  verticalAlign: 'middle'
};

export default TrackReports;
