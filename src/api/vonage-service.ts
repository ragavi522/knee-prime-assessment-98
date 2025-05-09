
// This file contains the Vonage service functions that interact with the Vonage API

// Vonage credentials
const VONAGE_API_KEY = "b26fc285";
const VONAGE_API_SECRET = "LSiwpgJGoeqZ4Qwg";
const VONAGE_BRAND_NAME = "Precix";

// Function to send OTP via Vonage Verify API
export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; message: string; request_id?: string }> => {
  try {
    console.log(`[Vonage Service] Sending OTP to ${phoneNumber}`);
    
    const url = "https://api.nexmo.com/verify/json";
    
    const formData = new URLSearchParams({
      api_key: VONAGE_API_KEY,
      api_secret: VONAGE_API_SECRET,
      number: phoneNumber,
      brand: VONAGE_BRAND_NAME,
      code_length: "6",
      workflow_id: "6" // SMS and then voice call if SMS fails
    });
    
    console.log('[Vonage Service] Request parameters:', {
      api_key: VONAGE_API_KEY,
      number: phoneNumber,
      brand: VONAGE_BRAND_NAME,
      code_length: "6",
      workflow_id: "6"
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    console.log('[Vonage Service] Response status:', response.status);
    console.log('[Vonage Service] Response headers:', Object.fromEntries([...response.headers.entries()]));
    
    if (!response.ok) {
      console.error('[Vonage Service] Response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('[Vonage Service] Error response body:', errorText);
      throw new Error(`API returned ${response.status}: ${errorText || response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('[Vonage Service] Response text:', responseText);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response from Vonage API');
    }
    
    // Try parsing the response text as JSON
    try {
      const data = JSON.parse(responseText);
      console.log('[Vonage Service] Parsed response:', data);
      
      if (data.status === "0") {
        return { 
          success: true, 
          message: 'Verification code sent successfully', 
          request_id: data.request_id 
        };
      } else {
        return { 
          success: false, 
          message: data.error_text || 'Failed to send verification code' 
        };
      }
    } catch (parseError) {
      console.error('[Vonage Service] Failed to parse response as JSON:', parseError);
      console.error('[Vonage Service] Raw response:', responseText);
      throw new Error('Invalid JSON response from Vonage API');
    }
  } catch (error: any) {
    console.error('[Vonage Service] Error sending OTP:', error);
    return { success: false, message: error.message || 'Failed to send verification code' };
  }
};

// Function to verify OTP via Vonage Verify API
export const verifyOTP = async (requestId: string, code: string): Promise<{ success: boolean; message: string; session_id?: string }> => {
  try {
    console.log(`[Vonage Service] Verifying OTP ${code} for request ${requestId}`);
    
    const url = "https://api.nexmo.com/verify/check/json";
    
    const formData = new URLSearchParams({
      api_key: VONAGE_API_KEY,
      api_secret: VONAGE_API_SECRET,
      request_id: requestId,
      code: code
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    console.log('[Vonage Service] Verification response status:', response.status);
    console.log('[Vonage Service] Verification response headers:', Object.fromEntries([...response.headers.entries()]));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Vonage Service] Error response body:', errorText);
      throw new Error(`API returned ${response.status}: ${errorText || response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('[Vonage Service] Verification response text:', responseText);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response from Vonage API');
    }
    
    // Try parsing the response text as JSON
    try {
      const data = JSON.parse(responseText);
      console.log('[Vonage Service] Verification parsed response:', data);
      
      if (data.status === "0") {
        // Generate a session ID for the verified user
        const sessionId = `vonage_${Date.now()}_${requestId}`;
        
        return { 
          success: true, 
          message: 'Verification successful', 
          session_id: sessionId 
        };
      } else {
        return { 
          success: false, 
          message: data.error_text || 'Failed to verify code' 
        };
      }
    } catch (parseError) {
      console.error('[Vonage Service] Failed to parse verification response as JSON:', parseError);
      console.error('[Vonage Service] Raw verification response:', responseText);
      throw new Error('Invalid JSON response from Vonage API');
    }
  } catch (error: any) {
    console.error('[Vonage Service] Error verifying OTP:', error);
    return { success: false, message: error.message || 'Failed to verify code' };
  }
};

// Function to validate a session (this would typically check against a database in a real app)
export const validateSession = async (sessionId: string): Promise<{ valid: boolean; phone_number: string | null }> => {
  try {
    // In a real implementation, you would check if the session is valid in your database
    console.log(`[Vonage Service] Validating session ${sessionId}`);
    
    // This is a placeholder implementation
    // A real implementation would verify the session against a database
    const isValid = sessionId.startsWith('vonage_');
    
    // Extract request ID from session ID (in a real app, you'd look this up in your database)
    let phoneNumber = null;
    if (isValid) {
      // In a real app, you would look up the phone number associated with this session
      // For now, we just simulate it
      phoneNumber = "+123456789";
    }
    
    return { valid: isValid, phone_number: phoneNumber };
  } catch (error: any) {
    console.error('[Vonage Service] Error validating session:', error);
    return { valid: false, phone_number: null };
  }
};
