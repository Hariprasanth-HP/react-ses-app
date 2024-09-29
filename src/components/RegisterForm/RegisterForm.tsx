// src/RegisterForm.js

import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import Papa from 'papaparse';
import AWS from 'aws-sdk'

const S3_BUCKET =import.meta.env.VITE_APP_S3_BUCKET_NAME;
const REGION =import.meta.env.VITE_APP_AWS_REGION; 
AWS.config.update({
    accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})
const RegisterForm = () => {
  console.log('import.meta.env.VITE_APP_S3_BUCKET_NAME',import.meta.env.VITE_APP_S3_BUCKET_NAME);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<any>({});
  const validateForm = () => {
    const newErrors: any = {};
    if (!username) {
      newErrors.username = "Username is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = { username, email };
      uploadCSVToS3(formData);
      setUsername("");
      setEmail("");
      setErrors({});
    }
  };
  const uploadCSVToS3 = async (data: any) => {
    const csv = await Papa.unparse([data]); 
    const blob =  new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const fileName = `form_data_${Date.now()}.csv`;
    try {
          const params: any = {
            Bucket: import.meta.env.VITE_APP_S3_BUCKET_NAME,
            Key: fileName,
            Body: blob,
            ContentType: "text/csv",
          };

          myBucket.upload(params, (err:any, data:any) => {
            if (err) {
              console.error('Error uploading file:', err);
              return;
            }
            console.log('Successfully uploaded file:', data.Location);
          });
    } catch (error) {
        console.log('error',error);
    }
    
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 6,
          background: "white",
          padding: "40px",
          borderRadius: "10%",
        }}
      >
        <Typography color="black" variant="h4" align="center">
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <Button onClick={handleSubmit} variant="contained" color="primary" type="submit" fullWidth>
            Submit
          </Button>
          {Object.keys(errors).length > 0 && (
            <Box mt={2}>
              <Alert severity="error">Please fix the errors above.</Alert>
            </Box>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default RegisterForm;
