import requests
import unittest
import json
import os
from datetime import datetime

class SentryWalletBackendTest(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(SentryWalletBackendTest, self).__init__(*args, **kwargs)
        # Get the backend URL from the frontend .env file
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    self.base_url = line.strip().split('=')[1].strip('"')
                    break
        
        print(f"Using backend URL: {self.base_url}")
        
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        print("\n🔍 Testing root endpoint...")
        response = requests.get(f"{self.base_url}/api/")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello World"})
        print("✅ Root endpoint test passed")
        
    def test_status_endpoint_post(self):
        """Test creating a status check"""
        print("\n🔍 Testing status POST endpoint...")
        data = {"client_name": "test_client"}
        response = requests.post(f"{self.base_url}/api/status", json=data)
        
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("id", response_data)
        self.assertEqual(response_data["client_name"], "test_client")
        self.assertIn("timestamp", response_data)
        print("✅ Status POST endpoint test passed")
        
    def test_status_endpoint_get(self):
        """Test getting status checks"""
        print("\n🔍 Testing status GET endpoint...")
        response = requests.get(f"{self.base_url}/api/status")
        
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIsInstance(response_data, list)
        
        # If there are status checks, verify their structure
        if response_data:
            first_status = response_data[0]
            self.assertIn("id", first_status)
            self.assertIn("client_name", first_status)
            self.assertIn("timestamp", first_status)
        
        print("✅ Status GET endpoint test passed")

if __name__ == "__main__":
    unittest.main()