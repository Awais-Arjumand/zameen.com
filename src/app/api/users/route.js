import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/models/User';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request) {
  try {
    // Ensure DB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Parse form data
    const formData = await request.formData();
    const fullName = formData.get('fullName');
    const companyName = formData.get('companyName');
    const logoColor = formData.get('logoColor');
    const phone = formData.get('phone');
    const logoFile = formData.get('logo');

    // Basic validation
    if (!fullName || !companyName || !phone || !logoFile) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Phone number already registered' },
        { status: 409 }
      );
    }

    // Format company name to kebab-case
    const formattedCompany = companyName.trim().replace(/\s+/g, '_').toLowerCase();

    // Upload logo
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(logoFile.name);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const savePath = path.join(uploadDir, uniqueName);
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    await fs.writeFile(savePath, buffer);

    const logoPath = `/uploads/logos/${uniqueName}`;

    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user in DB
    const newUser = await User.create({
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
        message: 'User created successfully',
        data: {
          phone: newUser.phone,
          companyName: newUser.companyName
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
