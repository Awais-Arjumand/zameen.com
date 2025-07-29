import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { User } from '../../../../src/models/User';

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Get form data
    const formData = await request.formData();
    const fullName = formData.get('fullName');
    const companyName = formData.get('companyName');
    const logoColor = formData.get('logoColor');
    const phone = formData.get('phone');
    const logoFile = formData.get('logo');

    // Validate input
    if (!fullName || !companyName || !logoFile || !phone) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Phone number already registered" },
        { status: 409 }
      );
    }

    // Format company name
    const formattedCompany = companyName.trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

    // Handle file upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = path.extname(logoFile.name);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Convert file to buffer and write to disk
    const fileBuffer = await logoFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // Create relative path for the logo
    const logoPath = `/uploads/logos/${fileName}`;

    // Generate OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = await User.create({
      fullName,
      companyName: formattedCompany,
      logo: logoPath,
      logoColor,
      phone,
      verificationCode,
      verified: false
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "User created successfully",
        data: {
          phone: user.phone,
          companyName: user.companyName
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}