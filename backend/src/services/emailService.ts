// Study Student Shop (SSS) EmailJS Integration Service

const EMAILJS_PUBLIC_KEY = 'IpvuIpdPsVjRYtrFx';
const EMAILJS_PRIVATE_KEY = 'xcG-bzRyHIGzFPEeXEIEe';
const EMAILJS_SERVICE_ID = 'default_service';

export const EMAIL_TEMPLATES = {
  OTP_VERIFICATION: 'template_ebe35xs',
  ORDER_RECEIPT: 'template_wd31c8a'
};

interface SendEmailParams {
  templateId: string;
  templateParams: Record<string, any>;
}

export async function sendEmailJS({ templateId, templateParams }: SendEmailParams): Promise<{ success: boolean; data?: string; error?: string }> {
  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_PRIVATE_KEY,
    template_params: {
      ...templateParams,
      // Supply all standard recipient variables for template compatibility
      to_email: templateParams.email || templateParams.to_email,
      user_email: templateParams.email || templateParams.to_email,
      reply_to: templateParams.email || templateParams.to_email,
      email: templateParams.email || templateParams.to_email,
      recipient: templateParams.email || templateParams.to_email,
      to_name: templateParams.name || templateParams.to_name || 'Student',
      user_name: templateParams.name || templateParams.to_name || 'Student'
    }
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const text = await res.text();
      console.log(`📧 EmailJS [${templateId}] sent successfully to ${payload.template_params.to_email}`);
      return { success: true, data: text };
    } else {
      const errText = await res.text();
      console.warn(`EmailJS warning (${res.status}):`, errText);
      return { success: false, error: errText };
    }
  } catch (err: any) {
    console.error('EmailJS network error:', err);
    return { success: false, error: err.message };
  }
}

// 1. Send OTP for Email Verification or Password Reset (Template: template_ebe35xs)
export async function sendOtpVerificationEmail(email: string, name: string, otpCode: string, purpose: string = 'University Email Verification') {
  return await sendEmailJS({
    templateId: EMAIL_TEMPLATES.OTP_VERIFICATION,
    templateParams: {
      email,
      name,
      otp_code: otpCode,
      code: otpCode,
      subject: `[SSS] Your ${purpose} Security Code: ${otpCode}`,
      message: `Your 6-digit verification code for Study Student Shop is ${otpCode}. It is valid for 10 minutes. Please do not share this code with anyone.`
    }
  });
}

// 2. Send Order Confirmation & Invoice (Template: template_wd31c8a)
export async function sendOrderReceiptEmail(email: string, name: string, orderData: {
  orderId: string;
  totalAmount: number;
  itemsList: string;
  shippingAddress: string;
  vendorName?: string;
}) {
  return await sendEmailJS({
    templateId: EMAIL_TEMPLATES.ORDER_RECEIPT,
    templateParams: {
      email,
      name,
      order_id: orderData.orderId,
      total_amount: `₹${orderData.totalAmount}`,
      order_details: orderData.itemsList,
      shipping_address: orderData.shippingAddress,
      vendor_source: orderData.vendorName || 'Lowest Price Aggregated Vendor (Amazon/Flipkart)',
      subject: `[SSS] Order Confirmation #${orderData.orderId} - ₹${orderData.totalAmount}`,
      message: `Thank you for ordering on Study Student Shop. Your books have been scheduled for automated lowest-price fulfillment. Total: ₹${orderData.totalAmount}.`
    }
  });
}

// 3. Send Cancellation & Refund Notification (Template: template_wd31c8a)
export async function sendCancellationNoticeEmail(email: string, name: string, orderId: string, refundAmount: number, reason: string) {
  return await sendEmailJS({
    templateId: EMAIL_TEMPLATES.ORDER_RECEIPT,
    templateParams: {
      email,
      name,
      order_id: orderId,
      total_amount: `₹${refundAmount} (Refunded)`,
      order_details: `Order Cancellation: ${reason}`,
      subject: `[SSS] Cancellation & Refund Receipt for Order #${orderId}`,
      message: `Your order #${orderId} has been cancelled. A refund of ₹${refundAmount} has been credited to your campus student wallet.`
    }
  });
}
