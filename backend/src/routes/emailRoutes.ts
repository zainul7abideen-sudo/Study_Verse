import { Router } from 'express';
import { 
  sendOtpVerificationEmail, 
  sendOrderReceiptEmail, 
  sendCancellationNoticeEmail,
  sendEmailJS,
  EMAIL_TEMPLATES 
} from '../services/emailService.js';

export const emailRoutes = Router();

// 1. Send OTP Email Verification / Password Reset
emailRoutes.post('/send-otp', async (req, res) => {
  const { email, name, otpCode, purpose } = req.body;
  if (!email || !otpCode) {
    res.status(400).json({ error: 'Email and otpCode are required' });
    return;
  }

  const result = await sendOtpVerificationEmail(
    email,
    name || 'Student',
    otpCode,
    purpose || 'University Verification'
  );

  res.json({
    success: result.success,
    message: result.success ? `OTP sent successfully to ${email}` : 'Failed to send OTP email',
    details: result
  });
});

// 2. Send Order Confirmation Receipt
emailRoutes.post('/order-receipt', async (req, res) => {
  const { email, name, orderId, totalAmount, itemsList, shippingAddress, vendorName } = req.body;
  if (!email || !orderId || totalAmount === undefined) {
    res.status(400).json({ error: 'Email, orderId, and totalAmount are required' });
    return;
  }

  const result = await sendOrderReceiptEmail(email, name || 'Student', {
    orderId,
    totalAmount,
    itemsList: itemsList || 'Academic Textbooks & Supplies',
    shippingAddress: shippingAddress || 'Campus Hostel Address',
    vendorName: vendorName || 'Dropship Fulfillment Partner'
  });

  res.json({
    success: result.success,
    message: result.success ? `Order receipt sent to ${email}` : 'Failed to send receipt',
    details: result
  });
});

// 3. Send Cancellation & Refund Notice
emailRoutes.post('/cancel-notice', async (req, res) => {
  const { email, name, orderId, refundAmount, reason } = req.body;
  if (!email || !orderId) {
    res.status(400).json({ error: 'Email and orderId are required' });
    return;
  }

  const result = await sendCancellationNoticeEmail(
    email,
    name || 'Student',
    orderId,
    refundAmount || 0,
    reason || 'Cancelled by student'
  );

  res.json({
    success: result.success,
    message: result.success ? `Cancellation notice sent to ${email}` : 'Failed to send notice',
    details: result
  });
});

// 4. Custom EmailJS Proxy Dispatch
emailRoutes.post('/custom', async (req, res) => {
  const { templateId, templateParams } = req.body;
  if (!templateId || !templateParams) {
    res.status(400).json({ error: 'templateId and templateParams are required' });
    return;
  }

  const result = await sendEmailJS({
    templateId,
    templateParams
  });

  res.json({
    success: result.success,
    message: result.success ? 'Email dispatched' : 'Dispatch warning',
    details: result
  });
});

// 5. Email Connectivity Test
emailRoutes.get('/test', async (req, res) => {
  const testEmail = (req.query.email as string) || 'student@sss.edu';
  const testName = 'Test Student';
  
  const otpResult = await sendOtpVerificationEmail(testEmail, testName, '998877', 'Connectivity Test');
  
  res.json({
    message: 'EmailJS Connectivity Test Executed',
    template_ebe35xs_result: otpResult
  });
});
