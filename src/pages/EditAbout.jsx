import React, { useState, useEffect } from 'react';
import { getAbout, updateAbout } from '../api';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import '../styles/EditAbout.css';
const EditAbout = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const data = await getAbout();
      setAbout(data);
      setError(null);
    } catch (err) {
      setError('Failed to load about information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setAbout({
          ...about,
          [parent]: {
            ...about[parent],
            [child]: {
              ...about[parent][child],
              [subChild]: value
            }
          }
        });
      } else {
        setAbout({
          ...about,
          [parent]: {
            ...about[parent],
            [child]: value
          }
        });
      }
    } else {
      setAbout({ ...about, [name]: value });
    }
  };

  const handleArrayChange = (name, index, value) => {
    const newArray = [...about[name]];
    newArray[index] = value;
    setAbout({ ...about, [name]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await updateAbout(about);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!about) {
    return (
      <Container>
        <Alert variant="danger">Failed to load about information. Please refresh the page.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Edit About Section</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Changes saved successfully!</Alert>}
      
      <Row className="mb-4">
        <Col md={3}>
          <div className="nav flex-column nav-pills">
            <Button 
              variant={activeTab === 'general' ? 'primary' : 'outline-primary'} 
              className="mb-2 text-start" 
              onClick={() => setActiveTab('general')}
            >
              General Information
            </Button>
            <Button 
              variant={activeTab === 'vision' ? 'primary' : 'outline-primary'} 
              className="mb-2 text-start" 
              onClick={() => setActiveTab('vision')}
            >
              Vision & Mission
            </Button>
            <Button 
              variant={activeTab === 'benefits' ? 'primary' : 'outline-primary'} 
              className="mb-2 text-start" 
              onClick={() => setActiveTab('benefits')}
            >
              Benefits & Audience
            </Button>
            <Button 
              variant={activeTab === 'technologies' ? 'primary' : 'outline-primary'} 
              className="mb-2 text-start" 
              onClick={() => setActiveTab('technologies')}
            >
              Technologies
            </Button>
            <Button 
              variant={activeTab === 'contact' ? 'primary' : 'outline-primary'} 
              className="mb-2 text-start" 
              onClick={() => setActiveTab('contact')}
            >
              Contact & Social
            </Button>
            <Button 
              variant={activeTab === 'images' ? 'primary' : 'outline-primary'} 
              className="mb-2 text-start" 
              onClick={() => setActiveTab('images')}
            >
              Images
            </Button>
          </div>
        </Col>
        
        <Col md={9}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* General Information */}
                {activeTab === 'general' && (
                  <>
                    <h3 className="mb-3">General Information</h3>
                    <Form.Group className="mb-3">
                      <Form.Label>Heading</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="heading" 
                        value={about.heading || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    {/* <Form.Group className="mb-3">
                      <Form.Label>Introduction</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="intro" 
                        value={about.intro || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group> */}
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Who We Are</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="whoWeAre" 
                        value={about.whoWeAre || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    {/* <Form.Group className="mb-3">
                      <Form.Label>What We Do</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="whatWeDo" 
                        value={about.whatWeDo || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                     */}
                    <Form.Group className="mb-3">
                      <Form.Label>Commitment Statement</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="commitment" 
                        value={about.commitment || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </>
                )}
                
                {/* Vision & Mission */}
                {activeTab === 'vision' && (
                  <>
                    <h3 className="mb-3">Vision & Mission</h3>
                    <Form.Group className="mb-3">
                      <Form.Label>Vision</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="vision" 
                        value={about.vision || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Vision Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="visionImage" 
                        value={about.visionImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.visionImage && (
                        <div className="mt-2">
                          <img 
                            src={about.visionImage} 
                            alt="Vision" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Mission</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="mission" 
                        value={about.mission || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Mission Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="missionImage" 
                        value={about.missionImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.missionImage && (
                        <div className="mt-2">
                          <img 
                            src={about.missionImage} 
                            alt="Mission" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>
                  </>
                )}
                
                {/* Benefits & Audience */}
                {activeTab === 'benefits' && (
                  <>
                    <h3 className="mb-3">Benefits & Target Audience</h3>
                    
                    
                    
                    {about.whoCanBenefit && about.whoCanBenefit.map((item, index) => (
                      <Form.Group className="mb-2" key={`benefit-${index}`}>
                        <Form.Control 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleArrayChange('whoCanBenefit', index, e.target.value)} 
                        />
                      </Form.Group>
                    ))}
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Who Can Benefit Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="whoCanBenefitImage" 
                        value={about.whoCanBenefitImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.whoCanBenefitImage && (
                        <div className="mt-2">
                          <img 
                            src={about.whoCanBenefitImage} 
                            alt="Who Can Benefit" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>
                    


<Form.Label>What Makes Us Different</Form.Label>

 {about.whatMakesUsDifferent && about.whatMakesUsDifferent.map((item, index) => (
                      <Form.Group className="mb-2" key={`benefit-${index}`}>
                        <Form.Control 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleArrayChange('whatMakesUsDifferent', index, e.target.value)} 
                        />
                      </Form.Group>
                    ))}
                    
                    <Form.Group className="mb-3">
                      <Form.Label>What Makes Us Different Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="whatMakesUsDifferentImage" 
                        value={about.whatMakesUsDifferentImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.whatMakesUsDifferentImage && (
                        <div className="mt-2">
                          <img 
                            src={about.whatMakesUsDifferentImage} 
                            alt="What Makes Us Different" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>






                    {/* <Form.Group className="mb-3">
                      <Form.Label>What Makes Us Different</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="whatMakesUsDifferent" 
                        value={about.whatMakesUsDifferent || ''} 
                        onChange={handleChange} 
                      />
                      {about.whatMakesUsDifferent && (
                        <div className="mt-2">
                          <img 
                            src={about.whatMakesUsDifferentImage} 
                            alt="What Makes Us Different" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group> */}




                    {/* <Form.Label>Target Audience</Form.Label>
                    {about.whoCanBenefitSubtitle && about.whoCanBenefitSubtitle.map((item, index) => (
                      <Form.Group className="mb-2" key={`audience-${index}`}>
                        <Form.Control 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleArrayChange('whoCanBenefitSubtitle', index, e.target.value)} 
                        />
                      </Form.Group>
                    ))} */}
{/*                     
                    <Form.Group className="mb-3">
                      <Form.Label>Target Audience Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="whoBenefitSubtitleImage" 
                        value={about.whoBenefitSubtitleImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.whoBenefitSubtitleImage && (
                        <div className="mt-2">
                          <img 
                            src={about.whoBenefitSubtitleImage} 
                            alt="Target Audience" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group> */}
                  </>
                )}
                
                {/* Technologies */}
                {activeTab === 'technologies' && (
                  <>
                    <h3 className="mb-3">Technologies & Courses</h3>
                    <Form.Label>Technologies & Courses Offered</Form.Label>
                    {about.technologies && about.technologies.map((item, index) => (
                      <Form.Group className="mb-2" key={`tech-${index}`}>
                        <Form.Control 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleArrayChange('technologies', index, e.target.value)} 
                        />
                      </Form.Group>
                    ))}
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Technologies Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="technologiesImage" 
                        value={about.technologiesImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.technologiesImage && (
                        <div className="mt-2">
                          <img 
                            src={about.technologiesImage} 
                            alt="Technologies" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>
                  </>
                )}
                
                {/* Contact & Social */}
                {activeTab === 'contact' && (
                  <>
                    <h3 className="mb-3">Contact & Social Media</h3>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="contact.email" 
                        value={about.contact?.email || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Website</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="contact.website" 
                        value={about.contact?.website || ''} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                   
                  </>
                )}
                
                {/* Images */}
                {activeTab === 'images' && (
                  <>
                    <h3 className="mb-3">Commitment Image</h3>
                   
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Commitment Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="commitmentImage" 
                        value={about.commitmentImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.commitmentImage && (
                        <div className="mt-2">
                          <img 
                            src={about.commitmentImage} 
                            alt="Commitment" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>

                    <h3 className="mb-3">Who We Are Image</h3>      

                    <Form.Group className="mb-3">
                      <Form.Label>Who We Are Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="whoWeAreImage" 
                        value={about.whoWeAreImage || ''} 
                        onChange={handleChange} 
                      />
                      {about.whoWeAreImage && (
                        <div className="mt-2">
                          <img 
                            src={about.whoWeAreImage} 
                            alt="Who We Are" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>

                  </>
                )}
                
                <div className="d-flex justify-content-end mt-4">
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditAbout;