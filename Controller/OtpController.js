const User= require("../Models/UserSchema.js");

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure Nodemailer (Gmail example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'havenseekpvt@gmail.com', // Your email
        pass: process.env.MAIL_PASSWORD     // Your app password
    }
});
// Store OTPs temporarily (use Redis in production)
const otpStore = {};

module.exports.sendOtp= async(req,res)=>{
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        // Store OTP with expiry (5 minutes)
        otpStore[email] = {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000 // 5 minutes
        };
        // Email template
        const mailOptions = {
            from: 'HavenSeek <no-reply@gmail.com>',
            to: email,
            subject: 'Email Verification - HavenSeek',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">HavenSeek</h1>
                        <p style="color: #e0e7ff; margin: 10px 0 0 0;">Your Trusted Property Platform</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                        <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">Email Verification</h2>
                        
                        <p style="color: #6b7280; text-align: center; margin-bottom: 30px;">
                            Welcome to HavenSeek! Please use the verification code below to complete your registration:
                        </p>
                        
                        <div style="background: #f8fafc; border: 2px dashed #4f46e5; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
                            <h1 style="color: #4f46e5; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
                        </div>
                        
                        <p style="color: #6b7280; text-align: center; font-size: 14px; margin-top: 30px;">
                            This code will expire in 5 minutes. If you didn't request this verification, please ignore this email.
                        </p>
                        
                        <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                © 2025 HavenSeek. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>`
        };
        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}: ${otp}`); // For debugging
        res.json({ 
            success: true, 
            message: 'OTP sent successfully',
            // Don't send OTP in response for security
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP. Please try again.' 
        });
    }
}

module.exports.verifyOtp= async(req,res)=>{
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }
        const storedData = otpStore[email];
        if (!storedData) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP not found. Please request a new one.' 
            });
        }
        if (Date.now() > storedData.expires) {
            delete otpStore[email];
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired. Please request a new one.' 
            });
        }
        if (storedData.otp !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP. Please try again.' 
            });
        }
        // OTP is valid
        delete otpStore[email]; // Remove used OTP
        res.json({ 
            success: true, 
            message: 'Email verified successfully' 
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to verify OTP. Please try again.' 
        });
    }
}