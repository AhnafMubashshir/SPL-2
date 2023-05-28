import React, { useEffect, useState } from 'react';
import { InboxOutlined, RightCircleFilled } from '@ant-design/icons'
import { Button, message, Modal, Upload } from 'antd';
import axios from 'axios';
import AuthService from '../../AuthService';
import { useNavigate, useParams } from 'react-router-dom';

const TrainModel = () => {
  const params = useParams()
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sMessage, setSMessage] = useState();
  const [successModal, setSuccessModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const token = AuthService.getToken()
    axios.post('http://localhost:5050/validator/checkValidation', {
      token: token,
      userID: params
    }).then((response) => {
      console.log("Train Model Access: ", response);
      setIsAuthenticated(response.data.trainModelAccess);
    })
  }, [params, setIsAuthenticated])

  const { Dragger } = Upload;
  const props = {
    multiple: true,
    action: 'http://localhost:5050/uploadFile',
    name: 'jsonFile',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFileName(info.file.name);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const handleTraining = async () => {
    setLoading(true);
    let path = `./${fileName}`;
    let data = require(`${path}`);
    console.log(path);

    const response = await axios.post('http://10.100.101.160:5000/training_data', {
      data: data,
      file_name: fileName
    });

    console.log(response.data.message);
    setSMessage(response.data.message);

    setLoading(false);

    setSuccessModal(true);
  };

  function handleSuccessCancel() {
    setSuccessModal(false);
  }

  if (isAuthenticated === null) {
    return null;
  } else if (isAuthenticated === false) {
    navigate('/error');
    return null;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 80,
        marginRight: 70,
        marginTop: 20,
        flexDirection: 'column'
      }}
      >
        <h2 style={{ color: '192841', marginBottom: 15 }}>Train Your Model</h2>
        <p>
          Please provide a description of the vulnerability on your system. This calculator will evaluate the severity
          of the vulnerability based on standardized base metrics. Once you have provided the description, click the
          "Calculate Base Score" button to obtain the base severity score.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 50 }}>
        <Button type="primary" onClick={handleTraining} style={{ background: '#276221' }} loading={loading}>
          Train Model
        </Button>
      </div>

      <Modal
        visible={successModal}
        title="Training Confirmation"
        onOk={handleSuccessCancel}
        onCancel={handleSuccessCancel}
        okButtonProps={{ style: { background: '#192841' } }}
      >
        <p><RightCircleFilled /> {sMessage}</p>
      </Modal>
    </div>
  );
};

export default TrainModel;
