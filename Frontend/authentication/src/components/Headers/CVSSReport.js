import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Row, Col, Form } from 'react-bootstrap';
import './ShowVulnerability.css';
import LOGO from '../../images/dark.png';
import { useReactToPrint } from 'react-to-print';
import { Dropdown, Menu, Button, message } from 'antd';
import { CopyOutlined, MenuOutlined, PrinterOutlined } from '@ant-design/icons';

const CVSSReport = () => {
  const location = useLocation();
  const [showDiv, setShowDiv] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    console.log(location.state.vulnerability);

    if (location.state.vulnerability.description) {
      setShowDiv(true);
    }

  }, [location.state.vulnerability]);


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      const printButton = document.getElementById('print-button');
      const dropButton = document.getElementById('drop-button');
      if (printButton) {
        printButton.style.display = 'none'; // Hide the button before printing
      }
      if (dropButton) {
        dropButton.style.display = 'none'; // Hide the button before printing
      }
      console.log('Preparing to print...');
    },
    onAfterPrint: () => {
      const printButton = document.getElementById('print-button');
      const dropButton = document.getElementById('drop-button');
      if (printButton) {
        printButton.style.display = 'block'; // Hide the button before printing
      }
      if (dropButton) {
        dropButton.style.display = 'block'; // Hide the button before printing
      }
      console.log('Printing completed!');
    }
  });

  const handleCopyLink = () => {
    const link = `http://localhost:3000/searchVulnerability/${location.state.vulnerability.id}`;
    navigator.clipboard.writeText(link);
    message.success('Link copied!');
  };

  const menu = (
    <Menu>
      <Menu.Item key='copyLink' icon={<CopyOutlined />} onClick={handleCopyLink}>
        Copy Link
      </Menu.Item>
      <Menu.Item key='printPDF' icon={<PrinterOutlined />} onClick={handlePrint}>
        Print PDF
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className='container' ref={componentRef} style={{ marginBottom: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <Dropdown overlay={menu}>
            <Button
              id='drop-button'
              type='primary'
              icon={<MenuOutlined />}
              size='large'
              ghost
              style={{ background: 'none', border: 'none' }}
            />
          </Dropdown>
        </div>
        <div className="demo-logo-vertical" style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={LOGO} alt="Logo" style={{ width: '180px', marginTop: '10px', marginBottom: '10px' }} />
        </div>
        <h5 style={{ textAlign: 'center', marginBottom: 40, marginTop: 10 }}><strong>Software Vulnerability Assessment System</strong></h5>
        <Row className="vulnerability-header">
        </Row>
        {showDiv && (
          <div>
            <p><strong>Description:</strong></p>
            <Row>
              <Col className="d-flex justify-content-center">
                <div className="message-box border">
                  <p>{location.state.vulnerability.description}</p>
                </div>
              </Col>
            </Row>
          </div>
        )}
        <Row>
          <Col>
            <Form>
              <Form.Group>
                <Form.Label>Attack vector:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.attackVector} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>Attack complexity:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.attackComplexity} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>Privileges required:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.privilegesRequired} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>User interaction:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.userInteraction} readOnly />
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Group>
                <Form.Label>Scope:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.scope} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confidentiality:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.confidentialityImpact} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>Integrity:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.integrityImpact} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>Availability:</Form.Label>
                <Form.Control type="text" value={location.state.vulnerability.availabilityImpact} readOnly />
              </Form.Group>
            </Form>
          </Col>
          <Col className='scoreTable'>
            <Table striped bordered style={{ marginTop: 25 }} >
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Impact Sub Score</td>
                  <td>{location.state.vulnerability.impactSubScore}</td>
                </tr>
                <tr>
                  <td>Impact Score</td>
                  <td>{location.state.vulnerability.impactScore}</td>
                </tr>
                <tr>
                  <td>Exploitability Score</td>
                  <td>{location.state.vulnerability.exploitabilityScore}</td>
                </tr>
                <tr>
                  <td>CVSS Score</td>
                  <td>{location.state.vulnerability.baseScore}</td>
                </tr>
                <tr>
                  <td>Severity</td>
                  <td>{location.state.vulnerability.severity}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CVSSReport;
